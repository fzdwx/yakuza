/// <reference types="vite/client" />
import {LauncherApi} from "yakuza-api";

declare global {
    interface Window {
        launcher: LauncherApi
    }
}
