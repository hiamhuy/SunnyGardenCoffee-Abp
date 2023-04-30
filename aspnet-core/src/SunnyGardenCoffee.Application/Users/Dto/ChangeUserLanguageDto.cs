using System.ComponentModel.DataAnnotations;

namespace SunnyGardenCoffee.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}