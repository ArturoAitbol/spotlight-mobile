package com.tekvizion.testUtils;

import com.google.common.collect.ImmutableMap;
import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.Properties;

public class AndroidBaseTest extends AppiumUtils {
    public AndroidDriver driver;
    public AppiumDriverLocalService service;

    @BeforeClass
    public void configuration() throws IOException, InterruptedException {
        Properties properties = new Properties();
        FileInputStream file = new FileInputStream(getResourcePath("main", "data.properties"));
        properties.load(file);
        String ipAddress = properties.getProperty("ipAddress");
        String port = properties.getProperty("port");
        service = startAppiumServer(ipAddress, Integer.parseInt(port));
//        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice(System.getProperty("deviceUDID"));
        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("emulator-5554");
//        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice(properties.getProperty("androidDeviceName"));
        androidDevice.initializeIfNeeded();
        this.driver = androidDevice.getDriver();
//        this.driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterClass
    public void tearDown(){
        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }
}
