// Interface
interface ITrainOperatingCompany {
    code: string;
    name: string;
    webLink: string;
}

// Module
module TrainDelayed {

    // Class
    export class TrainOperatingCompany implements ITrainOperatingCompany {
        // Constructor
        constructor(public code: string, public name: string, public webLink?:string) { }

    }

}