package com.tekvizion;

import com.tekvizion.testUtils.IOSBaseTest;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.Test;

import java.util.HashMap;
import java.util.Map;

public class IOSLongPressTest extends IOSBaseTest {
    @Test
    public void IOSBasicTest() throws InterruptedException {
        driver.findElement(AppiumBy.accessibilityId("Steppers")).click();
        WebElement plusButton = driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeButton[`label == 'Increment'`][3]"));
        /*Map<String, Object> params = new HashMap<>();
        params.put("element", ((RemoteWebElement)plusButton).getId());
        params.put("duration", 5);
        driver.executeScript("mobile: touchAndHold", params);*/
        longPress(plusButton);
        Thread.sleep(2000);
    }
}
