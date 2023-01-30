package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class Notes extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"add\"`]" )
    WebElement addButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextView[`label == \"Note message\"`]" )
    WebElement messageBox;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Note message\"`]")
    WebElement notesTitle;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"web dialog\"`]")
    WebElement notesWindow;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"web dialog\"`]/XCUIElementTypeOther[3]")
    WebElement addNoteButton;

    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"NewNoteTest\"`]" )
    WebElement noteText;
    IOSDriver driver;
    public Notes(IOSDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String addNote(String text) {
        click(addButton);
        clickSpecial(messageBox);
        messageBox.sendKeys(text);
//        notesView.click();
//        driver.hideKeyboard();

        /*scrollWebElement(messageBox);
        scrollWebElement(notesWindow);
        addNoteButton.click();*/
//        return getText(noteText);
        return "";
    }
}
