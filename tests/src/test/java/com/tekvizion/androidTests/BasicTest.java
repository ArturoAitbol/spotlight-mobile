package com.tekvizion.androidTests;

import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.testUtils.AndroidBaseTest;
import com.tekvizion.testUtils.IOSBaseTest;
import org.testng.annotations.Test;

public class BasicTest extends AndroidBaseTest {
    HomePage homePage;
    @Test
    public void preConfigureEmulator() throws InterruptedException {
        System.out.printf("Pre test completed!!! \n");
        Thread.sleep(2000);
    }
}
