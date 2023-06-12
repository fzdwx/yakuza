import {LanguageCode} from "./common/translate/languages";

export interface GoogleTranslateResp {
    text: string;
    from: {
        language: {
            didYouMean: boolean;
            iso: LanguageCode;
        };
        text: {
            autoCorrected: boolean;
            value: string;
            didYouMean: boolean;
        }
    }
    to: {
        language: LanguageCode;
    }
    raw: string;
}
