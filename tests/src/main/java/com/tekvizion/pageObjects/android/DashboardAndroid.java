package com.tekvizion.pageObjects.android;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import java.io.IOException;
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

    public NotesAndroid goToNotes() throws IOException {
//        boolean response = accessibilityNodeInfo(notesButton, "selected", "true");
        try {
            waitElement(notesButton, 300);
        } catch (Exception e) {
            //NoSuchDriverException
            System.out.println("No such driver!");
            System.out.println(e);
            this.driver.terminateApp("com.tekvizion.spotlight");
            Runtime runtime = Runtime.getRuntime();
            runtime.exec("/Users/runner/Library/Android/sdk/platform-tools/adb -P 5037 -s emulator-5554 shell pm clear com.tekvizion.spotlight");
            this.driver.quit();
            AutomatedAndroidDevice androidDevice = new AutomatedAndroidDevice("UIAutomator2","emulator-5554");
            boolean initialized = androidDevice.initializeIfNeeded();
            if (!initialized)
                initialized = androidDevice.initializeIfNeeded();
            if (initialized){
                this.driver = androidDevice.getDriver();
                this.driver.removeApp("io.appium.settings");
                this.driver.removeApp("io.appium.uiautomator2.server");
                this.driver.removeApp("io.appium.uiautomator2.server.test");
                this.driver.quit();
                androidDevice.setDriver(null);
                initialized = androidDevice.initializeIfNeeded();
                this.driver = androidDevice.getDriver();
                System.out.println("Initialized: " + initialized);
            }
            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
            driver.startActivity(activity);
            waitElement(notesButton, 300);
        }
        click(notesButton);
//        boolean response = attributeToBe(notesButtonSelector, "selected", "true");
        boolean response = attributeToBe(notesButton, "selected", "true");
        if (!response)
            clickGesture(1000,2295);
        return new NotesAndroid(this.driver);
    }

}
