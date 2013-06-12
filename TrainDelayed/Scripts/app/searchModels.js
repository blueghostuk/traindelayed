var TrainDelayed;
(function (TrainDelayed) {
    (function (Search) {
        var Train = (function () {
            function Train(fromTiploc, toTiploc, train, tiplocs, tocs) {
                this.headcode = train.Actual.HeadCode;
                this.url = TrainDelayed.Common.serverSettings.trainLink + "/" + train.Schedule.TrainUid + "/" + moment(train.Actual.OriginDepartTimestamp).format(TrainDelayed.DateTimeFormats.dateUrlFormat);
                var origin = train.Schedule.Stops[0];
                var originTiploc = TrainDelayed.StationTiploc.findStationTiploc(origin.TiplocStanoxCode, tiplocs);
                this.originStation = originTiploc.StationName.toLowerCase();
                var dest = train.Schedule.Stops[train.Schedule.Stops.length - 1];
                var destTiploc = TrainDelayed.StationTiploc.findStationTiploc(dest.TiplocStanoxCode, tiplocs);
                this.destStation = destTiploc.StationName.toLowerCase();
                this.fromStation = fromTiploc.StationName.toLowerCase();
                this.toStation = toTiploc.StationName.toLowerCase();
            }
            return Train;
        })();
        Search.Train = Train;        
    })(TrainDelayed.Search || (TrainDelayed.Search = {}));
    var Search = TrainDelayed.Search;
})(TrainDelayed || (TrainDelayed = {}));
