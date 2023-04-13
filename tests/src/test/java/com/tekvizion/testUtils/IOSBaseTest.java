package com.tekvizion.testUtils;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.appium.ios.AutomatedIOSDevice;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.checkerframework.checker.units.qual.C;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeSuite;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class IOSBaseTest extends AppiumUtils {
    public IOSDriver driver = null;
    public AppiumDriverLocalService service;
    protected String username;
    protected String password;

    public void longPress(WebElement element){
        Map<String, Object> params = new HashMap<>();
        params.put("element", ((RemoteWebElement)element).getId());
        params.put("duration", 5);
        driver.executeScript("mobile: touchAndHold", params);
    }

    @BeforeClass
    public void configuration() throws IOException, InterruptedException {
        Properties properties = new Properties();
        FileInputStream file = new FileInputStream(getResourcePath("main", "data.properties"));
        properties.load(file);

        XCUITestOptions options = new XCUITestOptions();
        options.setUdid(System.getProperty("deviceUDID"));
        options.setPlatformVersion(properties.getProperty("iosPlatformVersion"));
        options.setWdaLaunchTimeout(Duration.ofSeconds(180));
        options.setWdaStartupRetries(4);
        options.setWdaStartupRetryInterval(Duration.ofSeconds(20));
        try {
            this.driver = new IOSDriver(new URL("http://127.0.0.1:4723"), options);
        } catch (Exception e) {
            System.out.println("IOS Driver couldn't be initialized!");
            System.out.println(e);
            if (this.driver == null)
                System.out.println("IOS Driver is null");
            //while(this.driver==null && timeOut<30m)-> this.driver=new IOSdriver()
            this.driver = new IOSDriver(new URL("http://127.0.0.1:4723"), options);
        }
    }
    @BeforeSuite
    public void startAppium() throws IOException {
        Properties properties = readPropertyFile("main", "data.properties");
        String ipAddress = properties.getProperty("ipAddress");
        String port = properties.getProperty("port");
        if (service == null){
            System.out.println("Starting Appium Server!!!");
            service = startAppiumServer(ipAddress, Integer.parseInt(port));
        }
        properties = readPropertyFile("test", "integration.properties");
        username = properties.getProperty("subAccountIosUser");
        System.out.println("Username: " + username);
        password = properties.getProperty("subAccountIosPassword");
        System.out.println("Password: " + password);
    }
    @AfterClass
    public void closeDriver(){
        this.driver.quit();
    }
    @AfterSuite
    public void tearDown(){
//        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }
}
