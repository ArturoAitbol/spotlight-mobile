package com.tekvizion.appium;

public enum DesiredCapabilityOption {

    // related documentation https://appium.io/docs/en/writing-running-appium/caps/
    DEVICE_NAME("deviceName"), // The kind of mobile device or emulator to use
    AUTOMATION_NAME("automationName"), // Which automation engine to use
    PLATFORM_NAME("platformName"),
    PLATFORM_VERSION("platformVersion"),
    UDID("udid"),
    APP_ACTIVITY("appActivity"),
    NO_RESET("noReset"),
    BUNDLE_ID("bundleId"),
    XCODE_ORG("xcodeOrgId"),
    XCODE_SIGN("xcodeSigningId"),
    IOS_LOG("showIOSLog"),
    UPDATED_BUNDLE("updatedWDABundleId"),
    WDA_PORT("wdaLocalPort"),
    AUTO_ACCEPT_ALERTS("autoAcceptAlerts"),
    NEW_COMMAND_TIMEOUT("newCommandTimeout"),
    APP_PACKAGE("appPackage"),
    APP_PACKAGE_WAIT_TIMEOUT("appWaitDuration"),
    SYSTEM_PORT("systemPort"),
    NEW_WDA("useNewWDA"),
    APP_WAIT("appWaitForLaunch"),
    ANDROID_TIMEOUT("androidInstallTimeout"),
    SERVER_TIMEOUT("uiautomator2ServerInstallTimeout"),
    ADB_EXEC("adbExecTimeout"),
    APP_NAME("app");

    private final String name;

    DesiredCapabilityOption(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
