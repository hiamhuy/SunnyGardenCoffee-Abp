using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.BanHang
{
    [AbpAuthorize]
    public class ThongKeAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<BillEntity, long> _billRepository;
        private readonly IRepository<BillDetailEntity, long> _billDetailRepository;
        private readonly IRepository<MerchandiseEntity, long> _merchandiseRepository;
        private readonly IRepository<ReceiptEntity, long> _receiptRepository;
        public ThongKeAppServices(IRepository<BillEntity, long> billRepository,
           IRepository<BillDetailEntity, long> billDetailRepository,
           IRepository<MerchandiseEntity, long> merchandiseRepository,
           IRepository<ReceiptEntity, long> receiptRepository)
        {
            _billRepository = billRepository;
            _billDetailRepository = billDetailRepository;
            _merchandiseRepository = merchandiseRepository;
            _receiptRepository = receiptRepository;
        }
        [HttpPost]
        public async Task<ThongKeDto> GetThongKe()
        {
            try
            {
                var result = new ThongKeDto();

                var homNay = DateTime.Now;
                var getFirtDay = GetFirstDayOfMonth(homNay);
                var getLastDay = GetLastDayOfMonth(homNay);
                var getListDate = GetMonths(homNay);
                var getAllBill = _billRepository.GetAll().Where(x => x.DatePrint.Value >= getFirtDay && x.DatePrint.Value <= getLastDay).ToList();
                var getAllNhap = _receiptRepository.GetAll().Where(x => x.DateAdded.Value >= getFirtDay && x.DateAdded.Value <= getLastDay).ToList();

                result.SoDonHang = getAllBill.Count();

                result.DongTienVao = getAllBill.Sum(x => x.IntoMoney);

                result.DongTienRa = getAllNhap.Sum(x => x.TotalPrice);

                float tinhLoiNhuan = (float)(result.DongTienRa - result.DongTienVao) / ((float)result.DongTienVao * 100);
                result.LoiNhuan = (float)Math.Round(tinhLoiNhuan);

                //var getTotalBill = _billRepository.GetAll().GroupBy(x => new DateTime());


                var _abc = _billDetailRepository.GetAll()
                    .GroupBy(x => x.MerchandiseId)
                    .Select(dt => new DoUongBanChay
                    {
                        Id = dt.Key,
                        Count = dt.Count()

                    }).OrderByDescending(x => x.Count).Take(5).ToList();

                var _hot = from h in _abc
                           join td in _merchandiseRepository.GetAll() on h.Id equals td.Id
                           select new ThucDonHot
                           {
                               Id = h.Id,
                               HinhAnh = td.Image,
                               TenMon = td.NameMerchandise
                           };

                result.danhSachHot = _hot.ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }
        [HttpPost]
        public async Task<BieuDoThongKeDto> GetDataChart()
        {
            try
            {
                var result = new BieuDoThongKeDto();

               
                return result;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }




        public List<DateTime> GetMonths(DateTime dt)
        {
            List<DateTime> result = new List<DateTime>();
            for (int i = 1; i < 12; i++)
            {
                result.Add(new DateTime(dt.Year, i, 1));
            }
            return result;
        }

        public static DateTime GetFirstDayOfMonth(DateTime dtInput)
        {
            DateTime dtResult = dtInput;
            dtResult = dtResult.AddDays((-dtResult.Day) + 1);
            return dtResult;
        }

        public static DateTime GetLastDayOfMonth(DateTime dtInput)
        {
            DateTime dtResult = dtInput;
            dtResult = dtResult.AddMonths(1);
            dtResult = dtResult.AddDays(-(dtResult.Day));
            return dtResult;
        }

    }
}
