package com.tekvizion;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import org.testng.annotations.Test;

import java.io.IOException;

public class Main {
    @Test
    public void simpleTest() throws IOException, InterruptedException {
        try {
            AutomatedAndroidDevice mia2 = new AutomatedAndroidDevice("emulator-5554");
            mia2.initializeIfNeeded();
//            mia2.clickElementByXpath("//android.widget.TextView[@content-desc='Messages']");
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }
}