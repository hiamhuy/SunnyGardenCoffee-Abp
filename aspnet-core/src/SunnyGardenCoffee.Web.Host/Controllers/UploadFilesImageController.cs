using Abp.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SunnyGardenCoffee.Controllers;
using System;
using System.Collections.Generic;
using System.IO;

namespace SunnyGardenCoffee.Web.Host.Controllers
{
    [ApiController]
    [AbpAuthorize]
    [Route("api/[controller]")]
    public class UploadFilesImageController : SunnyGardenCoffeeControllerBase
    {
        [Route("SaveFile")]
        [HttpPost]
        public string SaveFile(IFormFile file)
        {
            try
            {
                var result = "";
                if (file.Length > 0)
                {
                    string fileName = file.FileName;
                    // full path to file in temp location
                    var filePath = Path.Combine(Directory.GetCurrentDirectory() + "/Photos/" + fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    result = fileName;
                    return result;
                }
                else
                {
                    result = "File không tồn tại !";
                    return result;
                }

            }
            catch (Exception)
            {
                var result = "Lỗi server, vui lòng kiểm tra lại.";
                return result;
            }

        }
    }
}
