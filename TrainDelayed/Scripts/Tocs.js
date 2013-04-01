var TrainDelayed;
(function (TrainDelayed) {
    var TrainOperatingCompany = (function () {
        function TrainOperatingCompany(code, name, webLink) {
            this.code = code;
            this.name = name;
            this.webLink = webLink;
        }
        return TrainOperatingCompany;
    })();
    TrainDelayed.TrainOperatingCompany = TrainOperatingCompany;    
})(TrainDelayed || (TrainDelayed = {}));
