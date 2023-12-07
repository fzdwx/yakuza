import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {
    getRemoteExtensions,
    installExtension,
    RemoteExtension as RemoteExtensionType,
    RemoteExtensionResp
} from "@/native";

interface Props {
    extensions: RemoteExtensionResp[]
    changeExtension: (ext: RemoteExtensionResp) => void
}

const onSelectExt = async (ext: RemoteExtensionResp) => {
    if (ext.installed) {
        // @ts-ignore
        window.launcher.openExtension(ext)
        return
    }

    const text = await installExtension(ext)
    console.log(text)
}

const extension = (props: Props) => {
    const {extensions, changeExtension} = props
    return (<Command.Group heading="Extensions">
        {extensions ? extensions.map((item) => (
            <Command.Item
                key={item.name}
                value={item.name}
                onSelect={async () => {
                    await onSelectExt(item)
                }}
                onHover={() => {
                    changeExtension(item)
                }}
            >
                <img className="w-4" alt='img' src={item.icon}/>
                <span>{item.name}</span>
                {item.installed ? 'true' : 'false'}
            </Command.Item>
        )) : <></>}
    </Command.Group>)
}

export default extension
