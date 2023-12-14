import {Application, appsToResp, builtinToResp, extToResp, LocalExtension, SearchItem, SearchResp} from "@/native";
import Fuse, {IFuseOptions} from "fuse.js";
import {nanoid} from "nanoid";
import {useLocalExtensions} from "@/components/self/item/localExtension";
import {useApplications} from "@/components/self/item/applicationItem";
import {useBuiltin} from "@/components/self/item/builtin";
import {useMemo} from "react";

const fuseOptions: IFuseOptions<SearchResp<SearchItem>> = {
    keys: [
        "item.name"
    ],
    isCaseSensitive: false,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    shouldSort: true,
    findAllMatches: false,
    location: 0,
    threshold: 0.5,
    distance: 100,
    ignoreLocation: true,
    useExtendedSearch: true,
    ignoreFieldNorm: false,
    fieldNormWeight: 1,
};

function setId(array: SearchResp<SearchItem>[]) {
    return array.map(a => {
        a.id = nanoid()
        return a
    })
}

const fuse = new Fuse([], fuseOptions)
const sort = (value: string, extensions: LocalExtension[], apps: Application[], builtins: string[]) => {
    const arr = setId([...extToResp(extensions), ...appsToResp(apps), ...builtinToResp(builtins)])
    if (value.length === 0) {
        return arr
    }

    fuse.setCollection(arr)
    const resp = fuse.search(value, {limit: 5});
    return resp.map(v => {
        const item = v.item;
        item.score = v.score
        return item
    });
}

const useMatch = (value: string) => {
    const {extensions, refreshExt,} = useLocalExtensions()
    const {apps, refreshApp} = useApplications()
    const {builtins} = useBuiltin()

    const items = useMemo(() => {
        return sort(value, extensions, apps, builtins)
    }, [extensions, apps, builtins, value])

    return [items]
}

export {useMatch}