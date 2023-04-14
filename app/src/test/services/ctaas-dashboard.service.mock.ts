import { Observable } from "rxjs";
import { ReportType } from "src/app/helpers/report-type";

const TEST_CTAAS_DASHBOARD_DAILY_DAILY_FEATURE_FUNCTIONALITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Daily-FeatureFunctionality',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}
const TEST_CTAAS_DASHBOARD_DAILY_CALLING_RELIABILITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Daily-CallingReliability',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}
const TEST_CTAAS_DASHBOARD_DAILY_VQ = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Daily-VQ',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}
const TEST_CTAAS_DASHBOARD_WEEKLY_FEATURE_FUNCTIONALITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Weekly-FeatureFunctionality',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}
const TEST_CTAAS_DASHBOARD_WEEKLY_CALLING_RELIABILITY = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Weekly-FeatureFunctionality',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}
const TEST_CTAAS_DASHBOARD_WEEKLY_VQ = {
    response: {
        imageBase64: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
        reportType: 'Weekly-VQ',
        startDateStr: "230411154558",
        endDateStr: "230411154558"
    }
}

const TEST_CTAAS_DASHBOARD_ERROR = {
    error: "Cannot found the image with invalid-report in the storage blob"
}

const TEST_CTAAS_HISTORICAL_DASHBOARD = {
  response: [
    {
      reportType: "Daily-FeatureFunctionality",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "230410223122",
      endDateStr: "230410223122"
    },
    {
      reportType: "Daily-CallingReliability",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "230411154558",
      endDateStr: "230411154558"
    },
    {
      reportType: "Daily-VQ",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "",
      endDateStr: "230410223148"
    },
    {
      reportType: "Weekly-FeatureFunctionality",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "",
      endDateStr: "230410223206"
    },
    {
      reportType: "Weekly-CallingReliability",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "",
      endDateStr: "230410223832"
    },
    {
      reportType: "Weekly-VQ",
      imageBase64: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
      startDateStr: "",
      endDateStr: "230410223813"
    }
  ]
}

const TEST_CTAAS_HISTORICAL_DASHBOARD_EMPTY = {
  response: []
}

export const CTAAS_DASHBOARD_SERVICE_MOCK = {
    ctaasDashboardWithError: TEST_CTAAS_DASHBOARD_ERROR,
    ctaasHistoricalDashboardEmpty: TEST_CTAAS_HISTORICAL_DASHBOARD_EMPTY,
    ctaasHistoricalDashboard: JSON.stringify(TEST_CTAAS_HISTORICAL_DASHBOARD),
    getCtaasDashboardDetails: (subaccountId: string, reportType: string) => {
        let ctaasDashboard;
        switch (reportType) {
            case ReportType.DAILY_FEATURE_FUNCTIONALITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_DAILY_FEATURE_FUNCTIONALITY;
                break;
            case ReportType.DAILY_CALLING_RELIABILITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_CALLING_RELIABILITY;
                break;
            case ReportType.DAILY_VQ: // disabling for now until mediastats are ready
                ctaasDashboard = TEST_CTAAS_DASHBOARD_DAILY_VQ;
                break;
            case ReportType.WEEKLY_FEATURE_FUNCTIONALITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_WEEKLY_FEATURE_FUNCTIONALITY;
                break;
            case ReportType.WEEKLY_CALLING_RELIABILITY:
                ctaasDashboard = TEST_CTAAS_DASHBOARD_WEEKLY_CALLING_RELIABILITY;
                break;
            case ReportType.WEEKLY_VQ: // disabling for now until mediastats are ready
                ctaasDashboard = TEST_CTAAS_DASHBOARD_WEEKLY_VQ;
                break;
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
    },
    getCtaasHistoricalDashboardDetails: (subaccountId: string, noteId: string) => {
      return new Observable((observer)=>{
          observer.next( JSON.parse(JSON.stringify(TEST_CTAAS_HISTORICAL_DASHBOARD)) );
          observer.complete();
          return {
              unsubscribe(){ }
          }
      });
  }
}
