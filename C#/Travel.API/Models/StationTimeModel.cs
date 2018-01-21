using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Travel.API.Models
{
    public class StationTimeModel
    {
        public string name { get; set; }
        public DateTime scheduledTime { get; set; }

        public DateTime expectedTime { get; set; }
    }
}