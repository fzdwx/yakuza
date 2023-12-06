import { Command } from "launcher-api";
import { useEffect, useState } from "react";
import { getLocalExtensions, LocalExtension } from "@/native";

const useLocalExtensions = () => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<LocalExtension[]>([])

    useEffect(() => {
        setLoading(true)
        getLocalExtensions().then((apps) => {
            setExtensions(apps)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {
        extensions,
        loading
    }
}

const extension = () => {
    const { extensions, loading } = useLocalExtensions()
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
                <img className="w-4" alt='img' src={item.icon} />
                <span>{item.name}</span>
            </Command.Item>
        )) : <></>}
        <Command.Item key="Dev Mode" onSelect={() => {
            window.launcher.loadDevView()
        }}>
            <span className="w-4">🛠</span>
            <span>Dev Mode</span>
        </Command.Item>
    </Command.Group>)
}

export default extension
