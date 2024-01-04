import {atom, useStore} from "jotai";
import {SearchItem, SearchWrapper} from "@/native";

const currentItemAtom = atom<SearchWrapper<SearchItem> | null>(null);

export const useSettingsStore = () => {
    const store = useStore()

    const setCurrentItem = (item: SearchWrapper<SearchItem>) => {
        store.set(currentItemAtom, item)
    }
    const getCurrentItem = () => {
        return store.get(currentItemAtom)
    }
    return {
        setCurrentItem, getCurrentItem
    };
};
