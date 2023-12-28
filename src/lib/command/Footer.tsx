import {Action, ActionImpl, Input, RenderItem, ResultsRender, useActionStore, useMatches} from "@/lib/command";
import * as React from "react";
import {useMemo} from "react";
import {useKeyPress} from "ahooks";
import * as Popover from "@radix-ui/react-popover";

export const Footer: React.FC<{
    current: string | ActionImpl | null,
    icon: string | React.ReactElement
    actions?: (current: string | ActionImpl | null) => Action[]
    content: (current?: string | ActionImpl | null) => string | React.ReactElement
    onSubCommandShow?: () => void
    onSubCommandHide?: () => void
}> = ({current, actions, icon, content, onSubCommandShow, onSubCommandHide}) => {
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
                        onSubCommandShow={() => {
                            if (onSubCommandShow) {
                                onSubCommandShow()
                            }
                        }}
                        onSubCommandHide={() => {
                            if (onSubCommandHide) {
                                onSubCommandHide()
                            }
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

    const [inputValue, setInputValue] = React.useState("");
    const {useRegisterActions, state, setActiveIndex, setRootActionId} = useActionStore();
    useRegisterActions(actions)
    const {results, rootActionId} = useMatches(inputValue, state.actions, state.rootActionId);

    return <Popover.Root open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger className='command-subcommand-trigger' onClick={changeVisible} aria-expanded={open}>
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
                setInputValue("")
            }}
        >
            <div className='command-submenu'>
                <ResultsRender items={results}
                               maxHeight={150}
                               height='auto'
                               handleKeyEvent={true}
                               setActiveIndex={setActiveIndex}
                               search={inputValue}
                               setSearch={setInputValue}
                               setRootActionId={setRootActionId}
                               currentRootActionId={state.rootActionId}
                               activeIndex={state.activeIndex}
                               onRender={({item, active}) => {
                                   if (typeof item === "string") {
                                       return <div>{item}</div>
                                   }

                                   return <RenderItem
                                       active={active}

                                       action={item}
                                       currentRootActionId={rootActionId ?? ''}
                                   />
                               }
                               }
                />
                <Input value={inputValue}
                       onValueChange={setInputValue}
                       actions={state.actions}
                       currentRootActionId={state.rootActionId}
                       onCurrentRootActionIdChange={setRootActionId}
                />
            </div>
        </Popover.Content>
    </Popover.Root>
}

