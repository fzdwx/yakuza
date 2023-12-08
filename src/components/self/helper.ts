function searchResultIsEmpty<T>(arr: T[], props: { searchText: string }) {
    return doingSearch(props) && arr.length == 0;
}

function doingSearch(props: { searchText: string }) {
    return props.searchText.length != 0;
}

export {searchResultIsEmpty, doingSearch}
