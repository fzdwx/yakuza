import {reactive, toRefs, computed} from 'vue'

type FilteredItem = {
    count: number
    items: Map<string, any>
    groups: Set<string>
}

type State = {
    // Event State
    selectedNode: string
    selectedGroup: string
    // Input State
    search: string
    dataValue: string
    filtered: FilteredItem
    allItems: Map<string, HTMLElement>
}

const state = reactive<State>({
    selectedNode: '',
    selectedGroup: '',
    search: '',
    dataValue: '',
    allItems: new Map(),
    filtered: {
        count: 0,
        items: new Map(),
        groups: new Set()
    }
})

// get current selected node
const getSelectCurrentItem = () => {
    const selectedNode = state.selectedNode;
    return state.allItems.get(selectedNode)
}

const useCommandState = () => {
    const isSearching = computed(() => state.search !== '')
    return {
        isSearching,
        ...toRefs(state),
        getSelectCurrentItem
    }
}

export {useCommandState}
