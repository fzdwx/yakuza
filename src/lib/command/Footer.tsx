import {Action, ActionImpl} from "@/lib/command";
import * as React from "react";
import {useMemo, useState} from "react";
import {useKeyPress} from "ahooks";
import * as Popover from "@radix-ui/react-popover";
import {RenderItem} from "@/lib/command";
import {nanoid} from "nanoid";


export const Footer: React.FC<{
    current: string | ActionImpl | null,
    actions?: (current: string | ActionImpl | null) => Action[]
    icon: string | React.ReactElement
    content: (current?: string | ActionImpl | null) => string | React.ReactElement
    onSubCommandShow?: () => void
    onSubCommandHide?: () => void
}> = ({current, actions,icon,content, onSubCommandShow, onSubCommandHide}) => {
    const actionsR = useMemo(() => {
        return actions ? actions(current).map(a => ActionImpl.create(a, {
            store: {}
        })) : []
    }, [current, actions]);

    return <div className='command-footer'>
        <div className='command-footer-icon'>
            {icon}
        </div>
        <div className=''>
            {content(current)}
        </div>

        {
            actions ? <>
                    <FooterHr/>
                    <FooterActions
                        onSubCommandShow={onSubCommandShow ? onSubCommandShow : () => {
                        }}
                        onSubCommandHide={onSubCommandHide ? onSubCommandHide : () => {
                        }}
                        actions={actionsR}
                    />
                </>
                : <></>
        }
    </div>
}


export const FooterHr: React.FC = () => {
    return (
        <hr className='command-footer-hr'/>
    );
}

const FooterActions: React.FC<{
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
            onSubCommandShow()
        }
    }, [open])

    return <Popover.Root open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger className='command-subcommand-trigger' onClick={() => setOpen(true)} aria-expanded={open}>
            <span>Actions</span>
            {shortcut.split('.').map((s, i) => <kbd key={i}>{s}</kbd>)}
        </Popover.Trigger>
        <Popover.Content
            side="top"
            align="end"
            sideOffset={16}
            alignOffset={0}
            onCloseAutoFocus={(e) => {
                e.preventDefault()
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