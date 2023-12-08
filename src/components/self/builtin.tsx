import {useViewEvent} from "@/hooks/useView";
import {Command} from "launcher-api";
import StoreIcon from "@/components/store/storeIcon";

const StoreItem = () => {
    const {emitter} = useViewEvent();
    return <Command.Item key="Store" onSelect={() => {
        emitter.emit('changeView', 'store')
    }}>
        <StoreIcon/>
        Store
    </Command.Item>
}

const DevMode = () => {
    return <Command.Item key="Dev Mode" onSelect={() => {
        window.launcher.loadDevView()
    }}>
        <span className="w-4">🛠</span>
        Dev Mode
    </Command.Item>
}

const items = {
    "Store": <StoreItem/>,
    "Dev Mode": <DevMode/>
}
const itemNames = Object.keys(items)
const getItem = (name: 'Store' | 'Dev Mode') => {
    return items[name]
}

const Builtin = (props: { searchText: string }) => {
    return <>
        <Command.Group heading="Builtin">
            <StoreItem/>
            <DevMode/>
        </Command.Group>
    </>
}

export default Builtin

