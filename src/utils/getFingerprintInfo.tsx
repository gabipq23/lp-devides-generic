import { UAParser } from "ua-parser-js";

export interface Fingerprint {
    os: {
        name: string;
        version: string;
    };
    device: string;
    browser: {
        name: string;
        version: string;
    };
    timezone: string;
    resolution: {
        dpr: number;
        width: number;
        height: number;
    };
    timezone_offset: number;
    language: string;
}

export function getFingerprint(): Fingerprint {
    const parser = new UAParser();
    const result = parser.getResult();

    const timezoneOffset = -new Date().getTimezoneOffset() / 60;

    return {
        os: {
            name: result.os.name ?? "",
            version: result.os.version ?? "",
        },
        device: result.device.type ?? "desktop",
        browser: {
            name: result.browser.name ?? "",
            version: result.browser.version ?? "",
        },
        timezone: `GMT${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`,
        resolution: {
            dpr: window.devicePixelRatio,
            width: window.screen.width,
            height: window.screen.height,
        },
        timezone_offset: -new Date().getTimezoneOffset(),
        language: navigator.language,
    };
}