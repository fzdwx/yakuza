import {useKeyPress} from "ahooks";
import {useViewEvent} from "@/hooks/useView";
import {useSettingsStore} from "@/hooks/useSettingsStore";
import {Render} from "@/components/settings/render";

export default () => {
    const {changeView} = useViewEvent()
    const {getCurrentItem} = useSettingsStore()
    useKeyPress('esc', () => {
        changeView("self")
    })

    const current = getCurrentItem()

    return <div>
        <Render currentItem={current}/>
    </div>
}
