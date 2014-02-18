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
            function Train(fromTiploc, toTiploc, train, tiplocs) {
                this.changeOfOrigin = false;
                this.cancelled = false;
                this.title = "";
                if (!train.Actual)
                    return;

                this.headcode = train.Actual.HeadCode;
                this.url = TrainNotifier.Common.serverSettings.trainLink + "/" + train.Schedule.TrainUid + "/" + moment(train.Actual.OriginDepartTimestamp).format(TrainNotifier.DateTimeFormats.dateUrlFormat);

                var origin = train.Schedule.Stops[0];
                var originTiploc = TrainNotifier.StationTiploc.findStationTiploc(origin.TiplocStanoxCode, tiplocs);
                this.originStation = TrainNotifier.StationTiploc.toDisplayString(originTiploc);

                var dest = train.Schedule.Stops[train.Schedule.Stops.length - 1];
                var destTiploc = TrainNotifier.StationTiploc.findStationTiploc(dest.TiplocStanoxCode, tiplocs);
                this.destStation = TrainNotifier.StationTiploc.toDisplayString(destTiploc);

                this.fromStation = TrainNotifier.StationTiploc.toDisplayString(fromTiploc);
                var fromExpected = null;
                for (var i = 0; i < train.Schedule.Stops.length; i++) {
                    var scheduleStop = train.Schedule.Stops[i];
                    if (scheduleStop.TiplocStanoxCode === fromTiploc.Stanox) {
                        fromExpected = scheduleStop;
                        break;
                    }
                }
                if (fromExpected) {
                    this.expectedDeparture = fromExpected.PublicDeparture ? TrainNotifier.DateTimeFormats.formatTimeString(fromExpected.PublicDeparture) : "Unknown";
                    this.fromPlatform = fromExpected.Platform;
                } else {
                    this.expectedDeparture = "Unknown";
                    this.fromPlatform = null;
                }
                var fromActual = null;
                var fromDepartureStops = train.Actual.Stops.filter(function (stop) {
                    return stop.EventType === 1 /* Departure */;
                });
                for (var i = 0; i < fromDepartureStops.length; i++) {
                    var actualStop = fromDepartureStops[i];
                    if (actualStop.TiplocStanoxCode === fromTiploc.Stanox) {
                        fromActual = actualStop;
                        break;
                    }
                }
                if (fromActual) {
                    this.actualDeparture = fromActual.ActualTimestamp ? TrainNotifier.DateTimeFormats.formatDateTimeString(fromActual.ActualTimestamp, TrainNotifier.DateTimeFormats.timeFormat) : "Unknown";
                    this.fromPlatform = fromActual.Platform || this.fromPlatform;
                } else {
                    this.actualDeparture = "Unknown";
                }

                this.toStation = TrainNotifier.StationTiploc.toDisplayString(toTiploc);
                var toExpected = null;
                for (var i = 0; i < train.Schedule.Stops.length; i++) {
                    var scheduleArrivalStop = train.Schedule.Stops[i];
                    if (scheduleArrivalStop.TiplocStanoxCode === toTiploc.Stanox) {
                        toExpected = scheduleArrivalStop;
                        break;
                    }
                }
                if (toExpected) {
                    this.expectedArrival = toExpected.PublicArrival ? TrainNotifier.DateTimeFormats.formatTimeString(toExpected.PublicArrival) : "Unknown";
                    this.toPlatform = toExpected.Platform;
                } else {
                    this.expectedArrival = "Unknown";
                    this.toPlatform = null;
                }
                var toActual = null;
                var toArrivalStops = train.Actual.Stops.filter(function (stop) {
                    return stop.EventType === 2 /* Arrival */;
                });
                for (var i = 0; i < toArrivalStops.length; i++) {
                    var actualArrivalStop = toArrivalStops[i];
                    if (actualArrivalStop.TiplocStanoxCode === toTiploc.Stanox) {
                        toActual = actualArrivalStop;
                        break;
                    }
                }
                if (toActual) {
                    this.actualArrival = TrainNotifier.DateTimeFormats.formatDateTimeString(toActual.ActualTimestamp, TrainNotifier.DateTimeFormats.timeFormat);
                    var delay = moment(toActual.ActualTimestamp).diff(moment(toActual.PlannedTimestamp), 'minutes');
                    this.delay = delay.toString();
                    this.delayText = delay > 0 ? delay + " mins late" : delay == 0 ? "on time" : (delay * -1) + " mins early";
                    this.delayCss = delay >= 30 ? "danger" : delay > 0 ? "warning" : "success";
                    this.toPlatform = toActual.Platform || this.toPlatform;
                } else {
                    this.actualArrival = "Unknown";
                    this.delay = "Unknown";
                    this.delayText = "not known";
                    this.delayText = "not known";
                    this.delayCss = "";
                }

                var tocSet = false;
                var toc;
                if (train.Schedule.AtocCode) {
                    toc = tocs[train.Schedule.AtocCode.Code];
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

                if (train && train.Cancellations.length > 0) {
                    var can = train.Cancellations[0];
                    var canTxt = "Cancelled " + can.Type;
                    if (can.CancelledAtStanoxCode) {
                        var canTiploc = TrainNotifier.StationTiploc.findStationTiploc(can.CancelledAtStanoxCode, tiplocs);
                        this.cancelledAtStation = canTiploc.Description.toLowerCase();
                        canTxt += " @ " + canTiploc.Description.toLowerCase();
                    } else {
                        this.cancelledAtStation = null;
                    }
                    canTxt += " @ " + moment(can.CancelledTimestamp).format(TrainNotifier.DateTimeFormats.timeFormat) + " - Reason: ";
                    if (can.Description) {
                        canTxt += can.Description;
                    }
                    canTxt += " (" + can.ReasonCode + ")";
                    this.title = canTxt;
                    this.cancelled = true;
                } else {
                    this.cancelled = false;
                    this.cancelledAtStation = null;
                }

                if (train && train.ChangeOfOrigins.length > 0) {
                    var coo = train.ChangeOfOrigins[0];
                    var cooTiploc = TrainNotifier.StationTiploc.findStationTiploc(coo.NewOriginStanoxCode, tiplocs);
                    this.changeOfOriginStation = cooTiploc.Description.toLowerCase();
                    this.changeOfOrigin = true;
                } else {
                    this.changeOfOriginStation = null;
                    this.changeOfOrigin = false;
                }
            }
            return Train;
        })();
        Search.Train = Train;
    })(TrainDelayed.Search || (TrainDelayed.Search = {}));
    var Search = TrainDelayed.Search;
})(TrainDelayed || (TrainDelayed = {}));
