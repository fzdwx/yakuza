import {Command, useCommandState} from "launcher-api";
import {useEffect, useState} from "react";
import {getLocalExtensions, LocalExtension} from "@/native";
import StoreItem from "@/components/store/storeItem";
import {useInterval} from "ahooks";

const useLocalExtensions = () => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<LocalExtension[]>([])

    const get = async () => {
        setLoading(true)
        const ext = await getLocalExtensions()
        setExtensions(ext)
        setLoading(false)
    }
    useEffect(() => {
        get()
    }, [])
    useInterval(get, 1000)

    return {
        extensions,
        loading
    }
}

const localExtension = () => {
    const {extensions, loading} = useLocalExtensions()
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
                {item.name}
            </Command.Item>
        )) : <></>}
        <Command.Item key="Dev Mode" onSelect={() => {
            window.launcher.loadDevView()
        }}>
            <span className="w-4">🛠</span>
            Dev Mode
        </Command.Item>
        <StoreItem/>
    </Command.Group>)
}

export default localExtension
