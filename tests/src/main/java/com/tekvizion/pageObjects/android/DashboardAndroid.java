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
        waitElement(notesButton, 300);
        click(notesButton);
//        clickWait(notesButton, 300);
//        specialClick(notesButtonSelector);
        return new NotesAndroid(this.driver);
    }

}
