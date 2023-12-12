import {
    addAppRunCount,
    Application,
    execCommand,
    getApplications,
    getIcon,
    getLocalExtensions,
    SearchItem
} from "@/native"
import {Command} from "launcher-api"
import React, {useEffect, useState} from "react"
import {searchResultIsEmpty} from "@/components/self/helper";
import {SearchResp} from "@/native/types";
import {Terser} from "vite";
import {useHover} from "@/components/self/hooks";

const useApplications = () => {
    const [loading, setLoading] = useState(true)
    const [apps, setApps] = useState<Application[]>([])

    const refreshApp = async () => {
        setLoading(true)
        const app = await getApplications()
        setApps(app.sort(
            (a,b)=>{
                return b.count - a.count
            }
        ))
        setLoading(false)
    }
    useEffect(() => {
        refreshApp()
    }, [])

    return {
        apps,
        loading,
        refreshApp
    }
}

const AppImage = ({app}: { app: Application }) => {
    const image = getIcon(app)
    if (image) {
        return (<>
            <img alt="icon" className="w-4" src={image}/>
        </>)
    }
    return (
        <></>
    )
}
const runApplication = (app: Application) => {
    const commands = app.exec
        .replace("%u", "").replace("%U", "")
        .replace("%f", "").replace("%F", "")
        .trim()
        .split(" ")

    execCommand(commands[0], commands.slice(1), app.terminal)
    window.launcher.hide()
    addAppRunCount(app)
}

const {change} = useHover()
const ApplicationItem = (props: { item: SearchResp<Application> }) => {
    const {item} = props
    return (
        <Command.Item
            value={item.item.name}
            data-value={item.item.name}
            key={item.id}
            launcher-id={item.id}
            onSelect={() => {
                runApplication(item.item)
            }}
            onHover={() => {
                change(item)
            }}
        >
            <AppImage app={item.item}/>
            <span className=''>{item.item.name}</span>
            <span className="absolute right-2 text-gray/80">{item.kind}</span>
        </Command.Item>
    )
}

export default ApplicationItem

export {useApplications}
