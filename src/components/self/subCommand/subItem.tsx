import {Command} from "launcher-api";
import {nanoid} from "nanoid";
import React from "react";

function SubItem({children, shortcut, s}: {
    children: React.ReactNode;
    shortcut: string,
    s?: () => void
}) {
    const select = () => {
        if (s) {
            s()
        }
    }

    return (
        <Command.Item key={nanoid()} onSelect={select}>
            {children}
            <div cmdk-raycast-submenu-shortcuts="">
                {shortcut.split(' ').map((key) => {
                    return <kbd key={key}>{key}</kbd>
                })}
            </div>
        </Command.Item>
    )
}

export default SubItem
