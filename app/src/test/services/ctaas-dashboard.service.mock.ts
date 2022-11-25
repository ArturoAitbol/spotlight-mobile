import { Observable } from "rxjs";

const TEST_CTAAS_DASHBOARD = {
    response: {
        imageBase64: 'imageBase64',
        lastUpdatedTS: 'Thu, 24 Nov 2022 11:03:35 BOT'
    }
}

const TEST_CTAAS_DASHBOARD_ERROR = {
    error: "Cannot found the image with invalid-report in the storage blob"
}

export const CTAAS_DASHBOARD_SERVICE_MOCK = {
    ctaasDashboardWithError: TEST_CTAAS_DASHBOARD_ERROR,
    getCtaasDashboardDetails: (subaccountId: string, reportType: string) => {
        return new Observable((observer)=>{
            observer.next( JSON.parse(JSON.stringify(TEST_CTAAS_DASHBOARD)) );
            observer.complete();
            return {
                unsubscribe(){ }
            }
        });
    }
}