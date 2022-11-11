package com.tekvizion.utils;

import com.google.common.collect.ImmutableMap;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class AndroidActions {
    AndroidDriver driver;
    public AndroidActions(AndroidDriver driver){
        this.driver = driver;
    }

    public void longPress(WebElement element){
        ((JavascriptExecutor)driver).executeScript("mobile: longClickGesture", ImmutableMap.of(
                "elementId", ((RemoteWebElement)element).getId(),
                "duration", 2000));
    }

    public void scrollWebElement(WebElement element){
//        WebElement webView = driver.findElement(AppiumBy.accessibilityId("WebView"));
        ((JavascriptExecutor) driver).executeScript("mobile: scrollGesture", ImmutableMap.of(
                "elementId", ((RemoteWebElement) element).getId(),
                "direction", "down",
                "percent", 3.0
        ));
    }

    public void scrollToEnd(){
        boolean canScrollMore;
        do{
            canScrollMore = (Boolean) ((JavascriptExecutor) driver).executeScript("mobile: scrollGesture", ImmutableMap.of(
                    "left", 100, "top", 100, "width", 200, "height", 200,
                    "direction", "down",
                    "percent", 3.0
            ));
        } while(canScrollMore);
    }

    public void scrollABit(){
        ((JavascriptExecutor) driver).executeScript("mobile: scrollGesture", ImmutableMap.of(
                "left", 100, "top", 100, "width", 200, "height", 200,
                "direction", "down",
                "percent", 3.0
        ));
    }

    public void scrollToText(String text){
        driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\"" + text + "\"))"));
    }

    public void swipeAction(WebElement element, String direction){
        ((JavascriptExecutor) driver).executeScript("mobile: swipeGesture", ImmutableMap.of(
                "elementId", ((RemoteWebElement)element).getId(),
                "direction", direction,
                "percent", 0.75
        ));
    }

    public void takeScreenshot() throws IOException {
        String screenshotBase64 = driver.getScreenshotAs(OutputType.BASE64);
        String replaceBase64 = screenshotBase64.replaceAll("\n","");
        byte[] decodedImg = Base64.getDecoder()
                .decode(replaceBase64.getBytes(StandardCharsets.UTF_8));
        Path destinationFile = Paths.get(System.getProperty("user.dir"), "myImage.jpg");
        Files.write(destinationFile, decodedImg);
    }
}
