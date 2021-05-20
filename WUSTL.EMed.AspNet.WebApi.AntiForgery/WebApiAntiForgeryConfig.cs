// <copyright file="WebApiAntiForgeryConfig.cs" company="Washington University in St. Louis">
// Copyright (c) 2021 Washington University in St. Louis. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// </copyright>

namespace WUSTL.EMed.AspNet.WebApi.AntiForgery
{
    /// <summary>
    /// Static class of settings.
    /// </summary>
    public static class WebApiAntiForgeryConfig
    {
        /// <summary>
        /// The default name of the antiforgery token cookie.
        /// </summary>
        public const string DefaultTokenCookieName = "XSRF-TOKEN"; // __Secure- ?

        /// <summary>
        /// The default name of the antiforgery token header.
        /// </summary>
        public const string DefaultTokenHeaderName = "X-XSRF-TOKEN";

        /// <summary>
        /// Gets or sets a value indicating the default name of the antiforgery token cookie.
        /// </summary>
        public static string TokenCookieName { get; set; } = DefaultTokenCookieName;

        /// <summary>
        /// Gets or sets a value indicating the default name of the antiforgery token heaer.
        /// </summary>
        public static string TokenHeaderName { get; set; } = DefaultTokenHeaderName;

        /// <summary>
        /// Gets or sets the default message returned if the token header is missing.
        /// </summary>
        public static string MissingMessage { get; set; } = "The required anti-forgery header \"{0}\" is missing.";
    }
}
