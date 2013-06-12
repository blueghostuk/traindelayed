/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Tocs.ts" />
/// <reference path="webApi.ts" />

module TrainDelayed.Search {

    export class TitleViewModel {
        public text: KnockoutObservableString = ko.observable();
    }

    export class Train {

        public headcode: string;
        public url: string;
        public originStation: string;
        public destStation: string;
        public fromStation: string;
        public changeOfOriginStation: string;
        public expectedDeparture: string;
        public actualDeparture: string;
        public toStation: string;
        public cancelledAtStation: string;
        public expectedArrival: string;
        public actualArrival: string;
        public delay: string;
        public tocCode: string;
        public tocName: string;
        public tocUrl: string;
        public changeOfOrigin: bool = false;
        public cancelled: bool = false;
        public title: string = "";

        constructor(fromTiploc: IStationTiploc, toTiploc: IStationTiploc, train: ITrainMovementResult, tiplocs: IStationTiploc[]) {

            this.headcode = train.Actual.HeadCode;
            this.url = Common.serverSettings.trainLink + "/"
                + train.Schedule.TrainUid + "/"
                + moment(train.Actual.OriginDepartTimestamp).format(DateTimeFormats.dateUrlFormat);

            var origin = train.Schedule.Stops[0];
            var originTiploc = StationTiploc.findStationTiploc(origin.TiplocStanoxCode, tiplocs);
            this.originStation = originTiploc.StationName.toLowerCase();

            var dest = train.Schedule.Stops[train.Schedule.Stops.length - 1];
            var destTiploc = StationTiploc.findStationTiploc(dest.TiplocStanoxCode, tiplocs);
            this.destStation = destTiploc.StationName.toLowerCase();

            this.fromStation = fromTiploc.StationName.toLowerCase();
            var fromExpected: IRunningScheduleTrainStop = null;
            for (var i = 0; i < train.Schedule.Stops.length; i++) {
                var scheduleStop = train.Schedule.Stops[i];
                if (scheduleStop.TiplocStanoxCode === fromTiploc.Stanox) {
                    fromExpected = scheduleStop;
                    break;
                }
            }
            if (fromExpected) {
                this.expectedDeparture = fromExpected.PublicDeparture ?
                    DateTimeFormats.formatTimeString(fromExpected.PublicDeparture) :
                    "Unknown";
            } else {
                this.expectedDeparture = "Unknown";
            }
            var fromActual: IRunningTrainActualStop = null;
            var fromDepartureStops = train.Actual.Stops.filter(function (stop: IRunningTrainActualStop) {
                return stop.EventType === EventType.Departure;
            });
            for (var i = 0; i < fromDepartureStops.length; i++) {
                var actualStop = fromDepartureStops[i];
                if (actualStop.TiplocStanoxCode === fromTiploc.Stanox) {
                    fromActual = actualStop;
                    break;
                }
            }
            if (fromActual) {
                this.actualDeparture = fromActual.ActualTimestamp ?
                    DateTimeFormats.formatTimeString(fromActual.ActualTimestamp) :
                    "Unknown";
            } else {
                this.actualDeparture = "Unknown";
            }

            this.toStation = toTiploc.StationName.toLowerCase();
            var toExpected: IRunningScheduleTrainStop = null;
            for (var i = 0; i < train.Schedule.Stops.length; i++) {
                var scheduleArrivalStop = train.Schedule.Stops[i];
                if (scheduleArrivalStop.TiplocStanoxCode === toTiploc.Stanox) {
                    toExpected = scheduleArrivalStop;
                    break;
                }
            }
            if (toExpected) {
                this.expectedArrival = toExpected.PublicArrival ?
                    DateTimeFormats.formatTimeString(toExpected.PublicArrival) :
                    "Unknown";
            } else {
                this.expectedArrival = "Unknown";
            }
            var toActual: IRunningTrainActualStop = null;
            var toArrivalStops = train.Actual.Stops.filter(function (stop: IRunningTrainActualStop) {
                return stop.EventType === EventType.Arrival;
            });
            for (var i = 0; i < toArrivalStops.length; i++) {
                var actualArrivalStop = toArrivalStops[i];
                if (actualArrivalStop.TiplocStanoxCode === toTiploc.Stanox) {
                    toActual = actualArrivalStop;
                    break;
                }
            }
            if (toActual) {
                this.actualArrival = DateTimeFormats.formatTimeString(toActual.ActualTimestamp);
                this.delay = moment(toActual.ActualTimestamp).diff(moment(toActual.PlannedTimestamp), 'minutes').toString();
            } else {
                this.actualArrival = "Unknown";
                this.delay = "Unknown";
            }            

            var toc = tocs[train.Schedule.AtocCode.Code];
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
                var canTxt = can.Type;
                if (can.CancelledAtStanoxCode) {
                    var canTiploc = StationTiploc.findStationTiploc(can.CancelledAtStanoxCode, tiplocs);
                    this.cancelledAtStation = canTiploc.Description.toLowerCase();
                    canTxt += " @ " + canTiploc.Description.toLowerCase();
                } else {
                    this.cancelledAtStation = null;
                }
                canTxt += " @ " + moment(can.CancelledTimestamp).format(DateTimeFormats.timeFormat)
                    + " - Reason: ";
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
                var cooTiploc = StationTiploc.findStationTiploc(coo.NewOriginStanoxCode, tiplocs);
                this.changeOfOriginStation = cooTiploc.Description.toLowerCase();
                this.changeOfOrigin = true;
            } else {
                this.changeOfOriginStation = null;
                this.changeOfOrigin = false;
            }
        }

    }

}