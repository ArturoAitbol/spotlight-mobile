export class Constants {
    public static readonly SELECTED_SUBACCOUNT: string = 'selectedSubAccount';
    public static readonly MSAL_OPERATION: string = 'msal-operation';
    public static readonly CURRENT_REPORTS: string = 'currentReports';
    public static readonly ANDROID_PLATFORM: string = 'android';
    public static readonly NO_PERMISSION_TITLE: string = 'no-permission-title';
    public static readonly NO_PERMISSION_MESSAGE: string = 'no-permission-content';
    public static readonly FEATURE_TOGGLE: string = 'feature-toggle';
    
    // Alert messages
    public static readonly MAINTENANCE_MODE_ALERT_TITLE = "ALERT";
    public static readonly MAINTENANCE_MODE_ALERT_MESSAGE = "The Spotlight service is currently experiencing limited functionality due to ongoing maintenance. " +
        "Please note that during this maintenance period, the dashboard's daily report and adding new notes are not available. " +
        "However, users can still view the dashboard's weekly report and historical visuals related to notes.";
}
