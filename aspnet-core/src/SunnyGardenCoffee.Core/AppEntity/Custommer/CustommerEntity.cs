using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Custommer")]
    public class CustommerEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string PhoneNumber { get; set; }
        [MaxLength(250)]
        public string DeliveryAddress { get; set; }
        public DateTime? BookingDate { get; set; }
        public int? Status { get; set; }
        public long? BillId { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class CustommerDomain : Entity<long>
    {
        [MaxLength(50)]
        public string PhoneNumber { get; set; }
        [MaxLength(250)]
        public string DeliveryAddress { get; set; }
        public DateTime? BookingDate { get; set; }
        public int? Status { get; set; }
        public long? BillId { get; set; }
        //Tenant
        public int TenantId { get; set; }
    }
}
