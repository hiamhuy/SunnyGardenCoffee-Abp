using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("CustommerOrder")]
    public class CustommerOrderEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        public long? CustommerId { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }
        public long MerchandiseId { get; set; }
        public int Amount { get; set; }
        public float? Price { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class CustommerOrderDomain : Entity<long>
    {
        public long? CustommerId { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }
        public long MerchandiseId { get; set; }
        public int Amount { get; set; }
        public float? Price { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
}
