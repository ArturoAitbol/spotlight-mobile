package com.tekvizion;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import org.testng.annotations.Test;

import java.io.IOException;

public class Main {
/*    public static void main(String[] args) {
        try (AutomatedAndroidDevice mia2 = new AutomatedAndroidDevice("420088406aca34b1")) {
            mia2.initializeIfNeeded();
            mia2.clickElementByXpath("//android.widget.TextView[@content-desc=\"Clock\"]");
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }*/
    @Test
    public void simpleTest() throws IOException {
        AutomatedAndroidDevice mia2 = new AutomatedAndroidDevice("emulator-5554");
        mia2.initializeIfNeeded();
//        mia2.clickElementByXpath("//android.widget.TextView[@content-desc=\"Clock\"]");
        mia2.takeScreenshot();
    }
}