import {atom, useStore} from "jotai";
import {SearchItem, SearchResp} from "@/native";

const currentItemAtom = atom<SearchResp<SearchItem> | null>(null);

export const useSettingsStore = () => {
    const store = useStore()

    const setCurrentItem = (item: SearchResp<SearchItem>) => {
        store.set(currentItemAtom, item)
    }
    const getCurrentItem = () => {
        return store.get(currentItemAtom)
    }
    return {
        setCurrentItem, getCurrentItem
    };
};
