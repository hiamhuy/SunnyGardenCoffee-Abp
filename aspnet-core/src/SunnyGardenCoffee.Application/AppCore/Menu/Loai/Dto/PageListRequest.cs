using SunnyGardenCoffee.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.AppCore.Dto
{
    public class LoaiPagingListRequest : PagedFullInputDto
    {
        public long? PositionId { get; set; }
        public int? Status { get; set; }
    }

}


