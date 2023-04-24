package com.tekvizion.testUtils;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.annotations.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Properties;

public class AndroidBaseTest extends AppiumUtils {
    public AndroidDriver driver = null;
    public AppiumDriverLocalService service = null;
    protected String username;
    protected String password;

    @BeforeClass
    public void configuration() throws InterruptedException, IOException {
        boolean initialized = false;
        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("UIAutomator2","emulator-5554");
//        AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice(System.getProperty("deviceUDID"));
        initialized = androidDevice.initializeIfNeeded();
        Instant startTime = Instant.now();
        long timeElapsed;
        long timeOut = Long.valueOf("300");
        while(!initialized){
            System.out.println("Retrying initialization!!!");
//            Runtime runtime = Runtime.getRuntime();
//            runtime.exec("/Users/runner/Library/Android/sdk/platform-tools/adb -P 5037 -s emulator-5554 uninstall io.appium.uiautomator2.server.test");   Thread.sleep(10000);
            initialized = androidDevice.initializeIfNeeded();
            Instant endTime = Instant.now();
            timeElapsed = Duration.between(startTime, endTime).getSeconds();
            if(timeElapsed > timeOut) {
                System.out.println("Driver couldn't be initialized!!!:");
                break;
            }
            if (initialized) {
                this.driver = androidDevice.getDriver();
                this.driver.removeApp("io.appium.settings");
                this.driver.removeApp("io.appium.uiautomator2.server");
                this.driver.removeApp("io.appium.uiautomator2.server.test");
                this.driver.quit();
                androidDevice.setDriver(null);
                initialized = androidDevice.initializeIfNeeded();
                System.out.println("Initialized: " + initialized);
            }
            Thread.sleep(30000);
        }
        try {
            this.driver = androidDevice.getDriver();
            System.out.println("Start activity");
            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
            this.driver.startActivity(activity);
            Thread.sleep(60 * 1000);
        } catch (Exception e) {
            System.out.println("Couldn't start activity through Android driver");
            throw new RuntimeException(e);
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
