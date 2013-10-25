using System;
using System.Configuration;
using System.Linq;
using System.Web;
using TrainNotifier.Common.Model.Api;
using TrainNotifier.Common.Model.Schedule;
using TrainNotifier.WebClient.App_Code;

namespace TrainDelayed.Handlers
{
    public class FromToHandler
    {
        public const string QueryFragment = "?_escaped_fragment_=";

        public static bool IsGoogleRequest(Uri uri)
        {
            return uri.Query.Contains(QueryFragment);
        }

        private readonly string _linkUrlFormat = ConfigurationManager.AppSettings["linkUrlFormat"];
        private readonly string _apiUrl = ConfigurationManager.AppSettings["apiUrl"];

        private readonly HttpResponseBase _response;
        private readonly WebApiService _webApiService;

        public FromToHandler(HttpResponseBase response)
        {
            _response = response;
            _webApiService = new WebApiService(string.Concat("http://", _apiUrl));
        }

        public void ProcessRequest(Uri url)
        {
            string fromCrsCode = url.Query.Replace(QueryFragment, string.Empty).Split('/').ElementAt(1);
            string toCrsCode = url.Query.Replace(QueryFragment, string.Empty).Split('/').ElementAt(3);

            StationTiploc fromStation = _webApiService.GetStation(fromCrsCode);
            StationTiploc toStation = _webApiService.GetStation(toCrsCode);

            _response.Write("<!DOCTYPE html><html><head>");

            DateTime today = DateTime.Now;
            DateTime startTime = today.AddHours(-1);
            DateTime endTime = today.AddHours(1);
            _response.Write(string.Format("<title>Trains from {0} to {1} on {2:dd/MM/yyyy} between {3:HH:mm} and {4:HH:mm}</title>",
                fromStation.Description, toStation.Description, today, startTime, endTime));
            _response.Write(string.Format("<meta name=\"description\" content=\"Trains from {0} to {1} on {2:dd/MM/yyyy} between {3:HH:mm} and {4:HH:mm}\">",
                fromStation.Description, toStation.Description, today, startTime, endTime));

            _response.Write("</head><body>");

            _response.Write(string.Format("<h1>Trains from {0} to {1}</h1>", fromStation.Description, toStation.Description));
            _response.Write(string.Format("<h2>On {0:dd/MM/yyyy} between {1:HH:mm} and {2:HH:mm}</h2>", today, startTime, endTime));
            _response.Write("<hr />");

            TrainMovementResults results = _webApiService.BetweenStations(fromCrsCode, toCrsCode, startTime, endTime);

            _response.Write("<p>");
            if (results != null && results.Movements != null && results.Movements.Any())
            {
                foreach (var movement in results.Movements)
                {
                    if (movement.Schedule == null || !movement.Schedule.Stops.Any())
                        continue;
                    var schedule = movement.Schedule;
                    var stops = schedule.Stops.OrderBy(s => s.StopNumber);
                    string link = string.Format(_linkUrlFormat, schedule.TrainUid, today);
                    _response.Write(string.Format("<a href=\"{0}\">{1}</a> {2} Departure from {3} to {4}<br />",
                        link,
                        schedule.Headcode ?? schedule.TrainUid,
                        schedule.DepartureTime,
                        _webApiService.GetTiplocCode(results.Tiplocs, stops.First().TiplocStanoxCode).StationName,
                        _webApiService.GetTiplocCode(results.Tiplocs, stops.Last().TiplocStanoxCode).StationName));
                }
            }
            else
            {
                _response.Write("No train movements");
            }
            _response.Write("</p>");
            _response.Write("</body></html>");
        }
    }
}