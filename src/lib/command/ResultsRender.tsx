import {ActionId, ActionImpl, getListboxItemId, KBAR_LISTBOX} from "@/lib/command";
import * as React from "react";
import {useState} from "react";
import {useVirtual} from "react-virtual";
import {usePointerMovedSinceMount} from "@/lib/command/utils";

const START_INDEX = 0;

interface RenderParams<T = ActionImpl | string> {
    item: T;
    active: boolean;
}

interface ResultsRenderProps {
    items: any[];
    onRender: (params: RenderParams) => React.ReactElement;
    maxHeight?: number;
    height?: number | 'auto';
    width?: string | 'auto' | "100%";
    detailsClassName?: string;

    details?: React.ReactElement;

    setSearch(value: string): void;

    search: string;
    activeIndex: number,
    handleKeyEvent: boolean

    setActiveIndex: (cb: number | ((currIndex: number) => number)) => void;
    setRootActionId: (rootActionId: ActionId) => void;
    currentRootActionId: ActionId | null;
}

export const ResultsRender: React.FC<ResultsRenderProps> = (props) => {
    const activeRef = React.useRef<HTMLDivElement>(null);
    const parentRef = React.useRef(null);

    // store a ref to all items so we do not have to pass
    // them as a dependency when setting up event listeners.
    const itemsRef = React.useRef(props.items);
    itemsRef.current = props.items;

    const rowVirtualizer = useVirtual({
        size: itemsRef.current.length,
        parentRef,
    });


    React.useEffect(() => {
        const handler = (event) => {
            if (!props.handleKeyEvent) {
                return;
            }

            if (event.isComposing) {
                return;
            }

            if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
                event.preventDefault();
                event.stopPropagation();
                props.setActiveIndex((index) => {
                    return index > 0 ? index - 1 : props.items.length - 1
                    // let nextIndex = index > START_INDEX ? index - 1 : index;
                    // // avoid setting active index on a group
                    // if (typeof itemsRef.current[nextIndex] === "string") {
                    //     if (nextIndex === 0) return index;
                    //     nextIndex -= 1;
                    // }
                    // return nextIndex;
                });
            } else if (
                event.key === "ArrowDown" ||
                (event.ctrlKey && event.key === "n")
            ) {
                event.preventDefault();
                event.stopPropagation();
                props.setActiveIndex((index) => {
                    return index < props.items.length - 1 ? index + 1 : 0
                    // let nextIndex =
                    //     index < itemsRef.current.length - 1 ? index + 1 : index;
                    // // avoid setting active index on a group
                    // if (typeof itemsRef.current[nextIndex] === "string") {
                    //     if (nextIndex === itemsRef.current.length - 1) return index;
                    //     nextIndex += 1;
                    // }
                    // return nextIndex;
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
    }, [props.setActiveIndex, props.handleKeyEvent]);

    // destructuring here to prevent linter warning to pass
    // entire rowVirtualizer in the dependencies array.
    const {scrollToIndex} = rowVirtualizer;
    React.useEffect(() => {
        scrollToIndex(props.activeIndex, {
            // ensure that if the first item in the list is a group
            // name and we are focused on the second item, to not
            // scroll past that group, hiding it.
            align: props.activeIndex <= 1 ? "end" : "auto",
        });
    }, [props.activeIndex, scrollToIndex]);

    React.useEffect(() => {
        // TODO(tim): fix scenario where async actions load in
        // and active index is reset to the first item. i.e. when
        // users register actions and bust the `useRegisterActions`
        // cache, we won't want to reset their active index as they
        // are navigating the list.
        props.setActiveIndex(
            // avoid setting active index on a group
            typeof props.items[START_INDEX] === "string"
                ? START_INDEX + 1
                : START_INDEX
        );
    }, [props.search, props.currentRootActionId, props.items]);

    const execute = React.useCallback(
        (item: RenderParams["item"]) => {
            if (typeof item === "string") return;
            if (item.command) {
                item.command.perform(item);
            } else {
                props.setSearch("");
                props.setRootActionId(item.id);
            }
        },
        [props.setSearch, props.setRootActionId]
    );

    const pointerMoved = usePointerMovedSinceMount();

    return (
        <div className='flex'>
            <div
                ref={parentRef}
                style={{
                    maxHeight: props.maxHeight || '450px',
                    height: props.height || '450px',
                    position: "relative",
                    overflow: "auto",
                    width: props.width || '100%',
                }}
            >
                <div
                    role="listbox"
                    id={KBAR_LISTBOX}
                    style={{
                        height: `${rowVirtualizer.totalSize}px`,
                        width: "100%",
                    }}
                    className='command-listbox'
                >
                    {rowVirtualizer.virtualItems.map((virtualRow) => {
                        const item = itemsRef.current[virtualRow.index];
                        const handlers = typeof item !== "string" && {
                            onPointerMove: () =>
                                pointerMoved &&
                                props.activeIndex !== virtualRow.index &&
                                props.setActiveIndex(virtualRow.index),
                            onPointerDown: () => props.setActiveIndex(virtualRow.index),
                            onClick: () => execute(item),
                        };
                        const active = virtualRow.index === props.activeIndex;

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

            <div className={props.detailsClassName}>
                {props.details}
            </div>
        </div>
    );
};
