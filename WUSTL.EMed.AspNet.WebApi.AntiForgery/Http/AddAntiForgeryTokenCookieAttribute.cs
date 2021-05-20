// <copyright file="AddAntiForgeryTokenCookieAttribute.cs" company="Washington University in St. Louis">
// Copyright (c) 2021 Washington University in St. Louis. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// </copyright>

namespace WUSTL.EMed.AspNet.WebApi.AntiForgery.Http
{
    using System;
    using System.Linq;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Http.Filters;

    /// <summary>
    /// An ASP.NET Web API filter attribute that will set an anti-forgery token cookie on responses.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class AddAntiForgeryTokenCookieAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Gets or sets the name of the antiforgery token cookie to set.
        /// </summary>
        public string CookieName { get; set; }

        /// <inheritdoc/>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext is null)
            {
                throw new ArgumentNullException(nameof(actionExecutedContext));
            }

            var cookieName = CookieName ?? WebApiAntiForgeryConfig.TokenCookieName;
            var requireSsl = AntiForgeryConfig.RequireSsl;
            var antiForgeryCookieName = AntiForgeryConfig.CookieName;

            // Thread safety? Async?
            var request = HttpContext.Current.Request;
            var response = HttpContext.Current.Response;

            // TODO: I'm not sure we need to check both.
            var oldCookieToken = SafeGet(response.Cookies, antiForgeryCookieName)?.Value ?? SafeGet(request.Cookies, antiForgeryCookieName)?.Value;

            // TODO: Should we only set the token cookie if there isn't already one, or is it better to change it every time?
            AntiForgery.GetTokens(oldCookieToken, out var newCookieToken, out var formToken);

            if (!string.IsNullOrEmpty(newCookieToken))
            {
                response.SetCookie(new HttpCookie(antiForgeryCookieName, newCookieToken) { HttpOnly = true, Secure = requireSsl }); // TODO: Secure = request.IsSecureConnection?
            }

            response.SetCookie(new HttpCookie(cookieName, formToken) { HttpOnly = false, Secure = request.IsSecureConnection });
        }

        // HttpCookieCollection[] and HttpCookieCollection.Get both set an empty response cookie for some reason if no cookie with the given name exists.
        private static HttpCookie SafeGet(HttpCookieCollection httpCookieCollection, string name) => httpCookieCollection.AllKeys.Contains(name)
            ? httpCookieCollection[name]
            : default;
    }
}
