import {Command, WindowIcon, FinderIcon, StarIcon} from 'launcher-api'
import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import {SubItem} from './index'

function SubCommand({
                        inputRef,
                        listRef,
                        selectedValue,
                    }: {
    inputRef: React.RefObject<HTMLInputElement>
    listRef: React.RefObject<HTMLElement>
    selectedValue: string
}) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        function listener(e: KeyboardEvent) {
            console.log("12313")
            if (e.key === 'k' && e.metaKey) {
                e.preventDefault()
                setOpen((o) => !o)
            }
        }

        document.addEventListener('keydown', listener)

        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, [])

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
                            <SubItem shortcut="ctrl ↵">
                                <FinderIcon/>
                                Show in Finder
                            </SubItem>
                            <SubItem shortcut="ctrl I">
                                <FinderIcon/>
                                Show Info in Finder
                            </SubItem>
                            <SubItem shortcut="ctrl ⇧ F">
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

