using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Receipt")]
    public class ReceiptEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string ReceiptNumber { get; set; }
        public DateTime? DateAdded { get; set; }
        public long PersonnalId { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }
        public float? TotalPrice { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class ReceiptDomain : Entity<long>
    {
        [MaxLength(50)]
        public string ReceiptNumber { get; set; }
        public DateTime? DateAdded { get; set; }
        public long PersonnalId { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }
        public float? TotalPrice { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
}
