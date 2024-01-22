/// <reference types="vite/client" />

import {LauncherApi} from "types";

declare global {
    interface Window {
        launcher: LauncherApi
    }
}
