import {extensions} from "../../wailsjs/go/models";
import ListResp = extensions.ListResp;
import {reactive, Ref, ref, toRefs, watch} from "vue";
import {ListExtension} from "../../wailsjs/go/main/App";


const useExtension = (text: Ref<string>) => {
    const extensions = ref<ListResp>(new ListResp())
    const loading = ref(false)

    async function getExtensions() {
        loading.value = true
        try {
            extensions.value = await ListExtension({
                searchText: text.value
            })
        } catch (e) {
            console.log('getExtensions error', e)
        } finally {
            loading.value = false
        }
    }

    watch(text, getExtensions, {immediate: true})

    return {
        extensions, getExtensions, loading
    }
}

export {
    useExtension
}
