package com.tekvizion.utils;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class IOSActions extends MobileActions {
    IOSDriver driver;
    WebDriverWait wait;
    public IOSActions(IOSDriver driver){
//        super(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(60));
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

//    public void tapWebElement(WebElement element, int x, int y){
    public void tapWebElement(int x, int y){
        Map<String, Object> params = new HashMap<>();
//        params.put("element", ((RemoteWebElement)element).getId());
        params.put("x", x);
        params.put("y", y);
        System.out.println("Tap on: " + x + ", " + y);
        driver.executeScript("mobile: tap", params);
        System.out.println("Tap successfully!");
    }
    public void click(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
        element.click();
    }
    public boolean clickIOS(WebElement element, int x, int y){
        boolean resp = false;
        try {
//            wait = new WebDriverWait(driver, Duration.ofSeconds(MINIMUM_TIMEOUT));
            wait.until(ExpectedConditions.visibilityOf(element));
            element.click();
            wait.until(ExpectedConditions.invisibilityOf(element));
            resp = true;
        } catch (Exception e) {
            System.out.println("Error displaying button: " + element.toString());
            System.out.println(e);
            tapWebElement(x, y);
            resp = false;
        } finally {
//            wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
            return resp;
        }
    }
    public void click(By selector){
        wait.until(ExpectedConditions.visibilityOfElementLocated(selector)).click();
    }
    public void clickSpecial(WebElement element){
        WebElement newElement = wait.until(ExpectedConditions.visibilityOf(element));
        newElement.clear();
        element.click();
    }
    public void checkElement(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
    }
    public void checkElement(By selector){
        wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
    }

    public String getText(WebElement element){
        String text = "";
//        wait.until(ExpectedConditions.invisibilityOf(element));
        text = wait.until(ExpectedConditions.visibilityOf(element)).getText();
        return text;
    }

    public String getText(By selector){
        return wait.until(ExpectedConditions.visibilityOfElementLocated(selector)).getText();
    }

    public String addTimeStamp(String text){
        String timeStamp = DriverManager.getInstance().getTimeStamp();
        return text + "-" + timeStamp;
    }

    public String getAttributeValue(WebElement element, String attribute, String value){
        wait.until(ExpectedConditions.attributeContains(element, attribute, value));
        return element.getDomAttribute(attribute);
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
}
