package com.tekvizion.utils;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

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
}
