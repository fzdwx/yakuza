import {reactive, toRefs} from "vue";
import {GetConfig} from "../../wailsjs/go/main/App";

type State = {
    config: { [key: string]: any }
}

const state = reactive<State>({
    config: {}
})

// GetConfig().then(config => {
//     state.config = config;
// })

const useConfigState = () => {

    return {
        ...toRefs(state)
    }
}

export {useConfigState}
