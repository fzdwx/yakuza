import {Command} from "launcher-api";
import {useEffect, useState} from "react";
import {getLocalExtensions, LocalExtension} from "@/native";
import {doingSearch, searchResultIsEmpty} from "@/components/self/helper";
import {useInterval} from "ahooks";

const useLocalExtensions = (searchText: string) => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<LocalExtension[]>([])

    const get = async (searchText: string) => {
        setLoading(true)
        const ext = await getLocalExtensions(searchText)
        setExtensions(ext)
        setLoading(false)
    }
    useEffect(() => {
        get(searchText)
    }, [searchText])

    useInterval(() => {
        if (doingSearch({searchText})) return

        get(searchText)
    }, 1000)

    return {
        extensions,
        loading
    }
}

const localExtension = (props: { searchText: string }) => {
    const {extensions, loading} = useLocalExtensions(props.searchText)

    if (searchResultIsEmpty(extensions, props)) return <></>
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
    </Command.Group>)
}

export default localExtension
