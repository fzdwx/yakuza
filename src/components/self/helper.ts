import {
    Application,
    IsApplication,
    IsBuiltin,
    IsLocalExtension,
    LocalExtension,
    SearchItem,
    SearchResp
} from "@/native";

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
        return (item as SearchResp<string>).item;
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
        return `Open ${item.item}`
    }
}

export {getText}

export {searchResultIsEmpty, doingSearch, getItemName}
