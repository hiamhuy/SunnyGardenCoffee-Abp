using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.KhachHang
{
    [AbpAuthorize]
    public class KhachHangAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<CustommerEntity, long> _custommerRepository;
        private readonly IRepository<CustommerOrderEntity, long> _custommerOrderRepository;
        private readonly IRepository<MerchandiseEntity, long> _merchanRepository;
        public KhachHangAppServices(IRepository<CustommerEntity, long> custommerRepository,
            IRepository<CustommerOrderEntity, long> custommerOrderRepository,
            IRepository<MerchandiseEntity, long> merchanRepository
            )
        {
            _custommerRepository = custommerRepository;
            _custommerRepository = custommerRepository;
            _custommerOrderRepository = custommerOrderRepository;
            _merchanRepository = merchanRepository;
        }

        [HttpPost]
        public async Task<PagedResultDto<KhachHangDto>> GetPageList(KhachHangPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _custommerRepository.GetAll().AsNoTracking()
                             select new KhachHangDto
                             {
                                 Id = obj.Id,
                                 PhoneNumber = obj.PhoneNumber,
                                 BookingDate = obj.BookingDate,
                                 Status = obj.Status,
                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                            .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.PhoneNumber.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                            ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderByDescending(m => m.BookingDate.Value).PageBy(input).ToListAsync();

                foreach (var item in dataGrids)
                {
                    var order = _custommerOrderRepository.GetAll().Where(x => x.CustommerId == item.Id).ToList();
                    foreach (var i in order)
                    {
                        float tong = (float)i.Price * i.Amount;
                        item.TongTien += tong;
                    }
                }

                return new PagedResultDto<KhachHangDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        [HttpPost]
        public async Task<KhachHangDto> GetDanhSachOrder(long Id)
        {
            try
            {
                var dto = new KhachHangDto();
                var entity = _custommerRepository.GetAll().FirstOrDefault(x => x.Id == Id);

                dto = ObjectMapper.Map<KhachHangDto>(entity);

                var listOrder = _custommerOrderRepository.GetAll().Where(x => x.CustommerId == Id).ToList();
                dto.DanhSachOrder = ObjectMapper.Map<List<CustommerOrderDto>>(listOrder);

                foreach (var item in dto.DanhSachOrder)
                {
                    var getMerchanse = _merchanRepository.GetAll().FirstOrDefault(x => x.Id == item.MerchandiseId);
                    item.TenThucDon = getMerchanse.NameMerchandise;
                    float tinhTong = (float)item.Price * item.Amount;
                    dto.TongTien += tinhTong;
                }

                return dto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }
    }
}
