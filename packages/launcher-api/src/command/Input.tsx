import * as React from "react";
import {ActionId, ActionTree} from "./types";

export const KBAR_LISTBOX = "kbar-listbox";
export const getListboxItemId = (id: number) => `kbar-listbox-item-${id}`;

interface InputProps {
    value: string;
    actions: ActionTree;
    onValueChange: (value: string) => void
    onCurrentRootActionIdChange: (id: ActionId | null) => void;
    currentRootActionId: ActionId | null

    defaultPlaceholder?: string;
    inputRefSetter?: (ref: HTMLInputElement) => void;
}

export const Input = ({
                          defaultPlaceholder,
                          value,
                          onValueChange,
                          inputRefSetter,
                          onCurrentRootActionIdChange,
                          currentRootActionId,
                          actions
                      }: InputProps) => {
    const [inputValue, setInputValue] = React.useState(value);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    const placeholder = React.useMemo((): string => {
        return defaultPlaceholder ?? "Type a command or search…";
    }, [defaultPlaceholder]);
    return <div>
        <input
            ref={(ref) => {
                if (ref) {
                    if (inputRefSetter) {
                        inputRefSetter(ref);
                    }
                }
            }
            }
            autoFocus
            id='command-input'
            className='command-input'
            autoComplete="off"
            role="combobox"
            spellCheck="false"
            value={inputValue}
            placeholder={placeholder}
            onChange={(event) => {
                setInputValue(event.target.value);
                onValueChange?.(event.target.value);
            }}
            onKeyDown={(event) => {
                if (currentRootActionId && !inputValue && event.key === "Backspace") {
                    if (actions && onCurrentRootActionIdChange) {
                        const parent = actions[currentRootActionId].parent ?? null;
                        onCurrentRootActionIdChange(parent);
                    }
                }
            }}
        />
    </div>
}
