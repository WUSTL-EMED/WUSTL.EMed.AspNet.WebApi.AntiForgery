"use strict";
/* tslint:enable:interface-name */
/*!
 * jQuery.WebApiAntiForgery
 */
var WebApiAntiForgery;
(function (WebApiAntiForgery) {
    "use strict";
    WebApiAntiForgery.Defaults = {
        enable: true,
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN",
        methods: [
            "DELETE",
            "PATCH",
            "POST",
            "PUT",
        ],
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
    function isNullOrWhitespace(value) {
        return value == null || value.trim().length === 0;
    }
    function getOrigin(url) {
        const a = document.createElement("a");
        a.href = url;
        // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
        return {
            protocol: a.protocol,
            hostname: a.hostname,
            port: a.port
        };
    }
    function isSameOrigin(url1, url2) {
        const origin1 = getOrigin(url1);
        const origin2 = getOrigin(url2);
        return origin1 && origin2
            && origin1.protocol === origin2.protocol
            && origin1.hostname === origin2.hostname
            && origin1.port === origin2.port;
    }
    function isAllowedOrigin(url, allowedOrigins = []) {
        // Always allow the origin of the current document.
        if (isSameOrigin(url, document.location.href))
            return true;
        for (let i = 0; i < allowedOrigins.length; i++) {
            if (isSameOrigin(url, allowedOrigins[i])) {
                return true;
            }
        }
        return false;
    }
    function PreFilter(options, originalOptions, jqXHR) {
        const settings = $.extend(true, {}, WebApiAntiForgery.Defaults, WebApiAntiForgery.Settings, options.WebApiAntiForgery);
        // Check if the filter is enabled.
        if (!settings.enable)
            return;
        // Check if a cookie name and header name is set.
        if (isNullOrWhitespace(settings.cookieName) || isNullOrWhitespace(settings.headerName))
            return;
        // Check if the request method needs a token.
        if (settings.methods.indexOf((options.type || "").toUpperCase()) === -1)
            return;
        // Check if there is already a value for the header.
        if (options.headers && !isNullOrWhitespace(options.headers[settings.headerName]))
            return;
        // Check if the request url origin is allowed.
        if (!isAllowedOrigin(options.url, settings.allowedOrigins))
            return;
        // Try to get the token value from the token cookie.
        const token = getCookie(settings.cookieName);
        // Check if we got a token value.
        if (isNullOrWhitespace(token))
            return;
        $.extend(true, options, { headers: { [settings.headerName]: token } });
    }
    WebApiAntiForgery.PreFilter = PreFilter;
})(WebApiAntiForgery || (WebApiAntiForgery = {}));
$.webApiAntiForgery = WebApiAntiForgery;
$.ajaxPrefilter(WebApiAntiForgery.PreFilter);
//# sourceMappingURL=jQuery.WebApiAntiForgery.js.map