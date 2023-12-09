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

const useApplications = (searchText: string) => {
    const [loading, setLoading] = useState(true)
    const [apps, setApps] = useState<SearchResp<Application>[]>([])

    const refreshApp = async (searchText: string) => {
        setLoading(true)
        const app = await getApplications(searchText)
        setApps(app)
        setLoading(false)
    }
    useEffect(() => {
        refreshApp(searchText)
    }, [searchText])

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

const ApplicationItem = (props: { item: SearchResp<Application> }) => {
    const {item} = props
    return (
        <Command.Item
            value={item.item.name}
            data-value={item.item.name}
            onSelect={() => {
                runApplication(item.item)
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
