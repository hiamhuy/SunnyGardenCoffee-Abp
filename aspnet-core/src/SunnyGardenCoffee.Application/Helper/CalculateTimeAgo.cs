using System;

namespace SunnyGardenCoffee.Helper
{
    public class CalculateTimeAgo
    {
        public static string TimeAgo(DateTime dateTime)
        {
            string result = string.Empty;
            var timeSpan = DateTime.Now.Subtract(dateTime);

            if (timeSpan <= TimeSpan.FromSeconds(60))
            {
                result = string.Format("{0} giây trước", timeSpan.Seconds);
            }
            else if (timeSpan <= TimeSpan.FromMinutes(60))
            {
                result = timeSpan.Minutes > 1 ?
                    String.Format(" {0} phút trước" , timeSpan.Minutes) :
                    "Vài phút trước";
            }
            else if (timeSpan <= TimeSpan.FromHours(24))
            {
                result = timeSpan.Hours > 1 ?
                    String.Format(" {0} giờ trước", timeSpan.Hours) :
                    "Vài giờ trước";
            }
            else if (timeSpan <= TimeSpan.FromDays(30))
            {
                result = timeSpan.Days > 1 ?
                    String.Format(" {0} ngày trước", timeSpan.Days) :
                    "Hôm qua";
            }
            else if (timeSpan <= TimeSpan.FromDays(365))
            {
                result = timeSpan.Days > 30 ?
                    String.Format(" {0} tháng trước", timeSpan.Days / 30) :
                    "Vài tháng trước";
            }
            else
            {
                result = timeSpan.Days > 365 ?
                    String.Format(" {0} năm trước", timeSpan.Days / 365) :
                    "Vài năm trước";
            }
            return result;
        }
    }

}
