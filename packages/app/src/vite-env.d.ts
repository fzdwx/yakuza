/// <reference types="vite/client" />
import {LauncherApi} from "launcher-api";

declare global {
    interface Window {
        launcher: LauncherApi
    }
}
