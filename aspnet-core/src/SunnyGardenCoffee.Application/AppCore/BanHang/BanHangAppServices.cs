using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SunnyGardenCoffee.Authorization.Users;

namespace SunnyGardenCoffee.BanHang
{
    [AbpAuthorize]
    public class BanHangAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<TableEntity, long> _tableRepository;
        private readonly IRepository<CategoryEntity, long> _cateRepository;
        private readonly IRepository<MerchandiseEntity, long> _thucDonRepository;
        private readonly IRepository<BillEntity, long> _billRepository;
        private readonly IRepository<BillDetailEntity, long> _billDetailRepository;
        private static List<Stream> m_streams;
        private static int m_currentPageIndex = 0;
        private readonly IRepository<User, long> _userRepository;

        public BanHangAppServices(IRepository<TableEntity, long> tableRepository,
            IRepository<CategoryEntity, long> cateRepository,
            IRepository<MerchandiseEntity, long> thucDonRepository,
            IRepository<BillEntity, long> billRepository,
            IRepository<BillDetailEntity, long> billDetailRepository,
            IRepository<User, long> userRepository
            )
        {
            _tableRepository = tableRepository;
            _cateRepository = cateRepository;
            _thucDonRepository = thucDonRepository;
            _billRepository = billRepository;
            _billDetailRepository = billDetailRepository;
            _userRepository = userRepository;

        }
        [HttpPost]
        public async Task<List<DanhSachBanDto>> GetListTable()
        {
            try
            {
                var query = (from obj in _tableRepository.GetAll().AsNoTracking()
                             select new DanhSachBanDto
                             {
                                 Id = obj.Id,
                                 NameTable = obj.NameTable,

                             });
                var listTable = await query.ToListAsync();

                return listTable;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        [HttpPost]
        public async Task<List<DanhSachLoaiDto>> GetListLoai()
        {
            try
            {
                var query = (from obj in _cateRepository.GetAll().AsNoTracking()
                             select new DanhSachLoaiDto
                             {
                                 Id = obj.Id,
                                 CategoryCode = obj.CategoryCode,
                                 CategoryName = obj.CategoryName,

                             });
                var listLoai = await query.ToListAsync();

                return listLoai;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        [HttpPost]
        public async Task<List<DanhSachThucDonDto>> GetListThucDon(DanhSachThucDonPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _thucDonRepository.GetAll().Where(x => x.CategoryCode == input.CategoryCode)
                             select new DanhSachThucDonDto
                             {
                                 Id = obj.Id,
                                 ThucDonName = obj.NameMerchandise,
                                 HinhAnh = obj.Image,
                                 Gia = obj.Prices
                             })
                             .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.ThucDonName.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText));
                var listThucDon = await query.ToListAsync();

                return listThucDon;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }
        [HttpPost]
        public async Task<HoaDonThanhToan> ThanhToan(HoaDonThanhToan input)
        {
            var userId = AbpSession.UserId;
            try
            {
                var dto = new HoaDonThanhToan();
                var entity = new BillEntity()
                {
                    BillCode = input.MaHoaDon,
                    DatePrint = input.ThoiGianBan,
                    Type = input.KieuMua,
                    TableId = input.BanId,
                    IntoMoney = input.TongTienThuc,
                    MoneyByCustomer = input.TienKhachDua,
                    MoneyBack = input.TienTraLai,
                    PersonnalId = userId ?? 0,
                    CreatorUserId = userId,
                    Discount = input.ChietKhau,
                    TenantId = 1,
                };
                entity.Id = await _billRepository.InsertAndGetIdAsync(entity);
                if (input.DanhSachThucDonDto.Count > 0)
                {
                    foreach (var item in input.DanhSachThucDonDto)
                    {
                        var billDetail = new BillDetailEntity()
                        {
                            BillId = entity.Id,
                            BillCode = entity.BillCode,
                            MerchandiseId = item.Id,
                            Amount = item.SoLuong,
                            CreatorUserId = userId,
                            Price = item.Gia,
                            TenantId = 1,
                        };
                        await _billDetailRepository.InsertAsync(billDetail);
                    }
                }
                printBill(input);
                return dto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi hệ thống vui lòng liên hệ bộ phận chăm sóc...");
            }

        }

        public void printBill(HoaDonThanhToan input)
        {
            var userId = AbpSession.UserId;
            var tenNguoiBan = _userRepository.GetAll().FirstOrDefault(x => x.Id == userId);

            var data = new DataTable();
            data.Columns.Add("TenNguoiBan");
            data.Columns.Add("ThoiGian");
            data.Columns.Add("TongTien");
            data.Columns.Add("TienKhachDua");
            DataRow rowDt = data.NewRow();
            rowDt["TenNguoiBan"] = tenNguoiBan.Surname + " " + tenNguoiBan.Name;
            rowDt["ThoiGian"] = input.ThoiGianBan.Value.ToString("HH:mm dd/MM/yyyy");
            rowDt["TongTien"] = input.TongTien + " VNĐ";
            rowDt["TienKhachDua"] = input.TienKhachDua + " VNĐ";
            data.Rows.Add(rowDt);

            var dt = new DataTable();
            dt.Columns.Add("TenMonAn");
            dt.Columns.Add("SoLuong");
            dt.Columns.Add("GiaTien");
            dt.Columns.Add("TongTien");
            DataRow row;
            if (input.DanhSachThucDonDto.Count > 0)
            {
                foreach (var item in input.DanhSachThucDonDto)
                {
                    row = dt.NewRow();
                    row["TenMonAn"] = item.ThucDonName;
                    row["SoLuong"] = "SL: "+ item.SoLuong;
                    row["GiaTien"] = item.Gia +" VNĐ";
                    row["TongTien"] = (item.Gia * item.SoLuong) + " VNĐ";
                    dt.Rows.Add(row);
                }
            }

            using var report = new LocalReport();
            report.DataSources.Add(new ReportDataSource("dsThucDon", dt));
            report.DataSources.Add(new ReportDataSource("dsNguoiBan", data));
            report.ReportPath = Path.Combine(Directory.GetCurrentDirectory() + "/Reports/billReport.rdlc");
            PrintToPrinter(report);
        }

        #region export
        public static void PrintToPrinter(LocalReport report)
        {
            Export(report);

        }
        public static void Export(LocalReport report, bool print = true)
        {
            string deviceInfo =
             @"<DeviceInfo>
                <OutputFormat>EMF</OutputFormat>
                <PageWidth>21cm</PageWidth>
                <PageHeight>29.7cm</PageHeight>
                <MarginTop>0cm</MarginTop>
                <MarginLeft>0.1cm</MarginLeft>
                <MarginRight>0.1cm</MarginRight>
                <MarginBottom>0cm</MarginBottom>
            </DeviceInfo>";
            Warning[] warnings;
            m_streams = new List<Stream>();
            report.Render("Image", deviceInfo, CreateStream, out warnings);
            foreach (Stream stream in m_streams)
                stream.Position = 0;

            if (print)
            {
                Print();
            }
        }

        public static void Print()
        {
            if (m_streams == null || m_streams.Count == 0)
                throw new Exception("Error: no stream to print.");
            PrintDocument printDoc = new PrintDocument();
            if (!printDoc.PrinterSettings.IsValid)
            {
                throw new Exception("Error: cannot find the default printer.");
            }
            else
            {
                printDoc.PrintPage += new PrintPageEventHandler(PrintPage);
                m_currentPageIndex = 0;
                printDoc.Print();
            }
        }

        public static Stream CreateStream(string name, string fileNameExtension, Encoding encoding, string mimeType, bool willSeek)
        {
            Stream stream = new MemoryStream();
            m_streams.Add(stream);
            return stream;
        }

        public static void PrintPage(object sender, PrintPageEventArgs ev)
        {
            Metafile pageImage = new
               Metafile(m_streams[m_currentPageIndex]);

            // Adjust rectangular area with printer margins.
            Rectangle adjustedRect = new Rectangle(
                ev.PageBounds.Left - (int)ev.PageSettings.HardMarginX,
                ev.PageBounds.Top - (int)ev.PageSettings.HardMarginY,
                ev.PageBounds.Width,
                ev.PageBounds.Height);

            // Draw a white background for the report
            ev.Graphics.FillRectangle(Brushes.White, adjustedRect);

            // Draw the report content
            ev.Graphics.DrawImage(pageImage, adjustedRect);

            // Prepare for the next page. Make sure we haven't hit the end.
            m_currentPageIndex++;
            ev.HasMorePages = (m_currentPageIndex < m_streams.Count);
        }

        public static void DisposePrint()
        {
            if (m_streams != null)
            {
                foreach (Stream stream in m_streams)
                    stream.Close();
                m_streams = null;
            }
        }

        #endregion

        [HttpPost]
        public async Task<IQueryable<DanhSachThucDonDto>> GetListThucDonMVC()
        {
            try
            {
                var query = (from obj in _thucDonRepository.GetAll()
                             select new DanhSachThucDonDto
                             {
                                 Id = obj.Id,
                                 ThucDonName = obj.NameMerchandise,
                                 HinhAnh = obj.Image,
                                 Gia = obj.Prices
                             });
                return query;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<ThucDonDto> getThucDonByIdMVC(long Id)
        {
            try
            {
                var entity = await _thucDonRepository.GetAll().FirstOrDefaultAsync(x => x.Id == Id);
                var result = ObjectMapper.Map<ThucDonDto>(entity);
                return result;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

    }
}
