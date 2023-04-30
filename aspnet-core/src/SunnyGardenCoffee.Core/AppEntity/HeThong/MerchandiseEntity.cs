using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Merchandise")]
    public class MerchandiseEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string CodeMerchandise { get; set; }
        public string Image { get; set; }
        [MaxLength(250)]
        public string NameMerchandise { get; set; }
        [MaxLength(50)]
        public string CategoryCode { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }
        public float Prices { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class MerchandiseDomain : Entity<long>
    {
        [MaxLength(50)]
        public string CodeMerchandise { get; set; }
        public string Image { get; set; }
        [MaxLength(250)]
        public string NameMerchandise { get; set; }
        [MaxLength(50)]
        public string CategoryCode { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }
        public float Prices { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
}
