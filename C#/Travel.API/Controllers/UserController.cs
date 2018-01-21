using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Travel.API.Models;

namespace Travel.API.Controllers
{
    public class UserController : ApiController
    {
        [HttpPost]
        IHttpActionResult SaveUserDefaultLocation(LocationModel location)
        {
            return Ok();
        }

        [HttpPost]
        IHttpActionResult CreateNewUser(UserModel user)
        {
            return Ok();
        }

        [HttpPost]
        IHttpActionResult SaveUserDefaultDestination(LocationModel location)
        {
            return Ok();
        }

        [HttpGet]
        IHttpActionResult GetUserDefaultDestination(LocationModel location)
        {
            return Ok();
        }

        [HttpGet]
        IHttpActionResult GetUserDefaultLocation(LocationModel location)
        {
            return Ok();
        }
    }
}
