using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.BanHang
{
    [AbpAuthorize]
    public class QuanLyDonHangAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<TableEntity, long> _tableRepository;
        private readonly IRepository<BillEntity, long> _billRepository;
        private readonly IRepository<BillDetailEntity, long> _billDetailRepository;
        private readonly IRepository<MerchandiseEntity, long> _thucDonRepository;
        private readonly IRepository<User, long> _userRepository;
        public QuanLyDonHangAppServices(IRepository<TableEntity, long> tableRepository,

            IRepository<BillEntity, long> billRepository,
            IRepository<BillDetailEntity, long> billDetailRepository,
            IRepository<MerchandiseEntity, long> thucDonRepository,
            IRepository<User, long> userRepository
            )
        {
            _tableRepository = tableRepository;
            _billRepository = billRepository;
            _billDetailRepository = billDetailRepository;
            _thucDonRepository = thucDonRepository;
            _userRepository = userRepository;
        }


        [HttpPost]
        public async Task<PagedResultDto<HoaDonDto>> GetListHoaDon(HoaDonPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _billRepository.GetAll()
                             join u in _userRepository.GetAll() on obj.PersonnalId equals u.Id
                             join t in _tableRepository.GetAll() on obj.TableId equals t.Id 
                             into table from _t in table.DefaultIfEmpty()
                             select new HoaDonDto
                             {
                                 Id = obj.Id,
                                 BillCode = obj.BillCode,
                                 DatePrint = obj.DatePrint,
                                 Type = obj.Type,
                                 IntoMoney = obj.IntoMoney,
                                 MoneyBack = obj.MoneyBack,
                                 Discount = obj.Discount,
                                 MoneyByCustomer = obj.MoneyByCustomer,
                                 NguoiBan = u.Surname + " " +u.Name,
                                 TenBan = _t.NameTable,
                                 TableId = obj.TableId,

                                 TenantId = obj.TenantId,

                             })
                             .WhereIf(input.KieuMua.HasValue, x => x.Type == input.KieuMua)
                             .WhereIf(input.TuNgay.HasValue && input.DenNgay.HasValue, x => x.DatePrint >= input.TuNgay && x.DatePrint <= input.DenNgay)
                             .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.BillCode.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText));

                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderByDescending(m => m.Id).PageBy(input).ToListAsync();

                return new PagedResultDto<HoaDonDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        [HttpGet]
        public async Task<List<HoaDonChiTietDto>> GetHoaDonChiTietByHoaDonId(long? Id)
        {
            try
            {
                var query = (from obj in _billDetailRepository.GetAll().Where(x => x.BillId == Id)
                             join td in _thucDonRepository.GetAll() on obj.MerchandiseId equals td.Id
                             select new HoaDonChiTietDto
                             {
                                 Id = obj.Id,
                                 BillCode = obj.BillCode,
                                 BillId = obj.BillId,
                                 MerchandiseId = obj.MerchandiseId,
                                 TenThucDon = td.NameMerchandise,
                                 Amount = obj.Amount,
                                 Price= obj.Price,
                                 
                                 TenantId= obj.TenantId
                             });
              
                var result = await query.ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

    }
}
