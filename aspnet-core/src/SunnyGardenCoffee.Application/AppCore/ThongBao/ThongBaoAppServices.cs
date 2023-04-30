using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.BanHang;
using SunnyGardenCoffee.Entities;
using SunnyGardenCoffee.Helper;
using SunnyGardenCoffee.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SunnyGardenCoffee.CommonEnum;

namespace SunnyGardenCoffee.ThongBao
{
    [AbpAuthorize]
    public class ThongBaoAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<CustommerEntity, long> _custommerRepository;
        private readonly IRepository<CustommerOrderEntity, long> _custommerOrderRepository;
        private readonly IRepository<MerchandiseEntity, long> _merchanRepository;
        private readonly IRepository<BillEntity, long> _billRepository;
        private readonly IRepository<BillDetailEntity, long> _billDetailRepository;
        private readonly IHubContext<MyNotificationHub> _myChatHub;
        private readonly BanHangAppServices _banHang;
        public ThongBaoAppServices(IRepository<CustommerEntity, long> custommerRepository,
            IRepository<CustommerOrderEntity, long> custommerOrderRepository,
            IHubContext<MyNotificationHub> myChatHub,
            IRepository<MerchandiseEntity, long> merchanRepository,
            IRepository<BillEntity, long> billRepository,
            IRepository<BillDetailEntity, long> billDetailRepository,
            BanHangAppServices banHang
            )
        {
            _custommerRepository = custommerRepository;
            _custommerRepository = custommerRepository;
            _custommerOrderRepository = custommerOrderRepository;
            _myChatHub = myChatHub;
            _merchanRepository = merchanRepository;
            _billRepository = billRepository;
            _billDetailRepository = billDetailRepository;
            _banHang = banHang;
        }
        [HttpPost]
        public async Task<List<KhachHangDto>> GetListKhachHang()
        {
            try
            {
                var query = (from obj in _custommerRepository.GetAll().AsNoTracking()
                             select new KhachHangDto
                             {
                                 Id = obj.Id,
                                 PhoneNumber = obj.PhoneNumber,
                                 BookingDate = obj.BookingDate,
                                 DeliveryAddress = obj.DeliveryAddress,
                                 Status = obj.Status,
                                 TimeAgo = CalculateTimeAgo.TimeAgo(obj.BookingDate.Value),

                                 //Tenant
                                 TenantId = obj.TenantId

                             });


                var listKhachHang = await query.OrderByDescending(x => x.BookingDate.Value).Take(50).ToListAsync();
                return listKhachHang;
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

        [HttpPost]
        public async Task<KhachHangDto> XacNhan(long custommerId)
        {
            var userId = AbpSession.UserId;
            try
            {
                var dto = new KhachHangDto();
                float tongTien = 0;
                var entity = _custommerRepository.GetAll().FirstOrDefault(x => x.Id == custommerId);
                if (entity != null)
                {
                    entity.Status = (int)TrangThaiMuaHang.DaGiaoHang;
                    await _custommerRepository.UpdateAsync(entity);
                }

                var order = _custommerOrderRepository.GetAll().Where(x => x.CustommerId == custommerId).ToList();
                if (order.Count > 0)
                {
                    foreach (var o in order)
                    {
                        float tong = (float)o.Price * o.Amount;
                        tongTien += tong;
                    }
                }

                var bill = new BillEntity()
                {
                    BillCode = randomMa(6),
                    CustomerId = entity.Id,
                    DatePrint = DateTime.Now,
                    PersonnalId = userId.Value,
                    Type = (int)BILLTYPE.MuaVe,
                    IntoMoney = tongTien,
                    TenantId = 1,
                };

                bill.Id = await _billRepository.InsertAndGetIdAsync(bill);
                var _thucDonName = "";
                var hoaDonThanhToan = new HoaDonThanhToan()
                {
                    ThoiGianBan = bill.DatePrint,
                    TongTien = tongTien,
                    TienKhachDua = 0,
                };
                hoaDonThanhToan.DanhSachThucDonDto = new List<DanhSachThucDonDto>();
                if (order.Count > 0)
                {
                    foreach (var i in order)
                    {
                        var billDetail = new BillDetailEntity()
                        {
                            BillId = bill.Id,
                            BillCode = bill.BillCode,
                            MerchandiseId = i.MerchandiseId,
                            Price = i.Price,
                            Amount = i.Amount,
                            TenantId = 1,

                        };
                        await _billDetailRepository.InsertAsync(billDetail);

                        _thucDonName = _merchanRepository.GetAll().FirstOrDefault(x => x.Id == i.MerchandiseId).NameMerchandise;
                        var danhSach = new DanhSachThucDonDto()
                        {
                            ThucDonName = _thucDonName,
                            Gia = (float)i.Price,
                            SoLuong = i.Amount
                        };
                        hoaDonThanhToan.DanhSachThucDonDto.Add(danhSach);

                    }

                }
                _banHang.printBill(hoaDonThanhToan);

                return dto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }
        [HttpPost]
        public async Task<KhachHangDto> TuTroi(long custommerId)
        {
            var userId = AbpSession.UserId;
            try
            {
                var dto = new KhachHangDto();
                var entity = _custommerRepository.GetAll().FirstOrDefault(x => x.Id == custommerId);
                if (entity != null)
                {
                    entity.Status = (int)TrangThaiMuaHang.TuTroi;
                    entity.CreatorUserId = userId;
                    await _custommerRepository.UpdateAsync(entity);
                }

                return dto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<HoaDonThanhToanKhachNgoai> XacNhanGiaoHang(HoaDonThanhToanKhachNgoai input)
        {
            try
            {
                var dto = new HoaDonThanhToanKhachNgoai();
                dto = input;
                var entity = new CustommerEntity()
                {
                    PhoneNumber = input.SoDienThoai,
                    DeliveryAddress = input.DiaChiNhanHang,
                    BookingDate = DateTime.Now,
                    Status = (int)TrangThaiMuaHang.DaDat,
                    TenantId = 1,
                };
                entity.Id = await _custommerRepository.InsertAndGetIdAsync(entity);

                if (input.DanhSachThucDonDto.Count > 0)
                {
                    foreach (var item in input.DanhSachThucDonDto)
                    {
                        var orderDetail = new CustommerOrderEntity()
                        {
                            CustommerId = entity.Id,
                            PhoneNumber = input.SoDienThoai,
                            MerchandiseId = item.Id ?? 0,
                            Amount = item.SoLuong ?? 0,
                            Price = item.Gia,
                            TenantId = 1,
                        };
                        await _custommerOrderRepository.InsertAsync(orderDetail);
                    }
                }
                await _myChatHub.Clients.All.SendAsync("notificationOrder", "send success");
                return dto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public string randomMa(int length)
        {
            var text = "SGC-BILL-";
            var possible = "0123456789";
            Random random = new Random();
            for (var i = 0; i < length; i++)
            {
                text += possible[random.Next(possible.Length)];
            }

            return text;

        }
    }
}
