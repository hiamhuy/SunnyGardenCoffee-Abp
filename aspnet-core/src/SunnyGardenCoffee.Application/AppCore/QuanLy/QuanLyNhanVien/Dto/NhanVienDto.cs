using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;
using static SunnyGardenCoffee.CommonEnum;

namespace SunnyGardenCoffee.AppCore.Dto
{

    [AutoMap(typeof(PersonnalEntity))]
    public class NhanVienDto : PersonnalDomain
    {
        public string TenVaiTro { get; set; }
        public string StrStatus
        {
            get
            {
                return Status.HasValue ? GetEnumDescription((TRANG_THAI)Status) : "";
            }
        }
    }


}
