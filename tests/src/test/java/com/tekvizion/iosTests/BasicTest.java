package com.tekvizion.iosTests;

import com.tekvizion.pageObjects.ios.AlertViews;
import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.testUtils.IOSBaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class BasicTest extends IOSBaseTest {
    HomePage homePage;
    @Test
    public void fillTextEntryTest() throws InterruptedException {
        homePage = new HomePage(driver);
        AlertViews alertViews = homePage.goToAlertViews();
        alertViews.fillTextEntry("Hello");
        String actualMessage = alertViews.getConfirmMessage();
        Assert.assertEquals(actualMessage, "A message should be a short, complete sentence.");
        Thread.sleep(2000);
    }
}
