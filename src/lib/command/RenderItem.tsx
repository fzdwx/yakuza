import React from "react";
import {ActionImpl} from "@/lib/command/action";
import {ActionId} from "@/lib/command/types";

const RenderItem = React.forwardRef(
    (
        {
            action,
            active,
            currentRootActionId,
            style
        }: {
            action: ActionImpl;
            active: boolean;
            currentRootActionId: ActionId;
            style?: React.CSSProperties;
        },
        ref: React.Ref<HTMLDivElement>,
    ) => {
        const ancestors = React.useMemo(() => {
            if (!currentRootActionId) return action.ancestors;
            const index = action.ancestors.findIndex(
                (ancestor: any) => ancestor.id === currentRootActionId,
            );
            // +1 removes the currentRootAction; e.g.
            // if we are on the "Set theme" parent action,
            // the UI should not display "Set theme… > Dark"
            // but rather just "Dark"
            return action.ancestors.slice(index + 1);
        }, [action.ancestors, currentRootActionId]);

        return (
            <div
                ref={ref}
                style={{
                    padding: '12px 16px',
                    background: active ? 'var(--hover)' : 'transparent',
                    borderLeft: `3px solid ${active ? 'var(--primary)' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    ...style,
                }}
                className='commnad-item'
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        fontSize: 14,
                    }}
                >
                    {action.icon && action.icon}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div>
                            {ancestors?.length > 0 &&
                                ancestors.map((ancestor: any) => (
                                    <React.Fragment key={ancestor.id}>
                    <span
                        style={{
                            opacity: 0.5,
                            marginRight: 8,
                        }}
                    >
                      {ancestor.name}
                    </span>
                                        <span
                                            style={{
                                                marginRight: 8,
                                            }}
                                        >
                      &rsaquo;
                    </span>
                                    </React.Fragment>
                                ))}
                            <span>{action.name}</span>
                        </div>
                        {action.subtitle && (
                            <span style={{fontSize: 12}}>{action.subtitle}</span>
                        )}
                    </div>
                </div>
                {action.shortcut?.length ? (
                    <div
                        aria-hidden
                        style={{display: 'grid', gridAutoFlow: 'column', gap: '4px'}}
                    >
                        {action.shortcut.map((sc: any) => (
                            <kbd
                                key={sc}
                                style={{
                                    padding: '4px 6px',
                                    background: 'var(--hover2)',
                                    borderRadius: '4px',
                                    fontSize: 14,
                                }}
                            >
                                {sc}
                            </kbd>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    },
);

export {RenderItem}
