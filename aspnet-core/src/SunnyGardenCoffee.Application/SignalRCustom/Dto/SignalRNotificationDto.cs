using Abp.Domain.Entities;
using System.Collections.Generic;

namespace SunnyGardenCoffee.Dto
{
    public class SignalRNotificationDto : Entity<long>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public List<long> UserIds { get; set; }
        public int Type { get; set; } //NotificationType
        public object Metadata { get; set; }
    }

    
}
