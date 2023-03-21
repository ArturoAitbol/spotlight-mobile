package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class Dashboard extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == 'tekVizion'`]")
    WebElement tekVizionHeader;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == 'Spotlight'`]")
    WebElement spotlightTitle;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == 'document Notes'`]")
    WebElement notesButton;
    IOSDriver driver;
    public Dashboard(IOSDriver driver){
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String getHeader(){
        String name;
        try {
            name = getAttributeValue(tekVizionHeader, "name", "tekVizion");
            return name;
        } catch (Exception e) {
            System.out.println("Allow Notifications wasn't closed previously");
            System.out.println(e.toString());
            By allowSelector = AppiumBy.iOSClassChain("**/XCUIElementTypeButton[`label == \"Allow\"`]");
            click(allowSelector);
            name = getAttributeValue(tekVizionHeader, "name", "tekVizion");
        }
        return name;
    }

    public void verifyTitle(){
        try {
            checkElement(spotlightTitle);
        } catch (Exception e) {
            System.out.println("spotlight title wasn't displayed");
            System.out.println(e.toString());
        }
    }

    public Notes goToNotes(){
        click(notesButton);
        return new Notes(this.driver);
    }
}
