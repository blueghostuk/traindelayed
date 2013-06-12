using System.Web.Optimization;

namespace TrainDelayed
{
    public static class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.ba-hashchange.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.mapping-latest.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap*"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                "~/Scripts/moment.js",
                "~/Scripts/moment-datepicker.js"));

            bundles.Add(new ScriptBundle("~/bundles/index").Include(
                "~/Scripts/app/index.js"));

            bundles.Add(new ScriptBundle("~/bundles/search-results").Include(
                "~/Scripts/app/search-results.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/common.js",
                "~/Scripts/app/webApi.js",
                "~/Scripts/app/Tocs.js",
                "~/Scripts/app/viewmodels.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                //"~/Content/bootstrap.css",
                "~/Content/cerulean.css",
                "~/Content/moment-datepicker/bootstrap-responsive.css",
                "~/Content/datepicker.css",
                "~/Content/style.css"));
        }
    }
}
