using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Personnal")]
    public class PersonnalEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string PersonnalCode { get; set; }
        [MaxLength(250)]
        public string PersonnalName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        [MaxLength(12)]
        public string PhoneNumber { get; set; }
        [MaxLength(12)]
        public string Address { get; set; }
        public DateTime? DateToWork { get; set; }
        public int? Status { get; set; }
        public long PositionId { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class PersonnalDomain : Entity<long>
    {
        [MaxLength(50)]
        public string PersonnalCode { get; set; }
        [MaxLength(250)]
        public string PersonnalName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        [MaxLength(12)]
        public string PhoneNumber { get; set; }
        [MaxLength(12)]
        public string Address { get; set; }
        public DateTime? DateToWork { get; set; }
        public int? Status { get; set; }
        public long PositionId { get; set; }
        //Tenant
        public int TenantId { get; set; }


    }
}
