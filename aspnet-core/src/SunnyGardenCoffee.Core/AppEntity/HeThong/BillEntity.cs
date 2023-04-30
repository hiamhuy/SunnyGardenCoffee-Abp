using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Bill")]
    public class BillEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        public long? CustomerId { get; set; }
        [MaxLength(50)]
        public string BillCode { get; set; }
        public DateTime? DatePrint { get; set; }
        public long PersonnalId { get; set; }
        public int? Type { get; set; }
        public long? TableId { get; set; }
        public float IntoMoney { get; set; }
        public float MoneyByCustomer { get; set; }
        public float MoneyBack { get; set; }
        public int? Discount { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class BillDomain : Entity<long>
    {
        public long? CustomerId { get; set; }
        [MaxLength(50)]
        public string BillCode { get; set; }
        public DateTime? DatePrint { get; set; }
        public long PersonnalId { get; set; }
        public int? Type { get; set; }
        public long? TableId { get; set; }
        public float IntoMoney { get; set; }
        public float MoneyByCustomer { get; set; }
        public float MoneyBack { get; set; }
        public int? Discount { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
}
