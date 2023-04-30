using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("BillDetail")]
    public class BillDetailEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        public long? BillId { get; set; }
        [MaxLength(50)]
        public string BillCode { get; set; }
        public long? MerchandiseId { get; set; }
        public int? Amount { get; set; }
        public float? Price { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
    public class BillDetailDomain : Entity<long>
    {
        public long? BillId { get; set; }
        [MaxLength(50)]
        public string BillCode { get; set; }
        public long? MerchandiseId { get; set; }
        public int? Amount { get; set; }
        public float? Price { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
}
