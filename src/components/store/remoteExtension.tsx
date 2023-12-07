import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {getRemoteExtensions, RemoteExtensionResp} from "@/native";

interface Props {
    extensions: RemoteExtensionResp[]
}

const extension = (props: Props) => {
    const {extensions} = props
    return (<Command.Group heading="Extensions">
        {extensions ? extensions.map((item) => (
            <Command.Item
                key={item.name}
                value={item.name}
                onSelect={() => {
                    // @ts-ignore
                    window.launcher.openExtension(item)
                }}
            >
                <img className="w-4" alt='img' src={item.icon}/>
                <span>{item.name}</span>
            </Command.Item>
        )) : <></>}
    </Command.Group>)
}

export default extension
