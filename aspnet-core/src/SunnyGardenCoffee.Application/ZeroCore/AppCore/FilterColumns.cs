using System.Collections.Generic;

namespace SunnyGardenCoffee.Commons
{
    public enum FilterType
    {
        SearchByKeyword,
        Filter,
        Group
    }
    public class FilterColumns
    {
        public string FieldName { get; set; }
        public string FieldDisplay { get; set; }
        public FilterType? FilterType { get; set; }
        public List<string> Values { get; set; }
    }
}
