package com.tekvizion.testUtils;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.checkerframework.checker.units.qual.C;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class IOSBaseTest extends AppiumUtils {
    public IOSDriver driver;
    public AppiumDriverLocalService service;

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
        String ipAddress = properties.getProperty("ipAddress");
        String port = properties.getProperty("port");
//        service = startAppiumServer(ipAddress, Integer.parseInt(port));

        /*AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("emulator-5554");
        androidDevice.initializeIfNeeded();
        this.driver = androidDevice.getDriver();
        */

        XCUITestOptions options = new XCUITestOptions();
        options.setDeviceName("iPhone 13 Pro");
        options.setApp(getResourcePath("test", "UIKitCatalog.app"));
        options.setPlatformVersion("15.5");
        options.setWdaLaunchTimeout(Duration.ofSeconds(60));

        this.driver = new IOSDriver(new URL("http://127.0.0.1:4723"), options);
        this.driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterClass
    public void tearDown(){
        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }
}
