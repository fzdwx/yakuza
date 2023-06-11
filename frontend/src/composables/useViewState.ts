import {reactive, toRefs} from "vue";
import {View} from "../utils";

type State = {
    currentView: string
}

const state = reactive<State>({
    currentView: View.Self
})

const useViewState = () => {
    return {
        ...toRefs(state)
    }
}

export {useViewState}
