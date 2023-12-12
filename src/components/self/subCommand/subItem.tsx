import {Command} from "launcher-api";
import {nanoid} from "nanoid";

function SubItem({children, shortcut}: { children: React.ReactNode; shortcut: string }) {
    return (
        <Command.Item key={nanoid()}>
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
