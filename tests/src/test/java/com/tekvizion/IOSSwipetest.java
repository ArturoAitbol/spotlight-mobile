package com.tekvizion;

import com.tekvizion.testUtils.IOSBaseTest;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IOSSwipetest extends IOSBaseTest {
    @Test
    public void IOSBasicTest() throws InterruptedException {
        Map<String, String> params = new HashMap<>();
        params.put("bundleId", "com.apple.mobileslideshow");
        driver.executeScript("mobile: launchApp", params);
        driver.findElement(AppiumBy.iOSNsPredicateString("label == 'All Photos'")).click();
        List<WebElement> allPhotos = driver.findElements(AppiumBy.iOSClassChain("**/XCUIElementTypeCell"));
        System.out.println(allPhotos.size());
        driver.findElement(AppiumBy.iOSNsPredicateString("label == 'Albums'")).click();
        Thread.sleep(2000);
    }
}
