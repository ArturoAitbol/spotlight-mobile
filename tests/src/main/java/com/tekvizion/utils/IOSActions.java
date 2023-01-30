package com.tekvizion.utils;

import com.google.common.collect.ImmutableMap;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class IOSActions extends MobileActions {
    IOSDriver driver;
    WebDriverWait wait;
    public IOSActions(IOSDriver driver){
//        super(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.driver = driver;
    }
    public void longPress(WebElement element){
        Map<String, Object> params = new HashMap<>();
        params.put("element", ((RemoteWebElement)element).getId());
        params.put("duration", 5);
        driver.executeScript("mobile: touchAndHold", params);
    }
    public void scrollWebElement(WebElement element){
        Map<String, Object> params = new HashMap<>();
        params.put("element", ((RemoteWebElement)element).getId());
        params.put("direction", "down");
        driver.executeScript("mobile: scroll",params);
    }
    public void click(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
        element.click();
    }

    public void clickSpecial(WebElement element){
        WebElement newElement = wait.until(ExpectedConditions.visibilityOf(element));
        newElement.clear();
/*        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }*/
        element.click();
    }
    
    public void checkElement(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    public String getText(WebElement element){
        String text = "";
//        wait.until(ExpectedConditions.invisibilityOf(element));
        text = wait.until(ExpectedConditions.visibilityOf(element)).getText();
        return text;
    }
}
