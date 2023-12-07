import {Command} from "launcher-api";
import StoreIcon from "@/components/store/storeIcon";
import {useViewEvent} from "@/hooks/useView";

const storeItem = () => {
    const {emitter} = useViewEvent();
    return <Command.Item key="Store" onSelect={() => {
        emitter.emit('changeView', 'store')
    }}>
        <StoreIcon/>
        Store
    </Command.Item>
}

export default storeItem
