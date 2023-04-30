using SunnyGardenCoffee.Dto;

namespace SunnyGardenCoffee.Common.Dto
{
    public enum ExcuteProcedureType
    {
        List = 1,
        FirstOrDefault = 2,
        NonResult = 3
    }

    public class ExcuteProcedureInputDto : PagedFullInputDto
    {
        public string ProcedureName { get; set; }
        public object Paramater { get; set; }
        public ExcuteProcedureType Type { get; set; }
    }
}
