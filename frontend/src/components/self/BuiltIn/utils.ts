import {View} from "../../../utils";
import IconShell from "../../../icon/IconShell.vue";
import IconTranslator from "../../../icon/IconTranslator.vue";
import IconExtensionMananger from "../../../icon/IconExtensionMananger.vue";
import IconSetting from "../../../icon/IconSetting.vue";

const builtinItems = [
    {
        viewName: View.Shell,
        icon: IconShell,
        value: 'Shell'
    },
    {
        viewName: View.Translate,
        icon: IconTranslator,
        value: 'Translate'
    },
    {
        viewName: View.ExtensionManager,
        icon: IconExtensionMananger,
        value: 'Extension manager'
    },
    {
        viewName: View.Setting,
        icon: IconSetting,
        value: 'Setting'
    }
];

export {builtinItems};
