import {computed, createApp, defineComponent, ref, watch} from "vue";
import {applications} from "../../../../wailsjs/go/models";
import Application = applications.Application;
import {useMagicKeys, whenever} from "@vueuse/core";


const SettingItem = defineComponent({
    props: {
        application: {
            type: Object as () => Application,
        }
    },
    setup(props) {
        const {current} = useMagicKeys({
            reactive: true,
        });
        const keys = computed(() => Array.from(current))
        const lastKeys = ref()
        watch(keys, (keys) => {
            if (keys.length !== 0) {
                lastKeys.value = keys
            }
        })
        return {
            keys, lastKeys
        }
    },
    render() {
        return <div class="absolute top-0 w-[100%] h-[540px] text-white z-[300]">
            <div class="flex items-center justify-center">
                {this.lastKeys}
            </div>
        </div>
    }
})

const showSettingItem = (application: Application) => {
    const app = createApp(SettingItem, {
        application
    });
    const div = document.createElement('div');
    document.body.appendChild(div);
    app.mount(div)

}

export {showSettingItem}
