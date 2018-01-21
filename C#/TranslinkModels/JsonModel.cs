using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TranslinkModels
{
    public class JsonModel
    {
        public string error { get; set; }

        public bool success { get; set; }

        public object data { get; set; }
    }
}