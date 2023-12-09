import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {Application, getLocalExtensions, LocalExtension} from "@/native";
import {SearchResp} from "@/native/types";

const useLocalExtensions = (searchText: string) => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<SearchResp<LocalExtension>[]>([])

    const get = async (searchText: string) => {
        setLoading(true)
        const ext = await getLocalExtensions(searchText)
        setExtensions(ext)
        setLoading(false)
    }
    useEffect(() => {
        get(searchText)
    }, [searchText])

    // useInterval(() => {
    //     if (doingSearch({searchText})) return
    //
    //     get(searchText)
    // }, 1000)

    return {
        extensions,
        loading
    }
}

const LocalExtensionItem = ({item}: { item: SearchResp<LocalExtension> }) => {
    return (<Command.Item
        value={item.item.name}
        onSelect={() => {
            // @ts-ignore
            window.launcher.openExtension(item.item)
        }}
    >
        <img className="w-4" alt='img' src={item.item.icon}/>
        <span>{item.item.name}</span>
    </Command.Item>)
}

export {useLocalExtensions}

export default LocalExtensionItem
