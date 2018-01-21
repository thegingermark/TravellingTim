using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Travel.API.Controllers
{
    public class ResponseModel
    {
       public bool error { get; set; }

        public string message { get; set; }

        public object data { get; set; }
    }
}
