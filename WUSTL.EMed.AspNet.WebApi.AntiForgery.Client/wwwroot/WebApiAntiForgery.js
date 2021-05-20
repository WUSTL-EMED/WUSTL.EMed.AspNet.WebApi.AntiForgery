"use strict";
/*!
 * WebApiAntiForgery
 */
var WebApiAntiForgery;
(function (WebApiAntiForgery) {
    "use strict";
    WebApiAntiForgery.Defaults = {
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN",
    };
    WebApiAntiForgery.Settings = WebApiAntiForgery.Defaults;
    function decode(s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }
    function getCookie(key) {
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
            }
            catch (e) { }
        }
        return jar[key];
    }
    function isNullOrEmpty(value) {
        return value == null || value.length === 0;
    }
    function GetToken(cookieName = null) {
        var _a;
        const settingCookieName = ((_a = cookieName !== null && cookieName !== void 0 ? cookieName : WebApiAntiForgery.Settings.cookieName) !== null && _a !== void 0 ? _a : "").trim();
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
    WebApiAntiForgery.GetToken = GetToken;
    function SetHeader(xmlHttpRequest, cookieName = null, headerName = null) {
        var _a, _b;
        if (xmlHttpRequest == null)
            throw new Error("XMLHttpRequest object cannot be null.");
        const settingCookieName = ((_a = cookieName !== null && cookieName !== void 0 ? cookieName : WebApiAntiForgery.Settings.cookieName) !== null && _a !== void 0 ? _a : "").trim();
        // Check if a cookie name is set.
        if (isNullOrEmpty(settingCookieName))
            throw new Error("Cookie name cannot be null, empty, or whitespace.");
        const settingHeaderName = ((_b = headerName !== null && headerName !== void 0 ? headerName : WebApiAntiForgery.Settings.headerName) !== null && _b !== void 0 ? _b : "").trim();
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
    WebApiAntiForgery.SetHeader = SetHeader;
})(WebApiAntiForgery || (WebApiAntiForgery = {}));
//# sourceMappingURL=WebApiAntiForgery.js.map