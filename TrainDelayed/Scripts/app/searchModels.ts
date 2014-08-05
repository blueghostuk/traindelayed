/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Tocs.ts" />
/// <reference path="webApi.ts" />

module TrainDelayed.Search {

    export class TitleViewModel {
        public from = ko.observable<string>();
        public to = ko.observable<string>();
        public dateString = ko.observable<string>();

        public results = ko.observableArray<TrainDelayed.Search.Train>();
    }

    export class Train {

        public headcode: string;
        public url: string;
        public originStation: string;
        public destStation: string;
        public fromStation: string;
        public fromPlatform: string;
        public changeOfOriginStation: string = null;
        public expectedDeparture: string;
        public actualDeparture: string;
        public toStation: string;
        public toPlatform: string;
        public cancelledAtStation: string = null;
        public expectedArrival: string;
        public actualArrival: string;
        public delay: string;
        public delayText: string;
        public delayCss: string;
        public tocCode: string;
        public tocName: string;
        public tocUrl: string;
        public changeOfOrigin: boolean = false;
        public cancelled: boolean = false;
        public title: string = null;

        constructor(fromTiploc: StationTiploc, toTiploc: StationTiploc, delay: Delay, tiplocs: StationTiploc[]) {
            
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

            //var tocSet = false;
            var toc: TrainDelayed.TrainOperatingCompany;
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

            //if (train && train.Cancellations.length > 0) {
            //    var can = train.Cancellations[0];
            //    var canTxt = "Cancelled " + can.Type;
            //    if (can.CancelledAtStanoxCode) {
            //        var canTiploc = TrainNotifier.StationTiploc.findStationTiplocByStanox(can.CancelledAtStanoxCode, tiplocs);
            //        this.cancelledAtStation = canTiploc.Description.toLowerCase();
            //        canTxt += " @ " + canTiploc.Description.toLowerCase();
            //    } else {
            //        this.cancelledAtStation = null;
            //    }
            //    canTxt += " @ " + moment(can.CancelledTimestamp).format(TrainNotifier.DateTimeFormats.timeFormat)
            //        + " - Reason: ";
            //    if (can.Description) {
            //        canTxt += can.Description;
            //    }
            //    canTxt += " (" + can.ReasonCode + ")";
            //    this.title = canTxt;
            //    this.cancelled = true;
            //} else {
            //    this.cancelled = false;
            //    this.cancelledAtStation = null;
            //}

            //if (train && train.ChangeOfOrigins.length > 0) {
            //    var coo = train.ChangeOfOrigins[0];
            //    var cooTiploc = TrainNotifier.StationTiploc.findStationTiplocByStanox(coo.NewOriginStanoxCode, tiplocs);
            //    this.changeOfOriginStation = cooTiploc.Description.toLowerCase();
            //    this.changeOfOrigin = true;
            //} else {
            //    this.changeOfOriginStation = null;
            //    this.changeOfOrigin = false;
            //}
        }

    }

}