using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using SunnyGardenCoffee.Controllers;

namespace SunnyGardenCoffee.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : SunnyGardenCoffeeControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}
