import { Observable } from "rxjs"

const TEST_CTAASSETUP = {
    ctaasSetups: {
        tapUrl:"https://tekvizion-ap-spotlight-dan-env-01.eastus2.cloudapp.azure.com:8443/onPOINT",
        subaccountId:"2c8e386b-d1bd-48b3-b73a-12bfa5d00805",
        onBoardingComplete:true,
        azureResourceGroup:"az_tap_rg",
        id:"c079c3a9-66c7-424f-aa1b-fdc2565d617a",
        maintenance:true,
        status:"SETUP_READY"
    }
}


export const CTAASSETUP_SERVICE_MOCK = {

    getSubaccountCtaasSetupDetails:(subaccountId:string)=>{
        return new Observable((observer)=>{
            observer.next( JSON.parse(JSON.stringify(TEST_CTAASSETUP)) );
            observer.complete();
            return {
                unsubscribe(){ }
            }
        });
    }
}