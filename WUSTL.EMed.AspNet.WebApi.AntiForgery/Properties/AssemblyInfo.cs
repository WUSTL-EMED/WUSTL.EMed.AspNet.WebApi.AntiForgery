﻿// <copyright file="AssemblyInfo.cs" company="Washington University in St. Louis">
// Copyright (c) 2021 Washington University in St. Louis. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// </copyright>

using System;
using System.Reflection;
using System.Resources;
using System.Runtime.InteropServices;

// General Information about an assembly is controlled through the following
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("WUSTL.EMed.AspNet.WebApi.AntiForgery")]
[assembly: AssemblyDescription("Enables validating an anti-forgery token header on ASP.NET Web API requests.")]
[assembly: AssemblyCompany("Emergency Medicine Information Technology Services, Department of Emergency Medicine, Washington University School of Medicine in St. Louis")]
[assembly: AssemblyProduct("WUSTL.EMed.AspNet.WebApi.AntiForgery")]
[assembly: AssemblyCopyright("Copyright © 2021 Washington University in St. Louis")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

// Set assembly configuration based on DEBUG constant.
#if DEBUG
[assembly: AssemblyConfiguration("Debug")]
#else
[assembly: AssemblyConfiguration("Release")]
#endif

// Setting ComVisible to false makes the types in this assembly not visible
// to COM components.  If you need to access a type in this assembly from
// COM, set the ComVisible attribute to true on that type.
[assembly: ComVisible(false)]
[assembly: CLSCompliant(false)]
[assembly: NeutralResourcesLanguage("en-US")]

// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("188c0a86-f639-4a60-ab35-d62c99511c01")]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.1.3.0")]
[assembly: AssemblyFileVersion("1.1.3.0")]
[assembly: AssemblyInformationalVersion(ThisAssembly.Git.Sha)]
