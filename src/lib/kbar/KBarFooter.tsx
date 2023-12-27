import * as React from "react";
import {Action} from "@/lib/kbar/types";
import {useEffect, useMemo, useState} from "react";
import {ActionImpl} from "@/lib/kbar/action";
import {useKeyPress} from "ahooks";
import {useKBar} from "@/lib/kbar/useKBar";
import * as Popover from "@radix-ui/react-popover";
import RenderItem from "@/lib/kbar/RenderItem";
import {nanoid} from "nanoid";

export interface KBarFooterProps {
    actions?: (current?: Action) => Action[]
    icon: string | React.ReactElement
    content: (current?: Action) => string | React.ReactElement
}

const KBarFooter: React.FC<{
    current?: Action,
    footer: KBarFooterProps
    onSubCommandShow: () => void
    onSubCommandHide: () => void
}> = ({current, footer, onSubCommandShow, onSubCommandHide}) => {
    const actions = useMemo(() => {
        return footer.actions ? footer.actions(current).map(a => ActionImpl.create(a, {
            store: {}
        })) : []
    }, [current, footer.actions]);

    return <>
        <div className='kbar-footer-icon'>
            {footer.icon}
        </div>
        <div className='kbar-footer-content'>
            {footer.content(current)}
        </div>

        {
            actions ? <>
                    <KBarFooterHr/>
                    <KBarFooterActions
                        onSubCommandShow={onSubCommandShow}
                        onSubCommandHide={onSubCommandHide}
                        actions={actions}
                    />
                </>
                : <></>
        }
    </>
}

export const KBarFooterHr: React.FC = () => {
    return (
        <hr className='kbar-footer-hr'/>
    );
}

const KBarFooterActions: React.FC<{
    actions: ActionImpl[],
    initialOpen?: boolean,
    initialShortcut?: string // default 'ctrl.k'
    onSubCommandShow: () => void
    onSubCommandHide: () => void
}> = ({
          actions,
          initialOpen,
          initialShortcut,
          onSubCommandShow,
          onSubCommandHide
      }) => {
    const [open, setOpen] = React.useState(initialOpen || false)
    const [shortcut, setShortcut] = React.useState(initialShortcut || 'ctrl.k')
    const changeVisible = () => setOpen((o) => !o)
    useKeyPress(shortcut, (e) => {
        e.preventDefault()
        changeVisible()
    })
    React.useEffect(() => {
        if (open) {
            query.getInput().blur()
            onSubCommandShow()
        }
    }, [open])

    const {query} = useKBar()

    return <Popover.Root open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger className='kbar-subcommand-trigger' onClick={() => setOpen(true)} aria-expanded={open}>
            <span>Actions</span>
            {shortcut.split('.').map((s, i) => <kbd key={i}>{s}</kbd>)}
        </Popover.Trigger>
        <Popover.Content
            side="top"
            align="end"
            className="kbar-subcommand-menu"
            sideOffset={16}
            alignOffset={0}
            onCloseAutoFocus={(e) => {
                e.preventDefault()
                query.getInput().focus()
                onSubCommandHide()
            }}
        >
            <div className='kbar-subcommand-menu-content'>
                <RenderFooterActions actions={actions}/>
            </div>
        </Popover.Content>
    </Popover.Root>
}


const RenderFooterActions = ({actions}: { actions: ActionImpl[] }) => {
    const [selectedActionIndex, setSelectedActionIndex] = useState(0);

    useKeyPress("uparrow", () => {
        setSelectedActionIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : actions.length - 1));
    })
    useKeyPress("downarrow", () => {
        setSelectedActionIndex(prevIndex => (prevIndex < actions.length - 1 ? prevIndex + 1 : 0));
    })
    useKeyPress("enter", () => {
        const selectedAction = actions[selectedActionIndex];
        if (selectedAction && selectedAction.command) {
            selectedAction.command.perform(selectedAction.command)
        }
    })

    return (
        <ul>
            {actions.map((action, index) => (
                <RenderItem
                    key={nanoid()}
                    active={index === selectedActionIndex}
                    action={action}
                    currentRootActionId={''}
                />
            ))}
        </ul>
    );
};


export default KBarFooter
