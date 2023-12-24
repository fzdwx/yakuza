import {useViewEvent} from "@/hooks/useView";
import {Command} from "launcher-api";
import StoreIcon from "@/components/store/storeIcon";
import {useState} from "react";
import {Builtin as BuiltinType, SearchResp} from "@/native";
import {useHover} from "@/components/self/hooks";
import Fs from '../../../assets/file-system.svg'
import {FileSystemIcon} from "@/components/icons";

const storeName = "Store"
const devModeName = "Dev Mode"
const fileSystemName = "File System"

const builtin = [storeName, devModeName, fileSystemName]
const useBuiltin = () => {
    const [loading, setLoading] = useState(true)
    const [builtins, setBuiltin] = useState<string[]>(builtin)

    return {
        builtins,
        loading,
    }
}
const {changeView} = useViewEvent();
const {change} = useHover()

const StoreItem = (props: { item: SearchResp<BuiltinType> }) => {
    return <Command.Item
        value={storeName}
        data-value={storeName}
        key={props.item.id}
        launcher-id={props.item.id}
        onHover={() => {
            change(props.item)
        }}
        onSelect={() => {
            changeView("store")
        }}>
        <StoreIcon/>
        {storeName}
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const DevMode = (props: { item: SearchResp<BuiltinType> }) => {
    return <Command.Item
        value={devModeName}
        data-value={devModeName}
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
        {devModeName}
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const FileSystem = (props: { item: SearchResp<BuiltinType> }) => {
    return <Command.Item
        value={fileSystemName}
        data-value={fileSystemName}
        key={props.item.id}
        onHover={() => {
            change(props.item)
        }}
        onSelect={() => {
            changeView("fs")
        }}>
        <FileSystemIcon/>
        {fileSystemName}
        <span className="absolute right-2 text-gray/80">Builtin</span>
    </Command.Item>
}

const getItem = (item: SearchResp<BuiltinType>) => {
    switch (item.item.name) {
        case storeName:
            return <StoreItem item={item}/>
        case devModeName:
            return <DevMode item={item}/>
        case fileSystemName:
            return <FileSystem item={item}/>
        default:
            return <></>
    }
}

const Builtin = ({item}: { item: SearchResp<BuiltinType> }) => {
    return <>
        {getItem(item)}
    </>
}

export {useBuiltin}

export default Builtin

