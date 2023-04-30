using Abp.AspNetCore;
using Abp.AspNetCore.Mvc.Antiforgery;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using Castle.Facilities.Logging;
using IdentityServer4.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.CodeAnalysis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using SunnyGardenCoffee.Configuration;
using SunnyGardenCoffee.Identity;
using SunnyGardenCoffee.SignalR;
using SunnyGardenCoffee.Swagger;
using SunnyGardenCoffee.Web.Common;
using SunnyGardenCoffee.Web.IdentityServer;
using SunnyGardenCoffee.Web.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SunnyGardenCoffee.Web.Host.Startup
{
    public class Startup
    {
        private const string _defaultCorsPolicyName = "localhost";

        private readonly IConfigurationRoot _appConfiguration;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public Startup(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {

            //MVC
            services.AddControllersWithViews(
                options => { options.Filters.Add(new AbpAutoValidateAntiforgeryTokenAttribute()); }
            ).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);

            services.AddSignalR();

            // Configure CORS for angular2 UI
            services.AddCors(options =>
            {
                options.AddPolicy(_defaultCorsPolicyName, builder =>
                {
                    builder
                    .WithOrigins(
                        // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                        _appConfiguration["App:CorsOrigins"]
                            .Split(",", StringSplitOptions.RemoveEmptyEntries)
                            .Select(o => o.RemovePostFix("/"))
                            .ToArray()
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });
            //Identity server
            if (bool.Parse(_appConfiguration["IdentityServer:IsEnabled"]))
            {
                IdentityServerRegistrar.Register(services, _appConfiguration, options =>
                 options.UserInteraction = new UserInteractionOptions()
                 {
                     LoginUrl = "/UI/Login",
                     LogoutUrl = "/UI/LogOut",
                     ErrorUrl = "/Error"

                 });
            }
            if (WebConsts.SwaggerUiEnabled)
            {
                services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Swagger SGC", Version = "v1" });
                    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First()); //This line
                    c.DocInclusionPredicate((docName, description) => true);
                    //Cấu hình enum
                    c.ParameterFilter<SwaggerEnumParameterFilter>();
                    c.SchemaFilter<SwaggerEnumSchemaFilter>();
                    c.OperationFilter<AuthorizeCheckOperationFilter>();
                    //c.CustomDefaultSchemaIdSelector();

                });

            }

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            // ConfigureSwagger(services);

            // Configure Abp and Dependency Injection
            return services.AddAbp<SunnyGardenCoffeeWebHostModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig(_hostingEnvironment.IsDevelopment()
                        ? "log4net.config"
                        : "log4net.Production.config"
                    )
                )
            );
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.UseAbp(options =>
            {
                options.UseAbpRequestLocalization = false;
                options.UseSecurityHeaders = false; // chuyển thành true nếu muốn ngăn trang khác nhúng iframe vào hệ thống}); // Initializes ABP framework.
            });
            app.UseCors(_defaultCorsPolicyName); // Enable CORS!

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
                RequestPath = "/Photos"
            });

            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();

            app.UseAbpRequestLocalization(option =>
            {
                option.DefaultRequestCulture = new RequestCulture("en");
                option.RequestCultureProviders = new List<IRequestCultureProvider>
                {
                    new QueryStringRequestCultureProvider(),
                    new CookieRequestCultureProvider()
                };
            });


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<AbpCommonHub>("/signalr");
                endpoints.MapHub<MyNotificationHub>("/signalr-myChatHub");

                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("defaultWithArea", "{area}/{controller=Home}/{action=Index}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger(c =>
            {
                //c.SerializeAsV2 = true;
            });

            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                //specifying the Swagger JSON endpoint.
                //options.IndexStream = () => Assembly.GetExecutingAssembly()
                //    .GetManifestResourceStream("SunnyGardenCoffee.Web.wwwroot.swagger.ui.index.html");
                options.InjectBaseUrl(_appConfiguration["App:ServerRootAddress"]);

            }); // URL: /swagger
        }

    }
}
