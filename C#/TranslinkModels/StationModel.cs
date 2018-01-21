using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TranslinkModels
{
    public class StationModel
    {
       public string name { get; set; }
       public double longitude { get; set; }

       public double latitude { get; set; }

        public DateTime scheduledTime { get; set; }

        public DateTime expectedTime { get; set; }
    }
}
