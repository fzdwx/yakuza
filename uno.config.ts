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
})
