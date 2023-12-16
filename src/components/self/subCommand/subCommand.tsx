import {Command, FinderIcon, WindowIcon} from 'launcher-api'
import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import {SubItem} from './index'
import {useKeyPress} from "ahooks";
import {IsApplication, IsBuiltin, IsLocalExtension, SearchItem, SearchResp} from "@/native";
import {shell} from "electron";
import {getText} from "@/components/self/helper";
import {KeyboardIcon} from "@/components/icons";
import {useViewEvent} from "@/hooks/useView";
import {useSettingsStore} from "@/hooks/useSettingsStore";

function SubCommand({
                        inputRef,
                        listRef,
                        selectedValue,
                        currentItem
                    }: {
    inputRef: React.RefObject<HTMLInputElement>,
    listRef: React.RefObject<HTMLElement>,
    selectedValue: string,
    currentItem: SearchResp<SearchItem> | undefined
}) {
    const [open, setOpen] = React.useState(false)
    const changeVisible = () => setOpen((o) => !o)

    useKeyPress('ctrl.k', (e) => {
        e.preventDefault()
        changeVisible()
    })

    React.useEffect(() => {
        const el = listRef.current

        if (!el) return

        if (open) {
            el.style.overflow = 'hidden'
        } else {
            el.style.overflow = ''
        }
    }, [open, listRef])

    return (
        <Popover.Root open={open} onOpenChange={setOpen} modal>
            <Popover.Trigger cmdk-raycast-subcommand-trigger="" onClick={() => setOpen(true)} aria-expanded={open}>
                Actions
                <kbd>ctrl</kbd>
                <kbd>k</kbd>
            </Popover.Trigger>
            <Popover.Content
                side="top"
                align="end"
                className="raycast-submenu"
                sideOffset={16}
                alignOffset={0}
                onCloseAutoFocus={(e) => {
                    e.preventDefault()
                    inputRef?.current?.focus()
                }}
            >
                <Command>
                    <Command.List>
                        <Command.Group heading={selectedValue}>
                            <SubItem shortcut="↵">
                                <WindowIcon/>
                                {getText(currentItem)}
                            </SubItem>
                            {openInFolder(currentItem, changeVisible)}
                            {openSetting(currentItem, changeVisible)}
                        </Command.Group>
                    </Command.List>
                    <Command.Input placeholder="Search for actions..."/>
                </Command>
            </Popover.Content>
        </Popover.Root>
    )
}


const openInFolder = (currentItem: SearchResp<SearchItem> | undefined, changeVisible: () => void) => {
    useKeyPress('ctrl.enter', (e) => {
        e.preventDefault()
        if (currentItem && IsLocalExtension(currentItem)) {
            shell.openPath(currentItem.item.fullPath)
            changeVisible()
        }
    })
    if (currentItem && IsLocalExtension(currentItem)) {
        return (<SubItem shortcut="ctrl ↵" s={() => {
            if (currentItem) {
                shell.openPath(currentItem.item.fullPath)
                changeVisible()
            }
        }}>
            <FinderIcon/>
            Show in Folder
        </SubItem>)
    }

    return (<></>)
}

const openSetting = (currentItem: SearchResp<SearchItem> | undefined, changeVisible: () => void) => {
    const {changeView} = useViewEvent()
    const {setCurrentItem} = useSettingsStore()
    if (currentItem && (IsApplication(currentItem) || IsBuiltin(currentItem) || IsLocalExtension(currentItem))) {
        return (<SubItem shortcut="ctrl ⇧ S" s={() => {
            changeView("settings")
            setCurrentItem(currentItem)
            changeVisible()
        }}>
            <KeyboardIcon/>
            Setting
        </SubItem>)
    }
    return (<></>)
}

export default SubCommand;

