package com.tekvizion;

import com.tekvizion.testUtils.IOSBaseTest;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;
import org.testng.annotations.Test;

public class IOSBasics extends IOSBaseTest {
    @Test
    public void IOSBasicTest() throws InterruptedException {
        driver.findElement(AppiumBy.accessibilityId("Alert Views")).click();
//        driver.findElement(By.xpath("//XCUIElementTypeStaticText[@name='Text Entry']"));
        driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeStaticText[`name=='Text Entry'`]")).click();
//        driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeCell")).sendKeys("Hello");
        driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeTextField")).sendKeys("Hello");
        driver.findElement(AppiumBy.accessibilityId("OK")).click();

        driver.findElement(AppiumBy.iOSNsPredicateString("type =='XCUIElementTypeStaticText' AND label == 'Confirm / Cancel'")).click();
//        driver.findElement(AppiumBy.iOSNsPredicateString("type =='XCUIElementTypeStaticText' AND label BEGINSWITH[c] 'confirm'")).click();
//        driver.findElement(AppiumBy.iOSNsPredicateString("type =='XCUIElementTypeStaticText' AND label ENDSWITH 'firm / Cancel'")).click();
        String message = driver.findElement(AppiumBy.iOSNsPredicateString("label BEGINSWITH 'A message'")).getText();
        System.out.println(message);
        driver.findElement(AppiumBy.iOSNsPredicateString("label == 'Confirm'")).click();
        Thread.sleep(2000);
    }
}
