package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Dashboard;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.Properties;

public class LoginAndroid extends AndroidActions {
    AndroidDriver driver;
    By inputSelector = By.className("android.widget.EditText");

//    @AndroidFindBy(xpath = "//android.widget.Button[@text='Next']")
    @AndroidFindBy(xpath = "//android.widget.Button[@*='Next']")
    private WebElement nextButton;
    @AndroidFindBy(xpath = "//android.widget.Button[@*='Sign in']")
    private WebElement signInButton;
    @AndroidFindBy(xpath = "//android.widget.Button[@*='No']")
    private WebElement noButton;
    public LoginAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public DashboardAndroid signIn() {
        Properties properties = readPropertyFile("test", "integration.properties");
        String username = properties.getProperty("subAccountAndroidUser");
        String password = properties.getProperty("subAccountAndroidPassword");
        sendKeys(inputSelector, username);
        clickAndroid(nextButton, 1170, 930);
        waitElements(10);
        sendKeys(inputSelector, password);
        clickAndroid(signInButton, 1170, 930);
        clickAndroid(noButton, 1170, 970);
        return new DashboardAndroid(this.driver);
    }
}
