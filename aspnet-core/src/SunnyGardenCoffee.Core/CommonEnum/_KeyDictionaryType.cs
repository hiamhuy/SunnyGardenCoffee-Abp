using SunnyGardenCoffee;

namespace SunnyGardenCoffee
{
    public static partial class CommonEnum
    {
        public enum KeyDictionaryType
        {
            [EnumDisplayString("DEMO")]
            Demo = 0,
            [EnumDisplayString("GIOI_TINH")]
            GioiTinh = 1,
            [EnumDisplayString("DON_VI_TINH")]
            DonViTinh = 2
        }

        public enum TypeDataTreeView
        {
            LstDictionaryTypeTreeView,
            LstDictionaryTreeView
        }
    }
}
