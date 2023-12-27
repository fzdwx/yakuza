import * as React from "react";
import {useVirtual} from "react-virtual";
import {getListboxItemId, KBAR_LISTBOX} from "./KBarSearch";
import {useKBar} from "./useKBar";
import {usePointerMovedSinceMount} from "./utils";
import {useKeyPress} from "ahooks";
import * as Popover from '@radix-ui/react-popover'
import {ActionImpl, Action} from "@/lib/kbar";
import {useMemo, useState} from "react";

const START_INDEX = 0;

interface RenderParams<T = ActionImpl | string> {
    item: T;
    active: boolean;
}

interface KBarResultsProps {
    items: any[];
    onRender: (params: RenderParams) => React.ReactElement;
    footer: KBarFooterProps;
    maxHeight?: number;
}

interface KBarFooterProps {
    actions?: (current: Action) => Action[]
    icon: string | React.ReactElement
    content: (current: Action) => string | React.ReactElement
}

export const KBarResults: React.FC<KBarResultsProps> = (props) => {
    const activeRef = React.useRef<HTMLDivElement>(null);
    const parentRef = React.useRef(null);
    const [handleKeypress, setHandleKeypress] = useState(true)

    // store a ref to all items so we do not have to pass
    // them as a dependency when setting up event listeners.
    const itemsRef = React.useRef(props.items);
    itemsRef.current = props.items;

    const rowVirtualizer = useVirtual({
        size: itemsRef.current.length,
        parentRef,
    });

    const {query, search, currentRootActionId, activeIndex, options} = useKBar(
        (state) => ({
            search: state.searchQuery,
            currentRootActionId: state.currentRootActionId,
            activeIndex: state.activeIndex,
        })
    );

    React.useEffect(() => {
        const handler = (event) => {
            if (!handleKeypress) {
                return;
            }

            if (event.isComposing) {
                return;
            }

            if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
                event.preventDefault();
                event.stopPropagation();
                query.setActiveIndex((index) => {
                    let nextIndex = index > START_INDEX ? index - 1 : index;
                    // avoid setting active index on a group
                    if (typeof itemsRef.current[nextIndex] === "string") {
                        if (nextIndex === 0) return index;
                        nextIndex -= 1;
                    }
                    return nextIndex;
                });
            } else if (
                event.key === "ArrowDown" ||
                (event.ctrlKey && event.key === "n")
            ) {
                event.preventDefault();
                event.stopPropagation();
                query.setActiveIndex((index) => {
                    let nextIndex =
                        index < itemsRef.current.length - 1 ? index + 1 : index;
                    // avoid setting active index on a group
                    if (typeof itemsRef.current[nextIndex] === "string") {
                        if (nextIndex === itemsRef.current.length - 1) return index;
                        nextIndex += 1;
                    }
                    return nextIndex;
                });
            } else if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                // storing the active dom element in a ref prevents us from
                // having to calculate the current action to perform based
                // on the `activeIndex`, which we would have needed to add
                // as part of the dependencies array.
                activeRef.current?.click();
            }
        };
        window.addEventListener("keydown", handler, {capture: true});
        return () => window.removeEventListener("keydown", handler, {capture: true});
    }, [query, handleKeypress]);

    // destructuring here to prevent linter warning to pass
    // entire rowVirtualizer in the dependencies array.
    const {scrollToIndex} = rowVirtualizer;
    React.useEffect(() => {
        scrollToIndex(activeIndex, {
            // ensure that if the first item in the list is a group
            // name and we are focused on the second item, to not
            // scroll past that group, hiding it.
            align: activeIndex <= 1 ? "end" : "auto",
        });
    }, [activeIndex, scrollToIndex]);

    React.useEffect(() => {
        // TODO(tim): fix scenario where async actions load in
        // and active index is reset to the first item. i.e. when
        // users register actions and bust the `useRegisterActions`
        // cache, we won't want to reset their active index as they
        // are navigating the list.
        query.setActiveIndex(
            // avoid setting active index on a group
            typeof props.items[START_INDEX] === "string"
                ? START_INDEX + 1
                : START_INDEX
        );
    }, [search, currentRootActionId, props.items, query]);

    const execute = React.useCallback(
        (item: RenderParams["item"]) => {
            if (typeof item === "string") return;
            if (item.command) {
                item.command.perform(item);
                query.toggle();
            } else {
                query.setSearch("");
                query.setCurrentRootAction(item.id);
            }
            options.callbacks?.onSelectAction?.(item);
        },
        [query, options]
    );

    const pointerMoved = usePointerMovedSinceMount();

    return (
        <div>
            <div
                ref={parentRef}
                style={{
                    maxHeight: props.maxHeight || '450px',
                    height: '450px',
                    position: "relative",
                    overflow: "auto",
                }}
            >
                <div
                    role="listbox"
                    id={KBAR_LISTBOX}
                    style={{
                        height: `${rowVirtualizer.totalSize}px`,
                        width: "100%",
                    }}
                >
                    {rowVirtualizer.virtualItems.map((virtualRow) => {
                        const item = itemsRef.current[virtualRow.index];
                        const handlers = typeof item !== "string" && {
                            onPointerMove: () =>
                                pointerMoved &&
                                activeIndex !== virtualRow.index &&
                                query.setActiveIndex(virtualRow.index),
                            onPointerDown: () => query.setActiveIndex(virtualRow.index),
                            onClick: () => execute(item),
                        };
                        const active = virtualRow.index === activeIndex;

                        return (
                            <div
                                ref={active ? activeRef : null}
                                id={getListboxItemId(virtualRow.index)}
                                role="option"
                                aria-selected={active}
                                key={virtualRow.index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                {...handlers}
                            >
                                {React.cloneElement(
                                    props.onRender({
                                        item,
                                        active,
                                    }),
                                    {
                                        ref: virtualRow.measureRef,
                                    }
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>
            <div className='kbar-footer'>
                <KBarFooter
                    onSubCommandShow={
                        () => setHandleKeypress(false)
                    }
                    onSubCommandHide={
                        () => setHandleKeypress(true)
                    }
                    footer={props.footer} current={props.items.length === 0 ? null : props.items[activeIndex]}/>
            </div>
        </div>
    );
};

const KBarFooter: React.FC<{
    current?: Action,
    footer: KBarFooterProps
    onSubCommandShow: () => void
    onSubCommandHide: () => void
}> = ({current, footer, onSubCommandShow, onSubCommandHide}) => {
    if (!current) {
        return <>
        </>
    }

    const actions = useMemo(() => {
        return footer.actions ? footer.actions(current) : []
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
    actions: Action[],
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
                {actions.map((a, i) => <div key={i} className='kbar-subcommand-menu-item' onClick={() => {
                    // a.command.perform(a)
                    setOpen(false)
                }}>
                    <div className='kbar-subcommand-menu-item-title'>
                        {a.name}
                    </div>
                    <div className='kbar-subcommand-menu-item-description'>
                    </div>
                </div>)}
            </div>
        </Popover.Content>
    </Popover.Root>
}
