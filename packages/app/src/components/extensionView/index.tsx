import React, {useEffect} from "react";
import {useTimeout} from "ahooks";

const ExtensionView = (props: { transport: boolean }) => {
    const commandRef = React.useRef<HTMLInputElement>(null)
    useTimeout(() => {
        if (commandRef.current)
            commandRef.current.className = ""
    }, 100)

    if (props.transport) {
        return <div ref={commandRef} className='h-1000 bg-dark'></div>
    }

    return (<div ref={commandRef} className="h-1000 bg-dark">
    </div>)
}

export default ExtensionView
