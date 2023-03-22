package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

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
    public LoginAndroid goToLoginForm(){
        try {
            waitElement(loginButton, 180);
            click(loginButton);
        } catch (Exception e) {
            System.out.println("Login button wasn't displayed initially!");
            System.out.println(e.toString());
            Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
            driver.startActivity(activity);
            waitElement(loginButton, 180);
            click(loginButton);
        }
        return new LoginAndroid(driver);
    }
}
