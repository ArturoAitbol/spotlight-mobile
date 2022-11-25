package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class HomePage extends IOSActions {
    IOSDriver driver;

    @iOSXCUITFindBy(accessibility = "Alert Views")
    WebElement alertViesButton;

    public HomePage(IOSDriver driver){
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public AlertViews goToAlertViews(){
        alertViesButton.click();
        return new AlertViews(driver);
    }
}
