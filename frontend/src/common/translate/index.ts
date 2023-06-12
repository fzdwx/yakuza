// inspired by https://github.com/iamtraction/google-translate/blob/master/src/index.js
// sorry, this lib only support nodejs, so I have to rewrite it.
import {GoogleTranslate} from "../../../wailsjs/go/main/App";
import {GoogleTranslateResp} from "../../types";
import {getLanguageName as _getLanguageName, LanguageCode} from "./languages";

const translateCache = new Map();

export async function translate(text: string, from: LanguageCode, to: LanguageCode) {
    const cacheKey = `${from}-${to}-${text}`;
    if (translateCache.has(cacheKey)) {
        return translateCache.get(cacheKey);
    }

    const translate = await GoogleTranslate(text, from, to);
    const body = JSON.parse(translate);

    let result: GoogleTranslateResp = {
        text: "",
        from: {
            language: {
                didYouMean: false,
                iso: "auto"
            },
            text: {
                autoCorrected: false,
                value: "",
                didYouMean: false
            }
        },
        to: {
            language: to
        },
        raw: translate
    };

    // Parse body and add it to the result object.
    // @ts-ignore
    body[0].forEach((obj) => {
        if (obj[0]) {
            result.text += obj[0];
        }
    });

    if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2];
    } else {
        result.from.language.didYouMean = true;
        result.from.language.iso = body[8][0][0];
    }

    if (body[7] && body[7][0]) {
        let str = body[7][0];

        str = str.replace(/<b><i>/g, "[");
        str = str.replace(/<\/i><\/b>/g, "]");

        result.from.text.value = str;

        if (body[7][5] === true) {
            result.from.text.autoCorrected = true;
        } else {
            result.from.text.didYouMean = true;
        }
    }

    translateCache.set(cacheKey, result);
    return result;
}

export function getLanguageName(code: LanguageCode) {
    return _getLanguageName(code)
}
