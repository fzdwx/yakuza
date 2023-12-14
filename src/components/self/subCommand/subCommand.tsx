import {Command, WindowIcon, FinderIcon, StarIcon, useCommandState} from 'launcher-api'
import React, {useState} from 'react'
import * as Popover from '@radix-ui/react-popover'
import {SubItem} from './index'
import {useKeyPress} from "ahooks";
import {IsApplication, IsBuiltin, IsLocalExtension, SearchItem, SearchResp} from "@/native";
import {shell} from "electron";
import {getText} from "@/components/self/helper";
import {KeyboardIcon} from "@/components/icons";

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

    useKeyPress('ctrl.k', (e) => {
        e.preventDefault()
        setOpen((o) => !o)
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
                <kbd>⌘</kbd>
                <kbd>K</kbd>
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
                            {openInFolder(currentItem)}
                            {setShortcut(currentItem)}
                        </Command.Group>
                    </Command.List>
                    <Command.Input placeholder="Search for actions..."/>
                </Command>
            </Popover.Content>
        </Popover.Root>
    )
}


const openInFolder = (currentItem: SearchResp<SearchItem> | undefined) => {
    if (currentItem && IsLocalExtension(currentItem))
        return (<SubItem shortcut="⌘ ↵" s={() => {
            if (currentItem) {
                shell.openPath(currentItem.item.fullPath)
            }
        }}>
            <FinderIcon/>
            Show in Finder
        </SubItem>)
    return (<></>)
}

const setShortcut = (currentItem: SearchResp<SearchItem> | undefined) => {
    if (currentItem && (IsApplication(currentItem) || IsBuiltin(currentItem) || IsLocalExtension(currentItem))) {
        return (<SubItem shortcut="⌘ ⇧ S" s={() => {
        }}>
            <KeyboardIcon/>
            Set Shortcut
        </SubItem>)
    }
    return (<></>)
}

export default SubCommand;

