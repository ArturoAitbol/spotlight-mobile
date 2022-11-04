package com.tekvizion.appium.android;

import com.tekvizion.appium.AutomatedMobileDevice;
import com.tekvizion.appium.Constants;
import com.tekvizion.appium.DesiredCapability;
import com.tekvizion.appium.DesiredCapabilityOption;
import com.tekvizion.appium.exceptions.UnusableSessionException;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class AutomatedAndroidDevice extends AutomatedMobileDevice implements AutoCloseable {

    private AndroidDriver androidDriver;
    AppiumDriverLocalService service;

    public AutomatedAndroidDevice(String udid) {
        super(
                Constants.UI_AUTOMATOR_2,
                Constants.ANDROID_PLATFORM_NAME,
                "",
                udid,
                Constants.DEFAULT_APPIUM_SERVER_URL
        );
    }

    public void tearDown() {
        System.out.println("Starting tear down for serial number: " + this.getSerialNumber());
        try {
            if (this.androidDriver != null)
                this.androidDriver.quit();
            if (this.service != null)
                this.service.stop();
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

    public void clickElementById(String webElementId) {
        this.getDriver().findElement(By.id(webElementId)).click();
    }

    public void clickElementByXpath(String xpath) {
        this.getDriver().findElement(By.xpath(xpath)).click();
    }

    public void sendKeysToElementById(String keys, String webElementId) {
        this.getDriver().findElement(By.id(webElementId)).sendKeys(keys);
    }

    public void sendKeysToElementByXpath(String keys, String xpath) {
        this.getDriver().findElement(By.xpath(xpath)).sendKeys(keys);
    }

    public void takeScreenshot() throws IOException {
        String screenshotBase64 = this.getDriver().getScreenshotAs(OutputType.BASE64);
        String replaceBase64 = screenshotBase64.replaceAll("\n","");
        byte[] decodedImg = Base64.getDecoder()
                .decode(replaceBase64.getBytes(StandardCharsets.UTF_8));
        Path destinationFile = Paths.get(System.getProperty("user.dir"), "myImage.jpg");
        Files.write(destinationFile, decodedImg);
    }

    public void initializeIfNeeded() {
        if(this.getDriver() != null)
            return;
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("nix") || os.contains("nux") || os.contains("aix") || os.contains("mac")){
            this.service = new AppiumServiceBuilder().withAppiumJS(new File("/usr/local/lib/node_modules/appium/build/lib/main.js"))
                    .withIPAddress("127.0.0.1").usingPort(4723).build();
            this.service.start();
        }
        DesiredCapabilities androidDeviceDesiredCapabilities = new DesiredCapabilities();
        List<DesiredCapability> desiredCapabilitiesList = getDesiredCapabilities();
        for (DesiredCapability desiredCapability : desiredCapabilitiesList) {
            androidDeviceDesiredCapabilities.setCapability(desiredCapability.getOptionName(), desiredCapability.getValue());
        }
        try {
            System.out.println("Starting driver initialization for " + this.udid + " using system port " + this.automationPort);
            this.setDriver(new AndroidDriver(new URL(this.appiumServerURL), androidDeviceDesiredCapabilities));
        } catch (MalformedURLException malformedURLException) {
            System.out.println("Problem initializing device driver, : " + malformedURLException.getMessage());
        } catch (WebDriverException wde) {
            System.out.println("Problem initializing device driver: " + wde.getMessage());
            System.out.println("Problem initializing device driver: " + wde.getAdditionalInformation());
        }
    }

    private List<DesiredCapability> getDesiredCapabilities() {
        List<DesiredCapability> desiredCapabilities = new ArrayList<>();
        desiredCapabilities.add(this.automationName);
        desiredCapabilities.add(this.platformName);
        desiredCapabilities.add(this.platformVersion);
        desiredCapabilities.add(this.udid);
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.NEW_COMMAND_TIMEOUT, Constants.DRIVER_SESSION_COMMAND_TIMEOUT));
        desiredCapabilities.add(new DesiredCapability(DesiredCapabilityOption.AUTO_ACCEPT_ALERTS, true));
        return desiredCapabilities;
    }

    @Override
    public void close() throws UnusableSessionException {
        this.tearDown();
    }
}
