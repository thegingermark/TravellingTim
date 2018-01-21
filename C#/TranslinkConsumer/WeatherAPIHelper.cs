using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using TranslinkModels;

namespace TranslinkConsumer
{
    public class WeatherAPIHelper
    {
        public JsonModel GetCurrentWeather(string datetime)
        {
            DateTime time = DateTime.Parse(datetime);
           

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://ds-ec2.scraperwiki.com/");
            var response = client.GetAsync("tjhidvz/eboktibceox3kha/cgi-bin/forecast?date=" + time.ToString("yyyy-MM-dd") + "&time=" + time.ToString("HH:mm:ss") + "&mode=hourly").Result;
            JavaScriptSerializer js = new JavaScriptSerializer();
            JsonModel jsonModel = new JsonModel();
            if (response.IsSuccessStatusCode)
            {
                string strJson = response.Content.ReadAsStringAsync().Result;
                jsonModel = js.Deserialize<JsonModel>(strJson);
            }

            return jsonModel;
        }
    }
}
