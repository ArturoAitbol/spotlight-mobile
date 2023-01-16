package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class Dashboard extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Spotlight\"`]")
    WebElement spotlightTitle;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"document Notes\"`]")
    WebElement notesButton;
    IOSDriver driver;
    public Dashboard(IOSDriver driver){
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String getTitle(){
        return getText(spotlightTitle);
    }

    public Notes goToNotes(){
        click(notesButton);
        return new Notes(this.driver);
    }
}
