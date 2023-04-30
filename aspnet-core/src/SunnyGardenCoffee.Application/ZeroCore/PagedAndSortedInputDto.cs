using Abp.Application.Services.Dto;
using SunnyGardenCoffee.Commons;
using SunnyGardenCoffee.Utilities;
using System.Collections.Generic;

namespace SunnyGardenCoffee.Dto
{
    public class PagedAndSortedInputDto : PagedInputDto, ISortedResultRequest
    {
        public string Sorting { get; set; }
        public PagedAndSortedInputDto()
        {
            MaxResultCount = 10;
        }
    }

    public class PagedFullInputDto : PagedAndSortedInputDto
    {
        public List<FilterColumns> ArrFilter { get; set; }

        public bool? IsFullRecord { get; set; }
        public string Filter { get; set; }
        public string FilterFullText => $"%{Filter}%";
        public string MySqlFullTextSearch => string.IsNullOrEmpty(Filter) ? null : $"\"{Filter}\"";
        public void Format()
        {
            if (!string.IsNullOrEmpty(this.Filter))
            {
                this.Filter = this.Filter.ToLower().Trim().Replace("  ", " ");
                this.Filter = StringHelperUtility.ConvertToUnsign(this.Filter);
            }
        }
        public FileExporterExtension? Extension { get; set; }
    }
    public enum FileExporterExtension
    {
        Excel = 1,
        Pdf = 2,
        Word = 3
    }
}