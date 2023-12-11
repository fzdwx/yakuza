import {SearchItem, SearchResp} from "@/native";
import mitt from "mitt";

type HoverEvent = {
    change: SearchResp<SearchItem>
}

const emmiter = mitt<HoverEvent>();

const change = (change: SearchResp<SearchItem>) => {
    emmiter.emit('change', change)
}

const on = (handler: (change: SearchResp<SearchItem>) => void) => {
    emmiter.on('change', handler)
}

export const useHover = () => {
    return {
        change,
        on
    }
}
