package com.tekvizion.appium.android;

import com.tekvizion.appium.AutomatedMobileDevice;
import com.tekvizion.appium.Constants;
import com.tekvizion.appium.DesiredCapability;
import com.tekvizion.appium.DesiredCapabilityOption;
import com.tekvizion.appium.exceptions.UnusableSessionException;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class AutomatedAndroidDevice extends AutomatedMobileDevice implements AutoCloseable {

    private AndroidDriver androidDriver = null;

    public AutomatedAndroidDevice(String automationName,String udid) {
        super(
                automationName,
                Constants.ANDROID_PLATFORM_NAME,
                "10.0",
                udid,
                Constants.DEFAULT_APPIUM_SERVER_URL
        );

    }

    public void tearDown() {
        System.out.println("Starting tear down for serial number: " + this.getSerialNumber());
        try {
            if (this.androidDriver != null){
                this.androidDriver.quit();
            }
            this.androidDriver = null;
        }
        catch (Exception exception) {
            this.androidDriver = null;
            throw new UnusableSessionException("Unable to quit android driver session for " + this.getPlatformName() + ", SN: " + this.getSerialNumber() + ". Error caught: " + exception.getMessage());
        }
    }

    public AndroidDriver getDriver(){
        return this.androidDriver;
    }

    public void setDriver(AppiumDriver appiumDriver) {
        this.androidDriver = (AndroidDriver) appiumDriver;
    }

    public void sendKeysToElementByXpath(String keys, String xpath) {
        this.getDriver().findElement(By.xpath(xpath)).sendKeys(keys);
    }

    public boolean initializeIfNeeded() {
        boolean resp = false;
        if(this.getDriver() != null)
            return true;
        DesiredCapabilities androidDeviceDesiredCapabilities = new DesiredCapabilities();
        List<DesiredCapability> desiredCapabilitiesList = getDesiredCapabilities();
        for (DesiredCapability desiredCapability : desiredCapabilitiesList) {
            androidDeviceDesiredCapabilities.setCapability(desiredCapability.getOptionName(), desiredCapability.getValue());
        }
        try {
            System.out.println("Starting driver initialization for " + this.udid + " using system port " + this.automationPort);
            this.setDriver(new AndroidDriver(new URL(this.appiumServerURL), androidDeviceDesiredCapabilities));
            resp = true;
        } catch (MalformedURLException malformedURLException) {
            System.out.println("Problem initializing device driver, : " + malformedURLException.getMessage());
        } catch (WebDriverException wde) {
            System.out.println("Problem initializing device driver: " + wde.getMessage());
            System.out.println("Problem initializing device driver: " + wde.getAdditionalInformation());
        }
        finally {
            return resp;
        }
    }

    private List<DesiredCapability> getDesiredCapabilities() {
        List<DesiredCapability> desiredCapabilities = new ArrayList<>();
        desiredCapabilities.add(this.automationName);
        desiredCapabilities.add(this.platformName);
        desiredCapabilities.add(this.platformVersion);
        desiredCapabilities.add(this.udid);
//        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_NAME, getAppPath()));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.ANDROID_TIMEOUT, 160000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.SERVER_TIMEOUT, 150000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_PACKAGE_WAIT_TIMEOUT, 140000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.ADB_EXEC, 130000));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.NEW_COMMAND_TIMEOUT, Constants.DRIVER_SESSION_COMMAND_TIMEOUT));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.AUTO_ACCEPT_ALERTS, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.APP_WAIT, false));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.UNICODE_KEYBOARD, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.RESET_KEYBOARD, true));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.SERVER_LAUNCH_TIMEOUT, 120000));
        return desiredCapabilities;
    }

    public String getAppPath(){
        String path = System.getProperty("user.dir");
        String os = System.getProperty("os.name").toLowerCase();
        if(os.contains("win"))
            path =  path + "\\src\\test\\resources\\General-Store.apk";
        else if (os.contains("nix") || os.contains("nux") || os.contains("aix"))
            path =  path + "/src/test/resources/General-Store.apk";
        else if (os.contains("mac"))
            path =  path + "/src/test/resources/General-Store.apk";
        return path;
    }

    @Override
    public void close() throws UnusableSessionException {
        this.tearDown();
    }
}
