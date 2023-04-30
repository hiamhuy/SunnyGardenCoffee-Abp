﻿using System.Threading.Tasks;
using SunnyGardenCoffee.Models.TokenAuth;
using SunnyGardenCoffee.Web.Controllers;
using Shouldly;
using Xunit;

namespace SunnyGardenCoffee.Web.Tests.Controllers
{
    public class HomeController_Tests: SunnyGardenCoffeeWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}