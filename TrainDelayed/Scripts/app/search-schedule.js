var titleModel = new TitleViewModel();
var titleFormat = "ddd Do MMM YYYY";
var dateFormat = "ddd DD MMM YY";
var dateFormatQuery = "YYYY-MM-DD";
var dateApiQuery = "YYYY-MM-DDTHH:mm";
var timeFormat = "HH:mm:ss";
var shortTimeFormat = "HH:mm";
var results = ko.observableArray();
$(function () {
    ko.applyBindings(titleModel, $("#title").get(0));
    ko.applyBindings(results, $("#search-results").get(0));
    loadHashCommand();
    $(window).hashchange(function () {
        loadHashCommand();
    });
    $("#neg-2hrs,#plus-2hrs").click(function () {
        document.location.href = $(this).attr("href");
        window.location.reload();
    });
});
function loadHashCommand() {
    if(document.location.hash.length > 0) {
        var cmdString = document.location.hash;
        var elements = cmdString.split('/');
        if(elements.length >= 4) {
            var from = elements[1];
            var to = elements[3];
            var date = null;
            if(elements.length >= 5) {
                date = moment(elements[4], dateFormatQuery);
            } else {
                date = moment();
            }
            if(elements.length === 6) {
                var time = elements[5].split('-');
                if(time.length === 2) {
                    date.hour(time[0]);
                    date.minute(time[1]);
                }
            }
            getCallingBetween(from, to, date);
            var neg2 = moment(date).subtract(2, "hours");
            var plus2 = moment(date).add(2, "hours");
            $("#neg-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + neg2.format("YYYY-MM-DD/HH-mm"));
            $("#plus-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + plus2.format("YYYY-MM-DD/HH-mm"));
        } else {
        }
    }
    return false;
}
function getCallingBetween(from, to, date) {
    $(".progress").show();
    $("#error-row").hide();
    $("#no-results-row").hide();
    results.removeAll();
    $.when($.getJSON("http://" + server + ":" + apiPort + "/Stanox/?GetByCrs&crsCode=" + from), $.getJSON("http://" + server + ":" + apiPort + "/Stanox/?GetByCrs&crsCode=" + to)).done(function (from, to) {
        var title = "Trains from " + from[0].Description.toLowerCase() + " to " + to[0].Description.toLowerCase();
        if(!date) {
            title += " on " + new moment().format(titleFormat);
        } else {
            title += " on " + date.format(titleFormat);
        }
        titleModel.Text(title);
        getCallingBetweenByStanox(from[0], to[0], date);
    }).fail(function () {
        $(".progress").hide();
        $("#error-row").show();
    });
}
function getCallingBetweenByStanox(from, to, date) {
    var startDate = moment(date).subtract(2, "hours");
    var endDate = moment(date).add(2, "hours");
    titleModel.Text(titleModel.Text() + " " + startDate.format(shortTimeFormat) + "-" + endDate.format(shortTimeFormat));
    $.getJSON("http://" + server + ":" + apiPort + "/TrainMovement/" + from.Name + "/" + to.Name + "?startDate=" + startDate.format(dateApiQuery) + "&endDate=" + endDate.format(dateApiQuery)).done(function (data) {
        if(data && data.length && data.length > 0) {
            for(var i in data) {
                results.push(new TrainViewModel(data[i], from.Description, to.Description));
            }
        } else {
            $("#no-results-row").show();
        }
    }).complete(function () {
        $(".progress").hide();
    }).fail(function () {
        $("#error-row").show();
    });
}
