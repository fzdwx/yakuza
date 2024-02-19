import {Background, config, Container} from "yakuza-api";
import {useEffect, useState} from "react";
import {useViewEvent} from "@/hooks/useView";
import {useSettingsStore} from "@/hooks/useSettingsStore";
import {useKeyPress} from "ahooks";

interface Settings {
    proxy: string
}

export default () => {
    const [proxyVal, setProxyVal] = useState("")
    const {changeView} = useViewEvent()
    useKeyPress('esc', () => {
        changeView("self")
    })
    useEffect(() => {
        config.get("yakuza-settings").then((val) => {
            const s = JSON.parse(val) as Settings
            setProxyVal(s.proxy)
        })
    }, [])

    return <Container>
        <Background>
            <div className="p-10">
                <div className="text-2xl cursor-default">Settings</div>
                <div className="p-2">

                    <div className="flex">
                        <h1 className="text-lg mr-2 cursor-default pt-1">HTTP Proxy</h1>
                        <input type="text" placeholder="eg http://localhost:7890" value={proxyVal} onInput={e=>{
                            setProxyVal((e.target as HTMLInputElement).value)
                        }} className="p-2 w-60% rounded-md"/>
                    </div>


                    <button className="bg-#10b981 text-white p-2 mt-2 rounded-md" onClick={()=>{
                        config.set("yakuza-settings", JSON.stringify({proxy: proxyVal}))
                        changeView("self")
                    }}>Save</button>
                </div>

            </div>
        </Background>
    </Container>
}
