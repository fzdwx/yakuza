import mitt from "mitt";

export const light = 'light';
export const dark = 'dark';

export type Theme =  '' |  'dark' | 'toggle';

type ThemeEvent = {
    changeTheme: Theme
}

const emitter = mitt<ThemeEvent>()

export const themeEvent = emitter;

export function useTheme() {

    const changeTheme = (theme: Theme) => {
        emitter.emit('changeTheme', theme);
    };

    return {
        changeTheme,
        themeEvent
    };
}
