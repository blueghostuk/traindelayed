var TrainNotifier;
(function (TrainNotifier) {
    var WebApi = (function () {
        function WebApi(serverSettings) {
            this.serverSettings = serverSettings;
            if (!serverSettings) {
                this.serverSettings = TrainNotifier.Common.serverSettings;
            }
        }
        WebApi.prototype.getBaseUrl = function () {
            return "http://" + this.serverSettings.apiUrl;
        };

        WebApi.prototype.getArgs = function () {
            return {
                apiName: this.serverSettings.apiName
            };
        };

        WebApi.prototype.getTiplocs = function () {
            var stations = localStorage.getItem(WebApi.tiplocsLocalStorageKey);
            if (stations) {
                return $.Deferred().resolve(JSON.parse(stations)).promise();
            } else {
                return $.getJSON(this.getBaseUrl() + "/Stanox/", this.getArgs()).then(function (stations) {
                    localStorage.setItem(WebApi.tiplocsLocalStorageKey, JSON.stringify(stations));
                    return $.Deferred().resolve(stations).promise();
                });
            }
        };

        WebApi.prototype.getStationByLocation = function (lat, lon, limit) {
            if (typeof limit === "undefined") { limit = 5; }
            return $.getJSON(this.getBaseUrl() + "/Station/GeoLookup", $.extend({}, this.getArgs(), {
                lat: lat,
                lon: lon,
                limit: limit
            }));
        };

        WebApi.prototype.getStanoxByCrsCode = function (crsCode) {
            var self = this;
            return this.getTiplocs().then(function (stations) {
                var match = TiplocHelper.findStationTiplocByCrsCode(crsCode, stations);
                return $.Deferred().resolve(match).promise();
            });
        };

        WebApi.prototype.getDelays = function (fromCrs, toCrs, startDate, endDate) {
            var self = this;
            return $.when(this.getTiplocs(), $.getJSON(this.getBaseUrl() + "/delays/" + fromCrs + "/" + toCrs, $.extend({}, this.getArgs(), {
                startDate: startDate.format(TrainNotifier.DateTimeFormats.dateTimeApiFormat),
                endDate: endDate.format(TrainNotifier.DateTimeFormats.dateTimeApiFormat)
            }))).then(function (stations, delaysResult) {
                var delays = delaysResult[0];
                for (var i = 0; i < delays.length; i++) {
                    delays[i].Origin = TiplocHelper.findStationTiplocByStanox(delays[i].OriginStanox, stations);
                    delays[i].Dest = TiplocHelper.findStationTiplocByStanox(delays[i].DestStanox, stations);
                }
                return $.Deferred().resolve(delays).promise();
            });
        };
        WebApi.tiplocsLocalStorageKey = "tn-tiplocs";
        return WebApi;
    })();
    TrainNotifier.WebApi = WebApi;

    var TiplocHelper = (function () {
        function TiplocHelper() {
        }
        TiplocHelper.findStationTiplocsByStanox = function (stanoxCode, tiplocs) {
            var cached = TiplocHelper.tiplocByStanoxCache[stanoxCode];
            if (!cached) {
                cached = tiplocs.filter(function (element) {
                    return element.Stanox == stanoxCode;
                });
                TiplocHelper.tiplocByStanoxCache[stanoxCode] = cached;
            }
            return cached;
        };

        TiplocHelper.findStationTiplocByStanox = function (stanoxCode, tiplocs) {
            var results = TiplocHelper.findStationTiplocsByStanox(stanoxCode, tiplocs);
            if (results && results.length > 0)
                return results[0];
            return null;
        };

        TiplocHelper.stationTiplocMatches = function (tiploc, tiplocs) {
            return tiplocs.some(function (t) {
                return t.CRS == tiploc.CRS || t.Stanox == tiploc.Stanox;
            });
        };

        TiplocHelper.findStationTiplocsByCrsCode = function (crsCode, tiplocs) {
            var cached = TiplocHelper.tiplocByCrsCodeCache[crsCode];
            if (!cached) {
                cached = tiplocs.filter(function (element) {
                    return element.CRS == crsCode;
                });
                TiplocHelper.tiplocByCrsCodeCache[crsCode] = cached;
            }
            return cached;
        };

        TiplocHelper.findStationTiplocByCrsCode = function (crsCode, tiplocs) {
            var results = TiplocHelper.findStationTiplocsByCrsCode(crsCode, tiplocs);
            if (results && results.length > 0)
                return results[0];
            return null;
        };

        TiplocHelper.toDisplayString = function (tiploc, lowercase) {
            if (typeof lowercase === "undefined") { lowercase = true; }
            var value = (tiploc.StationName && tiploc.StationName.length > 0 ? tiploc.StationName : tiploc.Description && tiploc.Description.length > 0 ? tiploc.Description : tiploc.Tiploc);
            if (lowercase)
                return value.toLowerCase();
            return value;
        };
        TiplocHelper.tiplocByStanoxCache = {};
        TiplocHelper.tiplocByCrsCodeCache = {};
        return TiplocHelper;
    })();
    TrainNotifier.TiplocHelper = TiplocHelper;
})(TrainNotifier || (TrainNotifier = {}));
