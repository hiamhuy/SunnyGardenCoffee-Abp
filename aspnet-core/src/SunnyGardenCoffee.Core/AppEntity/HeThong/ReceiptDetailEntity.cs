using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("ReceiptDetail")]
    public class ReceiptDetailEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        public long? ReceiptId { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string Amount { get; set; }
        public float? EntryPrice { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
    public class ReceiptDetailDomain : Entity<long>
    {
        public long? ReceiptId { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string Amount { get; set; }
        public float? EntryPrice { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
}
