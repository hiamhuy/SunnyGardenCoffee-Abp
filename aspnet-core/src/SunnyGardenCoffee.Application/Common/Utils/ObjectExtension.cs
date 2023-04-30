using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SunnyGardenCoffee.Common.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using static SunnyGardenCoffee.CommonEnum;
namespace SunnyGardenCoffee.Utils
{
    public static class ObjectExtension
    {
        public static T DeepCopy<T>(this T source)
        {
            // Don't serialize a null object, simply return the default for that object
            if (ReferenceEquals(source, null))
            {
                return default(T);
            }

            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(source));
        }
        [HttpPost]
        public static List<ComboBoxTDto<ItemEnumObj<int>>> ConvertListEnumToComboDto(this Type typeObjectEnum)
        {
            var items = EnumToList(typeObjectEnum);
            return items.Select(x => new ComboBoxTDto<ItemEnumObj<int>>
            {
                Value = x.Id,
                DisplayText = x.Name,
                Data = x,
                IsActive = true,
            }).ToList();
        }
    }
}
