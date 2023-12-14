import React from "react";

const ExtensionView = (props: { transport: boolean }) => {
    if (props.transport) {
        return <div className=''></div>
    }

    return (<div className="h-1000 bg-dark">
    </div>)
}

export default ExtensionView
