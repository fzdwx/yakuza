// uno.config.ts
import {defineConfig, presetUno, presetWebFonts} from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
    // ...UnoCSS options
    presets: [presetUno(), presetIcons(), presetWebFonts(
        {
            provider: 'google',
            fonts: {
                sans: 'Roboto',
                mono: ['Fira Code', 'Fira Mono:400,700'],
            },
        }
    )],

    theme: {
        colors: {
            'primary': '#6ee7b7',
            'empty': 'transparent',
            'hover': '#0000000C',
            'hover2': '#00000019',
        }
    }
})
