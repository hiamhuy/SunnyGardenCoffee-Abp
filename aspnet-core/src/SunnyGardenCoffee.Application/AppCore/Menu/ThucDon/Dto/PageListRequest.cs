using SunnyGardenCoffee.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.AppCore.Dto
{
    public class ThucDonPagingListRequest : PagedFullInputDto
    {
        public string CategoryCode { get; set; }
        public int? Status { get; set; }
    }

}


