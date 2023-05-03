package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.time.Duration;

public class HomePageAndroid extends AndroidActions {
    AndroidDriver driver;

//    @AndroidFindBy(xpath = "//android.widget.Button[@text='login-button']")
//    @AndroidFindBy(xpath = "//android.widget.Button[(@content-desc='login-button') or (@text='login-button')]")
    @AndroidFindBy(xpath = "//android.widget.Button[@*='login-button']")
    private WebElement loginButton;

    public HomePageAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public LoginAndroid goToLoginForm() throws IOException {
        try {
            waitElement(loginButton, 180);
            takeScreenshot("0_loginPage", driver);
            clickOnLoginButton();
        } catch (Exception e) {
            System.out.println("Login button wasn't displayed initially!");
            System.out.println(e);
            restartApp();
            waitElement(loginButton, 180);
            clickOnLoginButton();
        }
        try {
            By inputSelector = By.className("android.widget.EditText");
            getElement(inputSelector);
            takeScreenshot("01_insertUsername", driver);
        } catch (Exception e) {
            takeScreenshot("02_blankView", driver);
            System.out.println("Blank view after clicking on login button!");
            System.out.println(e);
            restartApp();
            waitElements(10);
            waitElement(loginButton, 180);
            clickOnLoginButton();
        }
        return new LoginAndroid(driver);
    }

    public void restartApp(){
        try {
            this.driver.terminateApp("com.tekvizion.spotlight");
//            Runtime runtime = Runtime.getRuntime();
//            runtime.exec("/Users/runner/Library/Android/sdk/platform-tools/adb -P 5037 -s emulator-5554 shell pm clear com.tekvizion.spotlight");
            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
            driver.startActivity(activity);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void clickOnLoginButton(){
        boolean resp = clickAndroid(loginButton, 195, 434);
        if (!resp) {
            System.out.println("Couldn't click on login-button at the first try!");
            waitElements(10);
//            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
//            driver.startActivity(activity);
        } else
            System.out.println("Click on login button: " + resp);
    }
}
