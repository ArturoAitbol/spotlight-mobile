package com.tekvizion.appium.ios;

import com.tekvizion.appium.AutomatedMobileDevice;
import com.tekvizion.appium.Constants;
import com.tekvizion.appium.DesiredCapability;
import com.tekvizion.appium.DesiredCapabilityOption;
import com.tekvizion.appium.exceptions.UnusableSessionException;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class AutomatedIOSDevice extends AutomatedMobileDevice implements AutoCloseable {
    private IOSDriver iosDriver;

    public AutomatedIOSDevice(String udid) {
        super(
                Constants.XCUITEST,
                Constants.IOS_PLATFORM_NAME,
                "9",
                udid,
                Constants.DEFAULT_APPIUM_SERVER_URL
        );
    }

    @Override
    public void sendKeysToElementByXpath(String keys, String xpath) {
    }

    public void tearDown() {
        System.out.println("Starting tear down for serial number: " + this.getSerialNumber());
        try {
            if (this.iosDriver != null){
                this.iosDriver.quit();
            }
            this.iosDriver = null;
        }
        catch (Exception exception) {
            this.iosDriver = null;
            throw new UnusableSessionException("Unable to quit android driver session for " + this.getPlatformName() + ", SN: " + this.getSerialNumber() + ". Error caught: " + exception.getMessage());
        }
    }

    public void setDriver(AppiumDriver appiumDriver) {
        this.iosDriver = (IOSDriver) appiumDriver;
    }
    public IOSDriver getDriver(){
        return this.iosDriver;
    }

    public boolean initializeIfNeeded() {
        if(this.getDriver() != null)
            return false;
        DesiredCapabilities androidDeviceDesiredCapabilities = new DesiredCapabilities();
        List<DesiredCapability> desiredCapabilitiesList = getDesiredCapabilities();
        for (DesiredCapability desiredCapability : desiredCapabilitiesList) {
            androidDeviceDesiredCapabilities.setCapability(desiredCapability.getOptionName(), desiredCapability.getValue());
        }
        try {
            System.out.println("Starting driver initialization for " + this.udid + " using system port " + this.automationPort);
            this.setDriver(new IOSDriver(new URL(this.appiumServerURL), androidDeviceDesiredCapabilities));
        } catch (MalformedURLException malformedURLException) {
            System.out.println("Problem initializing device driver, : " + malformedURLException.getMessage());
        } catch (WebDriverException wde) {
            System.out.println("Problem initializing device driver: " + wde.getMessage());
            System.out.println("Problem initializing device driver: " + wde.getAdditionalInformation());
        }
        return false;
    }

    private List<DesiredCapability> getDesiredCapabilities() {
        List<DesiredCapability> desiredCapabilities = new ArrayList<>();
        desiredCapabilities.add(this.automationName);
        desiredCapabilities.add(this.platformName);
        desiredCapabilities.add(this.platformVersion);
        desiredCapabilities.add(this.udid);
//        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_NAME, getAppPath()));
//        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.ANDROID_TIMEOUT, 150000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.SERVER_TIMEOUT, 150000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_PACKAGE_WAIT_TIMEOUT, 150000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.ADB_EXEC, 150000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.NEW_COMMAND_TIMEOUT, Constants.DRIVER_SESSION_COMMAND_TIMEOUT));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.AUTO_ACCEPT_ALERTS, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_WAIT, false));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.UNICODE_KEYBOARD, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.RESET_KEYBOARD, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.WDA_LAUNCH_TIME, 180000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.WDA_RETRIES, 4));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.WDA_RETRY_INTERVAL, 20));
        return desiredCapabilities;
    }

    @Override
    public void close() throws UnusableSessionException {
        this.tearDown();
    }
}
