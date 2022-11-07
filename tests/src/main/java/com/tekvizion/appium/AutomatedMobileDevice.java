package com.tekvizion.appium;

public abstract class AutomatedMobileDevice {

    protected final String appiumServerURL;
    protected final DesiredCapability automationName;
    protected final DesiredCapability platformName;
    protected DesiredCapability platformVersion;
    protected final DesiredCapability udid;
    protected final int automationPort = Constants.DEFAULT_APPIUM_PORT;

    public AutomatedMobileDevice(String automationName, String platformName,
                                 String platformVersion, String serialNumber, String appiumServerUrl) {
        this.automationName = new DesiredCapability(DesiredCapabilityOption.AUTOMATION_NAME, automationName);
        this.platformName = new DesiredCapability(DesiredCapabilityOption.PLATFORM_NAME, platformName);
        this.platformVersion = new DesiredCapability(DesiredCapabilityOption.PLATFORM_VERSION, platformVersion);
        this.udid = new DesiredCapability(DesiredCapabilityOption.UDID, serialNumber);
        this.appiumServerURL = appiumServerUrl;
    }

    public String toString() {
        return "AutomatedDevice{"
                + " Serial Number: " + this.getUdid()
                + " Platform name: " + this.getPlatformName()
                + "}";
    }

    public String getUdid() {
        return this.udid.getValue().toString();
    }

    public boolean isIOS() {
        return this.platformName.getValue().equals(Constants.IOS_PLATFORM_NAME);
    }

    public boolean isAndroid() {
        return this.platformName.getValue().equals(Constants.ANDROID_PLATFORM_NAME);
    }

    public String getPlatformName() {
        return this.platformName.getValue().toString();
    }

    public String getSerialNumber() {
        return this.getUdid();
    }

    public abstract void sendKeysToElementByXpath(String keys, String xpath);
    public abstract void sendKeysToElementById(String keys, String webElementId);
    public abstract void clickElementById(String webElementId);
    public abstract void clickElementByXpath(String xpath);
    public abstract void tearDown();
    public abstract void initializeIfNeeded();
}
