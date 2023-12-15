import {useKeyPress} from "ahooks";
import {useViewEvent} from "@/hooks/useView";

export default () => {
    const {changeView} = useViewEvent()
    useKeyPress('esc', () => {
        changeView("self")
    })
    return <div>
        hello world
    </div>
}
