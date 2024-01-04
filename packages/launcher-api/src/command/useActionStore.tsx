import {Action, ActionTree} from "./types";
import {ActionInterface} from "./action";
import * as React from "react";
import {useState} from "react";
import {ActionId} from ".";

interface State {
    actions: ActionTree
    rootActionId: ActionId | null;
    activeIndex: number
    resultHandleEvent: boolean
}

export const useActionStore = (actions?: Action[]) => {
    const actionsInterface = React.useMemo(
        () =>
            new ActionInterface(actions || [], {
                historyManager: undefined,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actions]
    )

    const [state, setState] =
        useState<State>({
            actions: {...actionsInterface.actions},
            rootActionId: null,
            activeIndex: 0,
            resultHandleEvent: true
        });

    const registerActions = React.useCallback(
        (actions: Action[]) => {
            setState((state) => {
                return {
                    ...state,
                    actions: actionsInterface.add(actions),
                };
            })

            return function unregister() {
                setState((state) => {
                    return {
                        ...state,
                        actions: actionsInterface.remove(actions),
                    };
                })
            };
        },
        [actionsInterface]
    );

    const setRootActionId = React.useCallback(
        (rootActionId: ActionId | null) => {
            setState((state) => {
                return {
                    ...state,
                    rootActionId,
                };
            });
        },
        []
    );

    const setResultHandleEvent = (b: boolean) => {
        setState((state) => {
            return {
                ...state,
                resultHandleEvent: b,
            };
        });
    }

    const setActiveIndex = (cb) =>
        setState((state) => ({
            ...state,
            activeIndex: typeof cb === "number" ? cb : cb(state.activeIndex),
        }))

    const useRegisterActions = (actions: Action[], dependencies: React.DependencyList = []) => {
        const actionsCache = React.useMemo(() => actions, dependencies);
        React.useEffect(() => {
            if (!actionsCache.length) {
                return;
            }

            const unregister = registerActions(actionsCache);
            return () => {
                unregister();
            };
        }, [registerActions, actionsCache]);
    }

    return {
        useRegisterActions,
        setRootActionId,
        setActiveIndex,
        setResultHandleEvent,
        state
    }
}

export type UseRegisterActions = (actions: Action[], dependencies?: React.DependencyList) => void
