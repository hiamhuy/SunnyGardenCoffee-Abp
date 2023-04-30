namespace SunnyGardenCoffee.Common.Dto
{
    public class GetDataDictionaryInputDto
    {
        public long? TypeId { get; set; }
        public string TypeCode { get; set; }
        public long? ParentId { get; set; }
        public string ParentCode { get; set; }
        public string Takes { get; set; }
    }
}
