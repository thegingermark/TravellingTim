using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TranslinkModels;

namespace TranslinkConsumer
{
    public class StationList
    {
        public List<DateTime> botanicTimeTable = new List<DateTime>
                {
                    Convert.ToDateTime("06:19"),
                    Convert.ToDateTime("06:52"),
                    Convert.ToDateTime("07:22"),
                    Convert.ToDateTime("07:34"),
                    Convert.ToDateTime("07:43"),
                    Convert.ToDateTime("07:56"),
                    Convert.ToDateTime("08:03"),
                    Convert.ToDateTime("08:17"),
                    Convert.ToDateTime("08:23"),
                    Convert.ToDateTime("08:36"),
                    Convert.ToDateTime("08:43"),
                    Convert.ToDateTime("08:56"),
                    Convert.ToDateTime("09:03"),
                    Convert.ToDateTime("09:17"),
                    Convert.ToDateTime("09:23"),
                    Convert.ToDateTime("09:36"),
                    Convert.ToDateTime("10:06"),
                    Convert.ToDateTime("10:36"),
                    Convert.ToDateTime("11:06"),
                    Convert.ToDateTime("11:36"),
                    Convert.ToDateTime("12:06"),
                    Convert.ToDateTime("12:36"),
                    Convert.ToDateTime("13:06"),
                    Convert.ToDateTime("13:36"),
                    Convert.ToDateTime("14:06"),
                    Convert.ToDateTime("14:36"),
                    Convert.ToDateTime("15:06"),
                    Convert.ToDateTime("15:36"),
                    Convert.ToDateTime("15:59"),
                    Convert.ToDateTime("16:09"),
                    Convert.ToDateTime("16:22"),
                    Convert.ToDateTime("16:38"),
                    Convert.ToDateTime("16:42"),
                    Convert.ToDateTime("17:02"),
                    Convert.ToDateTime("17:22"),
                    Convert.ToDateTime("17:43"),
                    Convert.ToDateTime("18:02"),
                    Convert.ToDateTime("18:36"),
                    Convert.ToDateTime("19:06"),
                    Convert.ToDateTime("19:36"),
                    Convert.ToDateTime("20:06"),
                    Convert.ToDateTime("20:36"),
                    Convert.ToDateTime("21:09"),
                    Convert.ToDateTime("21:36"),
                    Convert.ToDateTime("22:36"),
                    Convert.ToDateTime("23:26"),
                    Convert.ToDateTime("23:28"),
                   };
        public List<DateTime> lisburnTimeTable = new List<DateTime>
                {
                    Convert.ToDateTime("06:23"),
                    Convert.ToDateTime("06:53"),
                    Convert.ToDateTime("07:25"),
                    Convert.ToDateTime("07:27"),
                    Convert.ToDateTime("07:45"),
                    Convert.ToDateTime("07:47"),
                    Convert.ToDateTime("08:05"),
                    Convert.ToDateTime("08:07"),
                    Convert.ToDateTime("08:25"),
                    Convert.ToDateTime("08:27"),
                    Convert.ToDateTime("08:45"),
                    Convert.ToDateTime("08:47"),
                    Convert.ToDateTime("09:05"),
                    Convert.ToDateTime("09:08"),
                    Convert.ToDateTime("09:25"),
                    Convert.ToDateTime("09:38"),
                    Convert.ToDateTime("10:08"),
                    Convert.ToDateTime("10:38"),
                    Convert.ToDateTime("11:08"),
                    Convert.ToDateTime("11:38"),
                    Convert.ToDateTime("12:08"),
                    Convert.ToDateTime("12:38"),
                    Convert.ToDateTime("13:08"),
                    Convert.ToDateTime("13:38"),
                    Convert.ToDateTime("14:08"),
                    Convert.ToDateTime("14:38"),
                    Convert.ToDateTime("15:08"),
                    Convert.ToDateTime("15:40"),
                    Convert.ToDateTime("16:10"),
                    Convert.ToDateTime("16:30"),
                    Convert.ToDateTime("16:32"),
                    Convert.ToDateTime("16:50"),
                    Convert.ToDateTime("17:10"),
                    Convert.ToDateTime("17:18"),
                    Convert.ToDateTime("17:30"),
                    Convert.ToDateTime("17:32"),
                    Convert.ToDateTime("17:50"),
                    Convert.ToDateTime("17:52"),
                    Convert.ToDateTime("18:08"),
                    Convert.ToDateTime("18:28"),
                    Convert.ToDateTime("18:38"),
                    Convert.ToDateTime("19:08"),
                    Convert.ToDateTime("19:38"),
                    Convert.ToDateTime("20:08"),
                    Convert.ToDateTime("20:38"),
                    Convert.ToDateTime("21:08"),
                    Convert.ToDateTime("22:08"),
                    Convert.ToDateTime("22:55"),
                    Convert.ToDateTime("22:58"),
                    Convert.ToDateTime("23:00")
                };

        public List<StationModel> stations { set; get; }
        public StationList()
        {
            stations = new List<StationModel>();

            stations.Add(new StationModel() { name = "BELFAST - BOTANIC RAIL STATION",
                latitude = -5.933051794724724,
                longitude = 54.58840042790338
            });
            stations.Add(new StationModel() { name = "LISBURN RAIL STATION",
                latitude = -6.046294892245204,
                longitude = 54.513899573620968,
               
            });
        }

        public List<DateTime> GetTimeTableForStation(string name)
        {
            if (name.Contains("Botanic"))
            {
                return botanicTimeTable;
            }
            else if (name.Contains("Lisburn"))
            {
                return lisburnTimeTable;
            }

            return null;
        }
        
    }
}
