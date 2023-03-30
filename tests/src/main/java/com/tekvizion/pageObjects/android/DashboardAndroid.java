package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import java.util.Set;

public class DashboardAndroid extends AndroidActions {
    AndroidDriver driver;
    @AndroidFindBy(xpath = "//android.view.View[@resource-id='service-name']")
    WebElement spotlightTitle;
    @AndroidFindBy(xpath = "//android.view.View[@resource-id='username']")
    WebElement username;
    @AndroidFindBy(xpath = "//android.view.View[@resource-id='tab-button-notes']")
    WebElement notesButton;
    By notesButtonSelector = By.xpath("//android.view.View[@resource-id='tab-button-notes']");

    public DashboardAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String getTitle(){
        return getText(spotlightTitle);
    }

    public void checkUserName(){
        waitElement(username, 300);
        checkElement(username);
    }

    public NotesAndroid goToNotes(){
//        boolean response = accessibilityNodeInfo(notesButton, "selected", "true");

        waitElement(notesButton, 300);
        click(notesButton);
//        boolean response = attributeToBe(notesButtonSelector, "selected", "true");
        boolean response = attributeToBe(notesButton, "selected", "true");

        if (!response)
            clickGesture(1000,2295);
        return new NotesAndroid(this.driver);
    }

}
