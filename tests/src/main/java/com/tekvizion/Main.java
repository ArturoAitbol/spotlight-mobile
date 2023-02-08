package com.tekvizion;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import org.testng.annotations.Test;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class Main {
    @Test
    public void simpleTest() throws IOException, InterruptedException {
        try {
//            AutomatedAndroidDevice mia2 = new AutomatedAndroidDevice("emulator-5554");
//            mia2.initializeIfNeeded();
//            mia2.clickElementByXpath("//android.widget.TextView[@content-desc='Messages']");
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd.HH:mm:ss");
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            String timeStamp = sdf1.format(timestamp);
            System.out.println(timeStamp);
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }
}