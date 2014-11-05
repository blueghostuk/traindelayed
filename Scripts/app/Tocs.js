var TrainDelayed;
(function (TrainDelayed) {
    var TrainOperatingCompany = (function () {
        function TrainOperatingCompany(code, name, webLink) {
            this.code = code;
            this.name = name;
            this.webLink = webLink;
        }
        TrainOperatingCompany.Freight = "ZZ";
        return TrainOperatingCompany;
    })();
    TrainDelayed.TrainOperatingCompany = TrainOperatingCompany;
})(TrainDelayed || (TrainDelayed = {}));

var tocs = {};
tocs["AW"] = new TrainDelayed.TrainOperatingCompany("AW", "Arriva Trains Wales", "http://www.arrivatrainswales.co.uk/PassengersCharter/");
tocs["CC"] = new TrainDelayed.TrainOperatingCompany("CC", "c2c", "http://www.c2c-online.co.uk/about_us/passengers_charter/what_happens_if_things_go_wrong");
tocs["CH"] = new TrainDelayed.TrainOperatingCompany("CH", "Chiltern Railways Company", "http://www.chilternrailways.co.uk/uploads/publications/715.pdf");
tocs["EM"] = new TrainDelayed.TrainOperatingCompany("EM", "East Midlands Trains", "http://www.eastmidlandstrains.co.uk/Global/NewDelayClaimsForm.pdf");
tocs["ES"] = new TrainDelayed.TrainOperatingCompany("ES", "Eurostar (UK)", "http://www.eurostar.com/uk-en/travel-information/service-information/disruption-compensation");
tocs["FC"] = new TrainDelayed.TrainOperatingCompany("FC", "First Capital Connect", "http://www.firstcapitalconnect.co.uk/customer-care/delay-repay/");
tocs["GC"] = new TrainDelayed.TrainOperatingCompany("GC", "Grand Central", "http://www.grandcentralrail.com/customer-service/getting-a-refund/");
tocs["GW"] = new TrainDelayed.TrainOperatingCompany("GN", "Great Northern", "http://www.thameslinkrailway.com/contact-us/delay-repay/claim-form/");
tocs["GR"] = new TrainDelayed.TrainOperatingCompany("GR", "National Express East Coast", "http://www.eastcoast.co.uk/about-us/passengers-charter1/delay-repay/");
tocs["GW"] = new TrainDelayed.TrainOperatingCompany("GW", "First Great Western", "http://www.firstgreatwestern.co.uk/~/media/PDF/About%20us/Compensation20for20Delays2020April20200620313451001.pdf");
tocs["GX"] = new TrainDelayed.TrainOperatingCompany("GX", "Gatwick Express", "http://www.gatwickexpress.com/en/your-journey/delay-repay/");
tocs["HC"] = new TrainDelayed.TrainOperatingCompany("HC", "Heathrow Connect", "https://www.heathrowconnect.com/content.asp?SID={8F93C2E2-2A31-439C-AD98-962B24C3D668}&pageid=23");
tocs["HT"] = new TrainDelayed.TrainOperatingCompany("HT", "First Hull Trains", "http://www.hulltrains.co.uk/contact-us/faqs/");
tocs["HX"] = new TrainDelayed.TrainOperatingCompany("HX", "Heathrow Express", "https://www.heathrowexpress.com/contact-heathrow-express");
tocs["IL"] = new TrainDelayed.TrainOperatingCompany("IL", "Island Line", "http://www.southwesttrains.co.uk/compensation.aspx?accept=perm");
tocs["LE"] = new TrainDelayed.TrainOperatingCompany("LE", "National Express East Anglia", "http://www.greateranglia.co.uk/about-us/our-performance/delay-repay");
tocs["LM"] = new TrainDelayed.TrainOperatingCompany("LM", "London Midland", "http://www.londonmidland.com/your-journey/delay-repay/");
tocs["LO"] = new TrainDelayed.TrainOperatingCompany("LO", "London Overground", "https://www.tfl.gov.uk/tfl/tickets/refunds/overgroundrefund/default.asp");
tocs["LT"] = new TrainDelayed.TrainOperatingCompany("LT", "London Underground", "http://www.tfl.gov.uk/tfl/tickets/refunds/tuberefund/");
tocs["LU"] = new TrainDelayed.TrainOperatingCompany("LU", "London Underground", "http://www.tfl.gov.uk/tfl/tickets/refunds/tuberefund/");
tocs["ME"] = new TrainDelayed.TrainOperatingCompany("ME", "Merseyrail ", "http://www.merseyrail.org/get-in-contact.aspx");
tocs["NT"] = new TrainDelayed.TrainOperatingCompany("NT", "Northern", "http://www.northernrail.org/northern/passengerscharter/ifthingsgowrong");
tocs["NY"] = new TrainDelayed.TrainOperatingCompany("NY", "North Yorkshire Moors Railway");
tocs["PT"] = new TrainDelayed.TrainOperatingCompany("PT", "Europorte 2");
tocs["SE"] = new TrainDelayed.TrainOperatingCompany("SE", "Southeastern", "http://www.southeasternrailway.co.uk/your-journey/delay-repay/");
tocs["SN"] = new TrainDelayed.TrainOperatingCompany("SN", "Southern", "http://www.southernrailway.com/your-journey/delay-repay/");
tocs["SR"] = new TrainDelayed.TrainOperatingCompany("SR", "ScotRail", "http://www.scotrail.co.uk/aboutus/passenger-charter/view-chapter6b57.html");
tocs["SW"] = new TrainDelayed.TrainOperatingCompany("SW", "South West Trains", "http://www.southwesttrains.co.uk/compensation.aspx?accept=perm");
tocs["GW"] = new TrainDelayed.TrainOperatingCompany("TL", "Thameslink", "http://www.thameslinkrailway.com/contact-us/delay-repay/claim-form/");
tocs["TP"] = new TrainDelayed.TrainOperatingCompany("TP", "First TransPennine Express", "http://www.tpexpress.co.uk/contact-us/");
tocs["TW"] = new TrainDelayed.TrainOperatingCompany("TW", "Tyne & Wear Metro");
tocs["VT"] = new TrainDelayed.TrainOperatingCompany("VT", "Virgin Trains", "http://www.virgintrains.co.uk/assets/pdf/feedback/vt-customer-comment.pdf");
tocs["WR"] = new TrainDelayed.TrainOperatingCompany("WR", "West Coast Railway Company");
tocs["WS"] = new TrainDelayed.TrainOperatingCompany("WS", "Wrexham & Shropshire");
tocs["XC"] = new TrainDelayed.TrainOperatingCompany("XC", "CrossCountry", "http://www.crosscountrytrains.co.uk/customer-service/contact-us");
tocs["ZZ"] = new TrainDelayed.TrainOperatingCompany("ZZ", "Freight");
