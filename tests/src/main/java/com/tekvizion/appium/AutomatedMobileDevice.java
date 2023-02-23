package com.tekvizion.appium;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public abstract class AutomatedMobileDevice {

    protected final String appiumServerURL;
    protected final DesiredCapability automationName;
    protected final DesiredCapability platformName;
    protected DesiredCapability platformVersion;
    protected final DesiredCapability udid;
    protected final int automationPort = Constants.DEFAULT_APPIUM_PORT;

    public AutomatedMobileDevice(String automationName, String platformName, String platformVersion, String serialNumber, String appiumServerUrl) {
        this.automationName = new DesiredCapability(DesiredCapabilityOption.AUTOMATION_NAME, automationName);
        this.platformName = new DesiredCapability(DesiredCapabilityOption.PLATFORM_NAME, platformName);
        Properties properties = new Properties();
        FileInputStream file = null;
        try {
            file = new FileInputStream(getResourcePath("main", "data.properties"));
            properties.load(file);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        String ipAddress = properties.getProperty("ipAddress");
        String port = properties.getProperty("port");
        this.platformVersion = new DesiredCapability(DesiredCapabilityOption.PLATFORM_VERSION, properties.getProperty("iosPlatformVersion"));
        this.udid = new DesiredCapability(DesiredCapabilityOption.UDID, serialNumber);
//        this.udid = new DesiredCapability(DesiredCapabilityOption.UDID, System.getProperty("deviceUDID"));
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

    public abstract void tearDown();
    public abstract void initializeIfNeeded();
    public String getResourcePath(String directory, String resource){
        String path = System.getProperty("user.dir");
        String os = System.getProperty("os.name").toLowerCase();
        if(os.contains("win"))
            path =  path + "\\src\\" + directory + "\\resources\\" + resource;
        else if (os.contains("nix") || os.contains("nux") || os.contains("aix") || os.contains("mac"))
            path =  path + "/src/" + directory + "/resources/" + resource;
        return path;
    }
}
