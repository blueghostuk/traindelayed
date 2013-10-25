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
                "~/Scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/hogan*",
                "~/Scripts/bootstrap*",
                "~/Scripts/typeahead*"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                "~/Scripts/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/index").Include(
                "~/Scripts/app/index-page.js"));

            bundles.Add(new ScriptBundle("~/bundles/search-results").Include(
                "~/Scripts/app/searchModels.js",
                "~/Scripts/app/search-schedule.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/common.js",
                "~/Scripts/app/webApi.js",
                "~/Scripts/app/Tocs.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                // minification seems to fuck this up so include manually in _Layout.cshtml
                //"~/Content/bootstrap/cerulean*",
                "~/Content/bootstrap/typeahead-fix.css",
                "~/Content/bootstrap-datepicker.css",
                "~/Content/style.css"));
        }
    }
}
