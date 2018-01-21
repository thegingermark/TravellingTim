using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using TranslinkModels;

namespace TranslinkConsumer
{
    public class StationHelper
    {
         public List<StationModel> GetAllStations()
        {
            StationList list = new StationList();

            return list.stations;
        }

        public StationModel GetStationByName(string name)
        {
            List<StationModel> allStation = GetAllStations();

            StationModel station = allStation.Where(c => c.name.ToLower().Contains(name.ToLower())).FirstOrDefault() ;

            return station;
        }

        public StationModel GetTrainAtNearestTime(string station = "", string datetime = "")
        {
            List<StationModel> all = GetAllStations();
            StationModel result = new StationModel();
            if (!string.IsNullOrEmpty(station))
            {
                all = all.Where(c => c.name.Contains(station)).ToList();
            }

            DateTime startTime = DateTime.Now;
            if (!string.IsNullOrEmpty(datetime))
            {
                startTime = Convert.ToDateTime(datetime);
            }

            StationList stationList = new StationList();
            List<DateTime> lisburnTimes = stationList.GetTimeTableForStation("Lisburn");
            List<DateTime> botanicTime = stationList.GetTimeTableForStation("Botanic");

            DateTime lisburnNearest =  GetNearestTimeValue(startTime, lisburnTimes);
            DateTime botanicNearest = GetNearestTimeValue(startTime, botanicTime);

            if (lisburnNearest < botanicNearest || station.Contains("Lisburn"))
            {
                result = GetStationByName("Lisburn");
                result.scheduledTime = lisburnNearest;
                DateTime expected = GetExpectedTrainTime("Lisburn");

                if (expected != DateTime.MinValue)
                {
                    result.expectedTime = expected;
                }
                else
                {
                    result.expectedTime = result.scheduledTime;
                }

                return result;
            }
            else
            {
                result = GetStationByName("Botanic");
                result.scheduledTime = botanicNearest;
                DateTime expected = GetExpectedTrainTime("Botanic");

                if (expected != DateTime.MinValue)
                {
                    result.expectedTime = expected;
                }
                else
                {
                    result.expectedTime = result.scheduledTime;
                }

                return result;
            }
        }

        public StationModel GetNearestStation(long latitude, long longitude)
        {
            StationModel stationLisburn = GetStationByName("Lisburn");
            StationModel stationBotanic = GetStationByName("Botanic");

            var sCoord = new GeoCoordinate(latitude, longitude);
            var lisCoord = new GeoCoordinate(stationLisburn.latitude, stationLisburn.longitude);
            var botCoord = new GeoCoordinate(stationBotanic.latitude, stationBotanic.longitude);

            double lisDist = sCoord.GetDistanceTo(lisCoord);
            double botDist = sCoord.GetDistanceTo(botCoord);

            if (lisDist < botDist)
            {
                return stationLisburn;
            }
            else
            {
                return stationBotanic;
            }
        }

        private DateTime GetNearestTimeValue(DateTime time, List<DateTime> list)
        {
            long difference = long.MaxValue;
            DateTime result = new DateTime();

            foreach (var item in list)
            {
                if ((item.Ticks - time.Ticks) < difference)
                {
                    difference = item.Ticks - time.Ticks;
                    result = item;
                }
            }
            return result;
        }


        private DateTime GetExpectedTrainTime(string station)
        {
            string url = string.Empty;
            if (station == "botanic")
            {
                url = "https://apis.opendatani.gov.uk/translink/3042A8.xml";
                
            }
            else
            {
                url = "https://apis.opendatani.gov.uk/translink/3044C3.xml";
            }

            XmlTextReader reader = new XmlTextReader(url);
            while (reader.Read())
                {
                    if (reader.Name == "ExpectedArriveTime")
                    {
                        string date = reader["time"];

                        if (date != "On time")
                        {
                            return DateTime.Parse(date);
                        }
                        else
                        {
                            return DateTime.MinValue;
                        }
                    }
                }

            return DateTime.MinValue;
        }
    }
}
