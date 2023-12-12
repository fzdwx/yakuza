import {useViewEvent} from "@/hooks/useView";
import {Command} from "launcher-api";
import StoreIcon from "@/components/store/storeIcon";
import {useEffect, useState} from "react";
import {Application, Builtin, getApplications, getBuiltin, LocalExtension, SearchResp} from "@/native";
import {useHover} from "@/components/self/hooks";

const useBuiltin = () => {
    const [loading, setLoading] = useState(true)
    const [builtins, setBuiltin] = useState<string[]>(["Store", "Dev Mode"])

    return {
        builtins,
        loading,
    }
}
const {changeView} = useViewEvent();

const StoreItem = (props: { item: SearchResp<Builtin> }) => {
    return <Command.Item
        value='store'
        data-value='store'
        key={props.item.id}
        launcher-id={props.item.id}
        onHover={() => {
            change(props.item)
        }}
        onSelect={() => {
            changeView("store")
        }}>
        <StoreIcon/>
        Store
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const {change} = useHover()
const DevMode = (props: { item: SearchResp<Builtin> }) => {
    return <Command.Item
        value='Dev Mode'
        data-value='Dev Mode'
        key={props.item.id}
        launcher-id={props.item.id}
        onHover={() => {
            change(props.item)
        }}
        onSelect={() => {
            changeView("extView")
            //@ts-ignore
            window.launcher.loadDevView()
        }}>
        <span className="w-4">🛠</span>
        Dev Mode
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const getItem = (item: SearchResp<Builtin>) => {
    switch (item.item.name) {
        case "Store":
            return <StoreItem item={item}/>
        case "Dev Mode":
            return <DevMode item={item}/>
        default:
            return <></>
    }
}

const Builtin = ({item}: { item: SearchResp<Builtin> }) => {
    return <>
        {getItem(item)}
    </>
}

export {useBuiltin}

export default Builtin

