import {useViewEvent} from "@/hooks/useView";
import {Command} from "launcher-api";
import StoreIcon from "@/components/store/storeIcon";
import {useEffect, useState} from "react";
import {Application, getApplications, getBuiltin, LocalExtension, SearchResp} from "@/native";

const useBuiltin = (searchText: string) => {
    const [loading, setLoading] = useState(true)
    const [builtins, setBuiltin] = useState<SearchResp<string>[]>([])

    const refreshApp = async (searchText: string) => {
        setLoading(true)
        const builtin = await getBuiltin(searchText)
        setBuiltin(builtin)
        setLoading(false)
    }
    useEffect(() => {
        refreshApp(searchText)
    }, [searchText])

    return {
        builtins,
        loading,
        refreshApp
    }
}
const {changeView} = useViewEvent();

const StoreItem = () => {
    return <Command.Item
        value='store'
        data-value='store'
        key="Store" onSelect={() => {
        changeView("store")
    }}>
        <StoreIcon/>
        Store
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const DevMode = () => {
    return <Command.Item
        value='Dev Mode'
        data-value='Dev Mode'
        key="Dev Mode" onSelect={() => {
        changeView("extView")
        window.launcher.loadDevView()
    }}>
        <span className="w-4">🛠</span>
        Dev Mode
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const items = {
    "Store": <StoreItem/>,
    "Dev Mode": <DevMode/>
}
const itemNames = Object.keys(items)
const getItem = (name: string) => {
    // @ts-ignore
    return items[name]
}

const Builtin = ({item}: { item: SearchResp<string> }) => {
    return <>
        {getItem(item.item)}
    </>
}

export {useBuiltin}

export default Builtin

