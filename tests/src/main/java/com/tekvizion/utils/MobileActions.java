package com.tekvizion.utils;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Duration;
import java.util.Properties;

public class MobileActions {

    WebDriverWait wait;
    AppiumDriver driver;
/*
    public MobileActions(AppiumDriver driver) {
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.driver = driver;
    }
    public void click(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
        element.click();
    }

    public void checkElement(WebElement element){
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    public String getText(WebElement element){
        String text = "";
        text = wait.until(ExpectedConditions.visibilityOf(element)).getText();
        return text;
    }*/

    public Properties readPropertyFile(String directory, String resource){
        Properties properties = new Properties();
        FileInputStream file = null;
        try {
            file = new FileInputStream(getResourcePath(directory, resource));
            properties.load(file);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return properties;
    }
    public String getResourcePath(String directory, String resource){
        String path = System.getProperty("user.dir");
        String os = System.getProperty("os.name").toLowerCase();
        if(os.contains("win"))
            path =  path + "\\src\\" + directory + "\\resources\\" + resource;
        else if (os.contains("nix") || os.contains("nux") || os.contains("aix") || os.contains("mac"))
            path =  path + "/src/" + directory + "/resources/" + resource;
        System.out.println(path);
        return path;
    }
}
