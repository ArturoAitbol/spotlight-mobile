import { Observable } from "rxjs";
import { ReportType } from "src/app/helpers/report-type";

const TEST_CTAAS_DASHBOARD_DAILY_DAILY_FEATURE_FUNCTIONALITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        lastUpdatedTS: 'Wed, 14 Dec 2022 15:16:50 BOT',
        reportType: 'Daily-FeatureFunctionality',
        timestampId:'221214080042'
    }
}
const TEST_CTAAS_DASHBOARD_DAILY_CALLING_RELIABILITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        lastUpdatedTS: 'Wed, 14 Dec 2022 15:16:50 BOT',
        reportType: 'Daily-CallingReliability',
        timestampId:'221214080042'
    }
}
// const TEST_CTAAS_DASHBOARD_DAILY_PESQ = {
//     response: {
//         imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
//         lastUpdatedTS: 'Wed, 14 Dec 2022 15:16:50 BOT',
//         reportType: 'Daily-PESQ',
//         timestampId:'221214080042'
//     }
// }
const TEST_CTAAS_DASHBOARD_WEEKLY_FEATURE_FUNCTIONALITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        lastUpdatedTS: 'Wed, 14 Dec 2022 15:16:53 BOT',
        reportType: 'Weekly-FeatureFunctionality',
        timestampId:'221214090107'
    }
}
// const TEST_CTAAS_DASHBOARD_WEEKLY_PESQ = {
//     response: {
//         imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
//         lastUpdatedTS: 'Wed, 14 Dec 2022 15:16:53 BOT',
//         reportType: 'Weekly-PESQ',
//         timestampId:'221214090107'
//     }
// }

const TEST_CTAAS_DASHBOARD_ERROR = {
    error: "Cannot found the image with invalid-report in the storage blob"
}

export const CTAAS_DASHBOARD_SERVICE_MOCK = {
    ctaasDashboardWithError: TEST_CTAAS_DASHBOARD_ERROR,
    getCtaasDashboardDetails: (subaccountId: string, reportType: string) => {
        let ctaasDashboard;
        switch (reportType) {
            case ReportType.DAILY_FEATURE_FUNCTIONALITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_DAILY_FEATURE_FUNCTIONALITY;
                break;
            case ReportType.DAILY_CALLING_RELIABILITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_CALLING_RELIABILITY;
                break;
            // case ReportType.DAILY_PESQ: // disabling for now until mediastats are ready
            //     ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_PESQ;
            //     break;
            case ReportType.WEEKLY_FEATURE_FUNCTIONALITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_WEEKLY_FEATURE_FUNCTIONALITY;
                break;
            // case ReportType.WEEKLY_PESQ: // disabling for now until mediastats are ready
            //     ctaasDashboard = TEST_CTAAS_DASHBOARD_WEEKLY_PESQ;
            //     break;
            default:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_DAILY_FEATURE_FUNCTIONALITY;
            break;
        }
        return new Observable((observer)=>{
            observer.next( JSON.parse(JSON.stringify(ctaasDashboard)) );
            observer.complete();
            return {
                unsubscribe(){ }
            }
        });
    }
}