import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {Application, getLocalExtensions, LocalExtension} from "@/native";
import {SearchResp} from "@/native/types";

const useLocalExtensions = (searchText: string) => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<SearchResp<LocalExtension>[]>([])

    const refreshExt = async (searchText: string) => {
        setLoading(true)
        const ext = await getLocalExtensions(searchText)
        setExtensions(ext)
        setLoading(false)
    }
    useEffect(() => {
        refreshExt(searchText)
    }, [searchText])

    return {
        extensions,
        loading,
        refreshExt
    }
}

const LocalExtensionItem = ({item}: { item: SearchResp<LocalExtension> }) => {
    return (<Command.Item
        value={item.item.name}
        data-value={item.item.name}
        onSelect={() => {
            // @ts-ignore
            window.launcher.openExtension(item.item)
        }}
    >
        <img className="w-4" alt='img' src={item.item.icon}/>
        <span className="">{item.item.name}</span>
        <span className="absolute right-2 text-gray/80">{item.kind}</span>
    </Command.Item>)
}

export {useLocalExtensions}

export default LocalExtensionItem
