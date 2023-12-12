import {
    Application, Builtin,
    IsApplication,
    IsBuiltin,
    IsLocalExtension,
    LocalExtension,
    SearchItem,
    SearchResp
} from "@/native";
import {sleep} from "ahooks/es/utils/testingHelpers";

function searchResultIsEmpty<T>(arr: T[], props: { searchText: string }) {
    return doingSearch(props) && arr.length == 0;
}

function doingSearch(props: { searchText: string }) {
    return props.searchText.length != 0;
}

function getItemName(item: SearchResp<SearchItem> | undefined) {
    if (item == undefined) {
        return ""
    }

    if (IsApplication(item)) {
        return (item as SearchResp<Application>).item.name;
    }

    if (IsBuiltin(item)) {
        return (item as SearchResp<Builtin>).item.name;
    }

    return (item as SearchResp<LocalExtension>).item.name;
}

const getText = (item: SearchResp<SearchItem> | undefined) => {
    if (item == undefined) {
        return ""
    }

    if (IsApplication(item)) {
        return `Open ${item.item.name}`
    }
    if (IsLocalExtension(item)) {
        return `Open ${item.item.name}`
    }
    if (IsBuiltin(item)) {
        return `Open ${item.item.name}`
    }
}

export function getHeader(value: string) {
    if (value.length == 0) {
        return 'Recommend'
    }
    return 'Results';
}

export function selectFirstItem(value: string) {
    sleep(20).then(() => {
        const event = new KeyboardEvent('keydown', {code: 'Home'})
        window.dispatchEvent(event)
    })
}

export {getText}

export {searchResultIsEmpty, doingSearch, getItemName}
