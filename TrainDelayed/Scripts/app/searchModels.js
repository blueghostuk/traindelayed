var TrainDelayed;
(function (TrainDelayed) {
    (function (Search) {
        var TitleViewModel = (function () {
            function TitleViewModel() {
                this.from = ko.observable();
                this.to = ko.observable();
                this.dateString = ko.observable();
                this.results = ko.observableArray();
            }
            return TitleViewModel;
        })();
        Search.TitleViewModel = TitleViewModel;

        var Train = (function () {
            function Train(fromTiploc, toTiploc, delay, tiplocs) {
                this.changeOfOriginStation = null;
                this.cancelledAtStation = null;
                this.changeOfOrigin = false;
                this.cancelled = false;
                this.title = null;
                this.headcode = delay.Headcode;
                this.url = TrainNotifier.Common.serverSettings.trainLink + "/" + delay.Uid + "/" + moment(delay.From.Expected).format(TrainNotifier.DateTimeFormats.dateUrlFormat);

                var originTiploc = delay.Origin;
                this.originStation = TrainNotifier.TiplocHelper.toDisplayString(originTiploc);

                var destTiploc = delay.Dest;
                this.destStation = TrainNotifier.TiplocHelper.toDisplayString(destTiploc);

                this.fromStation = TrainNotifier.TiplocHelper.toDisplayString(fromTiploc);

                this.expectedDeparture = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.From.Expected, TrainNotifier.DateTimeFormats.timeFormat);
                this.fromPlatform = delay.From.Platform;
                if (delay.From.Actual) {
                    this.actualDeparture = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.From.Actual, TrainNotifier.DateTimeFormats.timeFormat);
                    this.fromPlatform = delay.From.Platform || this.fromPlatform;
                } else {
                    this.actualDeparture = "Unknown";
                }

                this.toStation = TrainNotifier.TiplocHelper.toDisplayString(toTiploc);
                this.expectedArrival = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.To.Expected, TrainNotifier.DateTimeFormats.timeFormat);
                this.toPlatform = delay.To.Platform;
                if (delay.To.Actual) {
                    this.actualArrival = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.To.Actual, TrainNotifier.DateTimeFormats.timeFormat);
                    this.delay = delay.DelayTime.toString();
                    this.delayText = delay.DelayTime > 0 ? delay.DelayTime + " mins late" : delay.DelayTime == 0 ? "on time" : (delay.DelayTime * -1) + " mins early";
                    this.delayCss = delay.DelayTime >= 30 ? "danger" : delay.DelayTime > 0 ? "warning" : "success";
                    this.toPlatform = delay.To.Platform || this.toPlatform;
                } else {
                    this.actualArrival = "Unknown";
                    this.delay = "Unknown";
                    this.delayText = "not known";
                    this.delayText = "not known";
                    this.delayCss = "";
                }

                var toc;
                if (delay.Operator) {
                    toc = tocs[delay.Operator.Code];
                }
                if (toc) {
                    this.tocCode = toc.code;
                    this.tocName = toc.name;
                    this.tocUrl = toc.webLink;
                } else {
                    this.tocCode = null;
                    this.tocName = null;
                    this.tocUrl = null;
                }
            }
            return Train;
        })();
        Search.Train = Train;
    })(TrainDelayed.Search || (TrainDelayed.Search = {}));
    var Search = TrainDelayed.Search;
})(TrainDelayed || (TrainDelayed = {}));
