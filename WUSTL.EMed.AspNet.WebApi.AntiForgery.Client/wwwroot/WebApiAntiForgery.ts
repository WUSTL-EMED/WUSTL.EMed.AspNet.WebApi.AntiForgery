interface IWebApiAntiForgerySettings {
    headerName?: string,
    cookieName?: string,
}

/*!
 * WebApiAntiForgery
 */
module WebApiAntiForgery {
    "use strict";

    export var Defaults: IWebApiAntiForgerySettings = {
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN",
    };

    export var Settings: IWebApiAntiForgerySettings = Defaults;

    function decode(s: string): string {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    function getCookie(key): string {
        const jar = {};
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        for (let i = 0; i < cookies.length; i++) {
            const parts = cookies[i].split("=");
            let cookie = parts.slice(1).join("=");

            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                const name = decode(parts[0]);
                cookie = decode(cookie);

                jar[name] = cookie;

                if (key === name) {
                    break;
                }
            } catch (e) { }
        }

        return jar[key];
    }

    function isNullOrEmpty(value: string): boolean {
        return value == null || value.length === 0;
    }

    export function GetToken(cookieName: string = null): string {
        const settingCookieName = (cookieName ?? WebApiAntiForgery.Settings.cookieName ?? "").trim();

        // Check if a cookie name is set.
        if (isNullOrEmpty(settingCookieName))
            throw new Error("Cookie name cannot be null, empty, or whitespace.");

        // Try to get the token value from the token cookie.
        const token = getCookie(settingCookieName);

        // Check if we got a token value.
        if (isNullOrEmpty(token))
            return;

        return token;
    }

    export function SetHeader(xmlHttpRequest: XMLHttpRequest, cookieName: string = null, headerName: string = null): void {
        if (xmlHttpRequest == null)
            throw new Error("XMLHttpRequest object cannot be null.");

        const settingCookieName = (cookieName ?? WebApiAntiForgery.Settings.cookieName ?? "").trim();
        // Check if a cookie name is set.
        if (isNullOrEmpty(settingCookieName))
            throw new Error("Cookie name cannot be null, empty, or whitespace.");

        const settingHeaderName = (headerName ?? WebApiAntiForgery.Settings.headerName ?? "").trim();
        // Check if a header name is set.
        if (isNullOrEmpty(settingCookieName))
            throw new Error("Header name cannot be null, empty, or whitespace.");

        // Try to get the token value from the token cookie.
        const token = getCookie(settingCookieName);

        // Check if we got a token value.
        if (isNullOrEmpty(token))
            return;

        xmlHttpRequest.setRequestHeader(settingHeaderName, token);
    }
}