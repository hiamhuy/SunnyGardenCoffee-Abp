using Autofac.Core.Activators.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.BanHang;
using SunnyGardenCoffee.Controllers;
using SunnyGardenCoffee.Helper;
using SunnyGardenCoffee.SignalR;
using SunnyGardenCoffee.ThongBao;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Web.Controllers
{

    public class HomeController : SunnyGardenCoffeeControllerBase
    {
        private readonly BanHangAppServices _banHangAppService;
        private readonly ThongBaoAppServices _thongBaoAppService;
        public HomeController(BanHangAppServices banHangAppService,
            ThongBaoAppServices thongBaoAppService)
        {
            _banHangAppService = banHangAppService;
            _thongBaoAppService = thongBaoAppService;
        }
        public ActionResult Index()
        {
            var query = _banHangAppService.GetListThucDonMVC();
            var listLoai = query.Result.ToList();

            ViewBag.data = listLoai;
            var hoaDon = HoaDon;
            ViewBag.soLuong = hoaDon.SoLuong;
            ViewBag.tongTien = hoaDon.TongTien;
            return View();

        }

        public HoaDonThanhToanKhachNgoai HoaDon
        {
            get
            {
                var hoaDon = HttpContext.Session.Get<HoaDonThanhToanKhachNgoai>("HoaDon");
                if (hoaDon == null)
                {
                    hoaDon = new HoaDonThanhToanKhachNgoai();
                }
                return hoaDon;
            }
        }

        [HttpGet]
        public JsonResult AddThucDon(long Id, string soDienThoai, string diaChiNhanHang)
        {
            var hoaDon = HoaDon;
            var result = _banHangAppService.getThucDonByIdMVC(Id);

            hoaDon.SoDienThoai = soDienThoai;
            hoaDon.DiaChiNhanHang = diaChiNhanHang;
            if (hoaDon.DanhSachThucDonDto == null)
            {

                var thucDon = new DanhSachThucDonDto()
                {
                    Id = Id,
                    ThucDonName = result.Result.NameMerchandise,
                    SoLuong = 1,
                    Gia = result.Result.Prices,
                    HinhAnh = result.Result.Image

                };
                hoaDon.DanhSachThucDonDto = new List<DanhSachThucDonDto>
                {
                    thucDon
                };
            }
            else
            {
                var item = hoaDon.DanhSachThucDonDto.FirstOrDefault(x => x.Id == Id);
                if (item != null)
                {
                    item.SoLuong++;
                }
                else
                {
                    var thucDon = new DanhSachThucDonDto()
                    {
                        Id = Id,
                        ThucDonName = result.Result.NameMerchandise,
                        SoLuong = 1,
                        Gia = result.Result.Prices,
                        HinhAnh = result.Result.Image
                    };
                    hoaDon.DanhSachThucDonDto.Add(thucDon);
                }
            }

            hoaDon.SoLuong = hoaDon.DanhSachThucDonDto.Count();
            float thanhTien = 0;
            hoaDon.TongTien = 0;
            foreach (var it in hoaDon.DanhSachThucDonDto)
            {
                thanhTien = (float)(it.Gia * it.SoLuong);
                hoaDon.TongTien += (float)thanhTien;

            }
            HttpContext.Session.Set("HoaDon", hoaDon);

            return Json(hoaDon);
        }


        [HttpGet]
        public List<DanhSachThucDonDto> ShowCart()
        {
            var hoaDon = HoaDon;
            var result = hoaDon.DanhSachThucDonDto;
            return result;
        }

        [HttpGet]
        public HoaDonThanhToanKhachNgoai RemoveProduct(long id)
        {
            var hoaDon = HoaDon;
            var item = hoaDon.DanhSachThucDonDto.Find(x => x.Id == id);
            var checkRemove = hoaDon.DanhSachThucDonDto.Remove(item);
            return hoaDon;
        }

        [HttpGet]
        public bool RemoveAllProduct()
        {
            HttpContext.Session.Remove("HoaDon");
            return true;
        }

        [HttpGet]
        public async Task<HoaDonThanhToanKhachNgoai> ThanhToan()
        {
            var hoaDon = HoaDon;
            var thongBao = new HoaDonThanhToanKhachNgoai();
            if (hoaDon != null)
            {
                thongBao = await _thongBaoAppService.XacNhanGiaoHang(hoaDon);
            }
            HttpContext.Session.Remove("HoaDon");
            return thongBao;
        }

    }
}
