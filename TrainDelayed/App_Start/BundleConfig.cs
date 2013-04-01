using System.Web.Optimization;

namespace TrainDelayed
{
    public static class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.mapping-latest.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap*"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                "~/Scripts/moment.js",
                "~/Scripts/moment-datepicker.js"));

            bundles.Add(new ScriptBundle("~/bundles/index").Include(
                "~/Scripts/index.js"));

            bundles.Add(new ScriptBundle("~/bundles/search-results").Include(
                "~/Scripts/search-results.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/Tocs.js",
                "~/Scripts/viewmodels.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.css",
                "~/Content/bootstrap-responsive.css",
                "~/Content/style.css"));
        }
    }
}
