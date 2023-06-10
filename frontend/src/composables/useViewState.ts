import {reactive, toRefs} from "vue";

type State = {
    currentView: string
}

const state = reactive<State>({
    currentView: 'self'
})

const useViewState = () => {
    return {
        ...toRefs(state)
    }
}

export {useViewState}
