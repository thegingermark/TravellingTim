using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TranslinkConsumer;
using TranslinkModels;

namespace Travel.API.Controllers
{
    public class WeatherController : ApiController
    {
        [HttpGet]
       public IHttpActionResult IsWeatherBad(string datetime)
        {
            WeatherAPIHelper weatherAPIHelper = new WeatherAPIHelper();
            ResponseModel response = new ResponseModel();

            JsonModel result = weatherAPIHelper.GetCurrentWeather(datetime);
            response.data = result.data;
            response.error = true;
            response.message = null;

            return Ok(response);
        }
    }
}
