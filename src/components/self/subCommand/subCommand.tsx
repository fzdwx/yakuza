import {Command, WindowIcon, FinderIcon, StarIcon, useCommandState} from 'launcher-api'
import React, {useState} from 'react'
import * as Popover from '@radix-ui/react-popover'
import {SubItem} from './index'
import {useKeyPress} from "ahooks";
import {IsApplication, IsBuiltin, IsLocalExtension, SearchItem, SearchResp} from "@/native";

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

    useKeyPress('ctrl.k', () => {
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
                                Open Application
                            </SubItem>
                            <SubItem shortcut="⌘ ↵">
                                <FinderIcon/>
                                Show in Finder
                            </SubItem>
                            <SubItem shortcut="⌘ I">
                                <FinderIcon/>
                                Show Info in Finder
                            </SubItem>
                            <SubItem shortcut="⌘ ⇧ F">
                                <StarIcon/>
                                Add to Favorites
                            </SubItem>
                        </Command.Group>
                    </Command.List>
                    <Command.Input placeholder="Search for actions..."/>
                </Command>
            </Popover.Content>
        </Popover.Root>
    )
}

export default SubCommand;

