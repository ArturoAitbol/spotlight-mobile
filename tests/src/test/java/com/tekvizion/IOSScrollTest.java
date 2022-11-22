package com.tekvizion;

import com.aventstack.extentreports.App;
import com.tekvizion.testUtils.IOSBaseTest;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.testng.annotations.Test;

import java.util.HashMap;
import java.util.Map;

public class IOSScrollTest extends IOSBaseTest {
    @Test
    public void IOSBasicTest() throws InterruptedException {
        WebElement element = driver.findElement(AppiumBy.accessibilityId("Web View"));
        Map<String, Object> params = new HashMap<>();
        params.put("element", ((RemoteWebElement)element).getId());
        params.put("direction", "down");
        driver.executeScript("mobile: scroll",params);
        driver.findElement(AppiumBy.accessibilityId("Web View")).click();

        driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeButton[`label == 'UIKitCatalog'`]")).click();
        driver.findElement(AppiumBy.accessibilityId("Picket View")).click();
        Thread.sleep(2000);
    }
}
