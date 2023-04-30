using Abp.Auditing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace aspnet_core.Controllers
{
    public class HomeController
    {
       
        private readonly IWebHostEnvironment _hostingEnvironment;
        public HomeController(
            IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        [DisableAuditing]
        public IActionResult Index()
        {
            return null;
        }
    
        public float ConvertGiaTri(string giaTri)
        {

            float result = 0;
            if (giaTri.Length > 0)
            {
                if (giaTri.IndexOf("x10^") > -1)
                {
                    giaTri = giaTri.Replace("x10^", "e");
                    if (Regex.IsMatch(giaTri, @"[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)"))
                    {
                        string value = Regex.Match(giaTri, @"[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)").Value;
                        double valueconvert = double.Parse(value.Replace('.', ','));
                        result = (float)valueconvert;
                        return result;
                    }
                }
                else
                {
                    if (Regex.IsMatch(giaTri, @"[0-9]+(\.[0-9]+)?"))
                    {
                        string value = Regex.Match(giaTri, @"[0-9]+(\.[0-9]+)?").Value;
                        result = float.Parse(value);
                    }
                }
            }
            return result;
        }
  

        protected static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
            "đ",
            "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
            "í","ì","ỉ","ĩ","ị",
            "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
            "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
            "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
            "d",
            "e","e","e","e","e","e","e","e","e","e","e",
            "i","i","i","i","i",
            "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
            "u","u","u","u","u","u","u","u","u","u","u",
            "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }
    }
}
