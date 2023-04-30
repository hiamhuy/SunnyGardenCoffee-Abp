namespace SunnyGardenCoffee.Common.Dto
{
    public class ComboBoxDto : ComboBoxTDto<object>
    {

    }

    public class ComboBoxTDto<T> where T : new()
    {
        public object Value { get; set; }
        public string DisplayText { get; set; }
        public string HideText { get; set; }
        public bool IsActive { get; set; } = true;
        public T Data { get; set; }
        public int? Level { get; set; }
    }
}
