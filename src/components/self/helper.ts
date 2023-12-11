import {Application, IsApplication, IsBuiltin, LocalExtension, SearchItem, SearchResp} from "@/native";

function searchResultIsEmpty<T>(arr: T[], props: { searchText: string }) {
    return doingSearch(props) && arr.length == 0;
}

function doingSearch(props: { searchText: string }) {
    return props.searchText.length != 0;
}

function getItemName(item: SearchResp<SearchItem>) {
    if (IsApplication(item)) {
        return (item as SearchResp<Application>).item.name;
    }

    if (IsBuiltin(item)) {
        return (item as SearchResp<string>).item;
    }

    return (item as SearchResp<LocalExtension>).item.name;
}

export {searchResultIsEmpty, doingSearch, getItemName}
