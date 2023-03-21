package com.tekvizion.testUtils;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.testng.annotations.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class AndroidBaseTest extends AppiumUtils {
    public AndroidDriver driver = null;
    public AppiumDriverLocalService service = null;

    @BeforeClass
    public void configuration() {
        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("emulator-5554");
//        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice(System.getProperty("deviceUDID"));
        androidDevice.initializeIfNeeded();
        this.driver = androidDevice.getDriver();
    }

    @BeforeSuite
    public void startAppium() throws IOException {
        Properties properties = new Properties();
        FileInputStream file = new FileInputStream(getResourcePath("main", "data.properties"));
        properties.load(file);
        String ipAddress = properties.getProperty("ipAddress");
        String port = properties.getProperty("port");
        if (service == null){
            service = startAppiumServer(ipAddress, Integer.parseInt(port));
            System.out.println("Starting Appium Server!!!");
        }
    }

    @AfterSuite
    public void tearDown(){
        this.driver.quit();
        if (this.service != null)
            this.service.stop();
    }

    @BeforeMethod
    public void setActivity(){
        if (this.driver != null){
            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
            this.driver.startActivity(activity);
        }
    }
}
