import {Command} from "launcher-api";

const extension = () => {
    return (<Command.Group heading="Extensions">
        <Command.Item key="Dev Mode" onSelect={()=>{
            window.launcher.loadDevView()
        }}>
            <span className="w-4">🛠</span>
            <span>Dev Mode</span>
        </Command.Item>
    </Command.Group>)
}

export default extension
