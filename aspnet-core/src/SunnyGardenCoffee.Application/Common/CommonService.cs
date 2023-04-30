using Abp.Application.Services;
using Abp.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SunnyGardenCoffee.Common.ComboAppService;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Utils;
using System.Collections.Generic;
using System.Threading.Tasks;
using static SunnyGardenCoffee.CommonEnum;

namespace SunnyGardenCoffee
{
    #region MAIN
    [AbpAuthorize]
    public class CommonAppService : ApplicationService
    {
        protected IMediator Mediator => Mediator;
        private readonly ComboAppService _comBoBaseService;

        public CommonAppService(ComboAppService comBoBaseService)
        {
            _comBoBaseService = comBoBaseService;
        }

        #region Tạo cấu trúc Enum Angular

        public CommonEnumDto GetAllEnum()
        {
            return new CommonEnumDto();
        }
        #endregion

        [HttpPost]
        public List<ComboBoxTDto<ItemEnumObj<int>>> GetAppEnum(int type)
        {
            var result = type switch
            {
                (int)ComboBoxEnumCode.TRANG_THAI => typeof(TRANG_THAI).ConvertListEnumToComboDto(),
                (int)ComboBoxEnumCode.Menu => typeof(Menu).ConvertListEnumToComboDto(),
                (int)ComboBoxEnumCode.BILLTYPE => typeof(BILLTYPE).ConvertListEnumToComboDto(),
                (int)ComboBoxEnumCode.TrangThaiMuaHang => typeof(TrangThaiMuaHang).ConvertListEnumToComboDto(),


                _ => null
            };

            return result;

        }

        [HttpPost]
        public async Task<List<ComboBoxDto>> GetDataTableCombo(GetDataTableComboInputDto input)
        {
            var result = input.TableEnum switch
            {
                (int)ComboBoxTableCode.GetAllLoai => await _comBoBaseService.GetAllLoai(),



                _ => null,
            };
            return result;
        }

    }
    #endregion
}