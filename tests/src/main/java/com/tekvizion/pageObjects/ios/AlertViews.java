package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class AlertViews extends IOSActions {
    IOSDriver driver;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`name=='Text Entry'`]")
    WebElement textEntryButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField")
    WebElement inputField;
    @iOSXCUITFindBy(accessibility = "OK")
    WebElement okButton;
    @iOSXCUITFindBy(iOSNsPredicate = "type =='XCUIElementTypeStaticText' AND label BEGINSWITH[c] 'confirm'")
    WebElement confirmMenu;
    @iOSXCUITFindBy(iOSNsPredicate = "label BEGINSWITH 'A message'")
    WebElement confirmMessage;
    @iOSXCUITFindBy(iOSNsPredicate = "label == 'Confirm'")
    WebElement confirmButton;
    public AlertViews(IOSDriver driver){
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public void fillTextEntry(String message){
        textEntryButton.click();
        inputField.sendKeys(message);
        okButton.click();
    }
    public String getConfirmMessage(){
        confirmMenu.click();
        String message = confirmMessage.getText();
        return message;
    }
}
