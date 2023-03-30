package com.tekvizion.utils;

import com.google.common.collect.ImmutableMap;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.*;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

public class AndroidActions {
    AndroidDriver driver;
    WebDriverWait wait;
    private final int DEFAULT_TIMEOUT = 60;
    private final int MINIMUM_TIMEOUT = 30;
    public AndroidActions(AndroidDriver driver){
        wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
        this.driver = driver;
    }

    public void waitElement(WebElement element, int seconds){
        wait = new WebDriverWait(driver, Duration.ofSeconds(seconds));
        wait.until(ExpectedConditions.visibilityOf(element));
        wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
    }

    public void click(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
        element.click();
    }
    public void clickAndroid(WebElement element, int x, int y){
        try {
            wait = new WebDriverWait(driver, Duration.ofSeconds(MINIMUM_TIMEOUT));
            wait.until(ExpectedConditions.visibilityOf(element));
            element.click();
            wait.until(ExpectedConditions.invisibilityOf(element));
        } catch (Exception e) {
            System.out.println("Error displaying button");
            System.out.println(e);
            clickGesture(x, y);
        } finally {
            wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
        }
    }
    public void click(By selector){
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
        element.click();
    }

    public void specialClick(By selector){
        new WebDriverWait(driver, Duration.ofSeconds(15))
                .ignoring(StaleElementReferenceException.class)
                .until((WebDriver d) -> {
                    d.findElement(selector).click();
                    return true;
                });
    }

    public void checkElement(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
    }
    public WebElement getElement(By selector){
        return wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
    }

    public List<WebElement> getElements(By selector){
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(selector));
    }

    public void clickGesture(int x, int y){
        ((JavascriptExecutor)driver).executeScript("mobile: clickGesture", ImmutableMap.of(
                "x", x,
                "y", y));
    }
    public String getText(WebElement element){
        String text = "";
        text = wait.until(ExpectedConditions.visibilityOf(element)).getText();
        return text;
    }

    public String getText(By selector){
        return wait.until(ExpectedConditions.visibilityOfElementLocated(selector)).getText();
    }
    public boolean accessibilityNodeInfo(WebElement element, String attribute, String expectedValue){
        boolean response = attributeToBe(element, attribute, expectedValue);
        if (!response){
            System.out.println("Testing UiAutomator2Exception: AccessibilityNodeInfo");
            checkElement(element);
        }
        return response;
    }
    public boolean attributeToBe(WebElement element, String attribute, String expectedValue){
        String currentValue = "";
        wait = new WebDriverWait(driver, Duration.ofSeconds(MINIMUM_TIMEOUT));
        Instant startTime = Instant.now();
        long timeElapsed;
        long timeOut = Long.valueOf("10");
//        long timeOut = Long.valueOf("180");
        while(!currentValue.equals(expectedValue)){
            try {
                WebElement elementClickable = wait.until(ExpectedConditions.visibilityOf(element));
                elementClickable.click();
                currentValue = elementClickable.getAttribute(attribute);
            } catch (Exception e) {
                System.out.println(e);
            }
            Instant endTime = Instant.now();
            timeElapsed = Duration.between(startTime, endTime).getSeconds();
            if(timeElapsed > timeOut) {
                System.out.println("Element couldn't be selected:" + element);
                break;
            }
        }
        wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
        return (currentValue.equals(expectedValue)) ? true :  false;
    }

    public void waitInvisibilityElement(WebElement element){
        wait.until(ExpectedConditions.invisibilityOf(element));
    }

    public void sendKeys(WebElement element, String text){
        wait.until(ExpectedConditions.visibilityOf(element));
        element.sendKeys(text);
//        wait.until(ExpectedConditions.domAttributeToBe(element,"password", "true"));
    }

    public void sendKeys(By selector, String text){
        wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
        element.sendKeys(text);
    }

    public void sendKeysSpecial(By selector, String text){
/*        final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.refreshed(
                ExpectedConditions.elementToBeClickable(selector)));
        driver.findElement(selector).sendKeys(text);*/
//        new WebDriverWait(driver, Duration.ofSeconds(10)).ignoring(StaleElementReferenceException.class).until(ExpectedConditions.elementToBeClickable(selector));
        new WebDriverWait(driver, Duration.ofSeconds(10)).ignoring(StaleElementReferenceException.class).until(ExpectedConditions.attributeToBe(selector,"password", "true"));
//        driver.findElement(selector).sendKeys(text);
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
        element.sendKeys(text);
    }

    public void waitElements(int seconds){
        try {
            Thread.sleep(seconds * 1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public String takeScreenshot(String testCaseName, AppiumDriver driver) throws IOException {
        String screenshotBase64 = driver.getScreenshotAs(OutputType.BASE64);
        String replaceBase64 = screenshotBase64.replaceAll("\n","");
        byte[] decodedImg = Base64.getDecoder()
                .decode(replaceBase64.getBytes(StandardCharsets.UTF_8));
        String imageName = testCaseName + ".jpg";
        Path destinationFile = Paths.get(getReportPath(), imageName);
        Files.write(destinationFile, decodedImg);
        return imageName;
    }

    public String getReportPath(){
        String path = System.getProperty("user.dir");
        String os = System.getProperty("os.name").toLowerCase();
        if(os.contains("win"))
            path =  path + "\\reports\\";
        else if (os.contains("nix") || os.contains("nux") || os.contains("aix") || os.contains("mac"))
            path =  path + "//reports//";
        return path;
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

    public String addTimeStamp(String text){
        String timeStamp = DriverManager.getInstance().getTimeStamp();
        return text + "-" + timeStamp;
    }
}
