// <copyright file="ValidateAntiForgeryTokenAttribute.cs" company="Washington University in St. Louis">
// Copyright (c) 2021 Washington University in St. Louis. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// </copyright>

namespace WUSTL.EMed.AspNet.WebApi.AntiForgery.Http
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Helpers;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;

    /// <summary>
    /// An ASP.NET Web API filter attribute that will validate an anti-forgery token header on requests.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public sealed class ValidateAntiForgeryTokenAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Gets or sets the name of the antiforgery token header to validate.
        /// </summary>
        public string HeaderName { get; set; }

        /// <summary>
        /// Gets or sets the  message returned if the token header is missing.
        /// </summary>
        public string MissingMessage { get; set; }

        /// <inheritdoc/>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (actionContext == null)
            {
                throw new ArgumentNullException(nameof(actionContext));
            }

            var headerName = HeaderName ?? WebApiAntiForgeryConfig.TokenHeaderName;
            var missingMessage = MissingMessage ?? WebApiAntiForgeryConfig.MissingMessage;
            var antiForgeryCookieName = AntiForgeryConfig.CookieName;

            var headers = actionContext.Request.Headers;
            if (!headers.Contains(headerName))
            {
                actionContext.ModelState.AddModelError(string.Empty, string.Format(CultureInfo.InvariantCulture, missingMessage, headerName));
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }

            var cookieToken = headers.GetCookies().Select(c => c[antiForgeryCookieName]).FirstOrDefault()?.Value; // What if there are multiple?
            var headerToken = headers.GetValues(headerName).FirstOrDefault(); // What if there are multiple?

            try
            {
                AntiForgery.Validate(cookieToken, headerToken); // How many times can a token be re-used? Is there any sort of mechanism to prevent re-use?
            }
            catch (System.Web.Mvc.HttpAntiForgeryException ex)
            {
                actionContext.ModelState.AddModelError(string.Empty, ex);
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
                return;
            }
        }
    }
}
