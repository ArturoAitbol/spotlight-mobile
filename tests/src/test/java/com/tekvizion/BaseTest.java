package com.tekvizion;

import com.google.common.collect.ImmutableMap;
import com.tekvizion.appium.android.AutomatedAndroidDevice;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

public class BaseTest {
    AndroidDriver driver;
    AppiumDriverLocalService service;

    @BeforeClass
    public void configuration() throws MalformedURLException, InterruptedException {
//        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("420088406aca34b1");
        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("emulator-5554");
        androidDevice.initializeIfNeeded();
        this.driver = androidDevice.getDriver();
        this.service = androidDevice.getService();
        this.driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    public double convertPriceToDouble(String amount){
        return Double.parseDouble(amount.substring(1));
    }

    @AfterClass
    public void tearDown(){
        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }
}
