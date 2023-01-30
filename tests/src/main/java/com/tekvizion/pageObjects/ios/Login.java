package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import java.util.Set;

public class Login extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Sign in\"`]")
    WebElement loginHeader;
    @iOSXCUITFindBy(accessibility = "Enter your email, phone, or Skype.")
    WebElement emailInput;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeSecureTextField")
    WebElement passwordInput;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Next\"`]")
    WebElement nextButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Sign in\"`]")
    WebElement signInButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"No\"`]")
    WebElement noStaySignedIn;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"Allow\"`]")
    WebElement allowNotifications;
    @iOSXCUITFindBy(accessibility = "Ok")
    WebElement errorMessage;
    IOSDriver driver;
    public Login(IOSDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public Dashboard signIn() {
        checkElement(loginHeader);
        click(emailInput);
        emailInput.sendKeys("test-functional-subaccount-admin@tekvizion360.com");
//        emailInput.sendKeys("test-customer-subaccount-admin@tekvizionlabs.com");
        nextButton.click();
        click(passwordInput);
        passwordInput.sendKeys("Zuwo8872a");
//        passwordInput.sendKeys("Faga9645a");
        signInButton.click();
        click(noStaySignedIn);
//        click(allowNotifications);
//        click(errorMessage);
        return new Dashboard(this.driver);
    }
}
