using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TranslinkConsumer;
using TranslinkModels;
using Travel.API.Models;

namespace Travel.API.Controllers
{
    public class TrainDataController : ApiController
    {
        StationHelper helper = new StationHelper();

        [HttpGet]
       public IHttpActionResult GetTrainStationByName(string stationName)
        {
            ResponseModel response = new ResponseModel();
            response.data = helper.GetStationByName(stationName);
            response.error = false;
            if (response.data == null)
            {
                response.message = "Sorry, I could not find this station";
            }
            return Ok(response);
        }


        [HttpGet]
        public IHttpActionResult GetNearestStationByLocation(LocationModel location)
        {
            StationModel station = helper.GetNearestStation(location.latitude, location.longitude);
            ResponseModel response = new ResponseModel();
            response.data = station;
            return Ok(response);
        }
        

        [HttpGet]
        public IHttpActionResult GetTrainAtNearestTime(string stationName = "", string datetime = "")
        {
            DateTime time = DateTime.Now;
            if (!String.IsNullOrEmpty(datetime))
            {
               time = Convert.ToDateTime(datetime); 
            }

            StationModel station = helper.GetTrainAtNearestTime(stationName, time.ToString());
            ResponseModel response = new ResponseModel();

            if (station.name == null)
            {
                response.message = "Sorry, I could not find this station";
                return Ok(response);
            }

            response.data = station;
            response.error = false;


            return Ok(response);
        }

    }
}
