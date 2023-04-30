using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace SunnyGardenCoffee
{
    public static partial class CommonEnum
    {
        public enum ComboBoxEnumCode
        {
            //DictionaryType,
            TRANG_THAI,
            HostLevel,
            Menu,
            BILLTYPE,
            TrangThaiMuaHang

        }

        public enum ComboBoxTableCode
        {
            //GetAllRegisterCity,
            GetAllLoai
            
        }

        #region Functions

        public static string GetEnumDescription(Enum en)
        {
            Type type = en.GetType();

            try
            {
                MemberInfo[] memInfo = type.GetMember(en.ToString());

                if (memInfo != null && memInfo.Length > 0)
                {
                    object[] attrs = memInfo[0].GetCustomAttributes(typeof(EnumDisplayString), false);

                    if (attrs != null && attrs.Length > 0)
                        return ((EnumDisplayString)attrs[0]).DisplayString;
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }

            return en.ToString();
        }
        [HttpGet]
        public static List<ItemEnumObj<int>> EnumToList(Type TypeObject)
        {
            List<ItemEnumObj<int>> objTemList = new List<ItemEnumObj<int>>();
            try
            {
                foreach (object iEnumItem in Enum.GetValues(TypeObject))
                {
                    ItemEnumObj<int> objTem = new ItemEnumObj<int>();
                    objTem.Id = ((int)iEnumItem);
                    objTem.Name = GetEnumDescription((Enum)iEnumItem);
                    objTemList.Add(objTem);
                }
                return objTemList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }

    public class ItemEnumObj<T>
    {
        public T Id { get; set; }
        public string Name { get; set; }
        public int? TotalCount { get; set; }
    }

    public class EnumDisplayString : Attribute
    {
        public string DisplayString;
        public EnumDisplayString(string text)
        {
            this.DisplayString = text;
        }
    }
}
