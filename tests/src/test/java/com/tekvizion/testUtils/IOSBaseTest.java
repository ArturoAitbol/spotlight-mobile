package com.tekvizion.testUtils;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.appium.ios.AutomatedIOSDevice;
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

/*        XCUITestOptions options = new XCUITestOptions();
        options.setUdid(System.getProperty("deviceUDID"));
        options.setPlatformVersion(properties.getProperty("iosPlatformVersion"));

        options.setWdaLaunchTimeout(Duration.ofSeconds(180));
        options.setWdaStartupRetries(4);
        options.setWdaStartupRetryInterval(Duration.ofSeconds(20));*/
//        options.setForceSimulatorSoftwareKeyboardPresence(false);
//        options.setConnectHardwareKeyboard(true);

//        service = startAppiumServer(ipAddress, Integer.parseInt(port));
//        this.driver = new IOSDriver(service.getUrl(), options);

//        this.driver = new IOSDriver(new URL("http://127.0.0.1:4723"), options);

        AutomatedIOSDevice iosDevice = new AutomatedIOSDevice("9CC554AD-528D-4AB2-A519-00A86F89367D");
        iosDevice.initializeIfNeeded();
        this.driver = iosDevice.getDriver();

    }

    @AfterClass
    public void tearDown(){
        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }
}
