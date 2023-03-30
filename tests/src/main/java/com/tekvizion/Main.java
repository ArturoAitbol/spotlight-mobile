package com.tekvizion;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Duration;

public class Main {
    @Test
    public void simpleTest() throws IOException, InterruptedException {
        try {
            AppiumDriverLocalService service = new AppiumServiceBuilder().withAppiumJS(new File("/usr/local/lib/node_modules/appium/build/lib/main.js"))
                    .withIPAddress("127.0.0.1").usingPort(4723).withTimeout(Duration.ofSeconds(300)).build();
            System.out.println("Starting Appium!!!");
            service.start();

            /*AppiumDriverLocalService service = AppiumDriverLocalService.buildDefaultService();
            service.start();*/

            Thread.sleep(5000);
            service.stop();
        }
        catch (Exception exception){
            System.out.println("Error!!!");
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }
}