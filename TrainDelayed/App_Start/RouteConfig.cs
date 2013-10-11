using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace TrainDelayed.App_Start
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.Add(new Route("search/from/{crsA}/to/{crsB}/{year}-{month}-{day}/{time}",
                null,
                new RouteValueDictionary
                {
                    {"crsA", "[A-Z]{3}"},
                    {"crsB", "[A-Z]{3}"},
                    {"year", "[0-9]{4}"},
                    {"month", "[0-9]{2}"},
                    {"day", "[0-9]{2}"},
                    {"time", "[0-9]{2}-[0-9]{2}"}
                },
                new SearchRouteHandler()));
            routes.Add(new Route("search/from/{crsA}/to/{crsB}",
                null,
                new RouteValueDictionary
                {
                    {"crsA", "[A-Z]{3}"},
                    {"crsB", "[A-Z]{3}"},
                },
                new SearchRouteHandler()));
        }
    }

    class SearchRouteHandler : IRouteHandler
    {
        public System.Web.IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return new SearchHttpHandler(requestContext.RouteData.Values);
        }

        class SearchHttpHandler : IHttpHandler
        {
            private readonly string _crsA,
                _crsB;
            private readonly DateTime _date;
            private readonly string _time;

            public SearchHttpHandler(IDictionary<string, object> values)
            {
                if (values.ContainsKey("crsA"))
                    _crsA = values["crsA"].ToString();
                if (values.ContainsKey("crsB"))
                    _crsB = values["crsB"].ToString();

                if (values.ContainsKey("year") && values.ContainsKey("month") && values.ContainsKey("day"))
                {
                    _date = new DateTime(
                        int.Parse(values["year"].ToString()),
                        int.Parse(values["month"].ToString()),
                        int.Parse(values["day"].ToString()));
                }
                else
                {
                    _date = DateTime.UtcNow.Date;
                }
                if (values.ContainsKey("time"))
                {
                    _time = "/" + values["time"].ToString();
                }
                else
                {
                    _time = "/" + DateTime.Now.TimeOfDay.ToString("hh\\-mm");
                }
            }

            public bool IsReusable
            {
                get { return false; }
            }

            public void ProcessRequest(HttpContext context)
            {
                context.Response.RedirectPermanent(string.Format("~/search-results#!from/{0}/to/{1}/{2:yyyy-MM-dd}{3}", _crsA, _crsB, _date, _time));
            }
        }
    }
}