package com.tekvizion.pageObjects.ios;

import com.tekvizion.utils.IOSActions;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class Notes extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == \"add\"`]" )
    WebElement addButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextView[`label == \"Note message\"`]" )
    WebElement messageBox;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"web dialog\"`]/XCUIElementTypeOther[3]")
    WebElement addNoteButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == 'Close'`]")
    WebElement closeNoteButton;

    IOSDriver driver;
    String noteText;
    public Notes(IOSDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String addNote(String text) {
        click(addButton);
        clickSpecial(messageBox);
        noteText = addTimeStamp(text);
        messageBox.sendKeys(noteText);
        Rectangle rectangle = messageBox.getRect();
//        int x = rectangle.getX() + 35; //Tap "Cancel" button
        int x = rectangle.getX() + rectangle.getWidth() - 50;
        int y = rectangle.getY() + rectangle.getHeight() + 60;
        tapWebElement(x, y);
        return noteText;
    }

    public String verifyNote() {
//        By noteTextSelector = By.xpath(String.format("//XCUIElementTypeStaticText[@name='%s']", noteText));
        By noteTextSelector = AppiumBy.iOSClassChain(String.format("**/XCUIElementTypeStaticText[`label == '%s'`]", noteText));
        try {
            return getText(noteTextSelector);
        } catch (Exception e) {
            System.out.println("Note wasn't found");
            System.out.println(e.toString());
            return "Error";
        }
    }

    public String closeNote(String note) {
        noteText = addTimeStamp(note);
//        String noteTextSelector = String.format("//XCUIElementTypeStaticText[@name='%s']", noteText);
//        "**/XCUIElementTypeOther/XCUIElementTypeStaticText[`label == 'NewNoteTest'`]";
        String noteTextSelector = String.format("**/XCUIElementTypeOther[`label == 'note-label'`][$name == '%s'$]", noteText);
        By closeNoteSelector = AppiumBy.iOSClassChain(noteTextSelector + "/XCUIElementTypeOther/XCUIElementTypeImage[`label CONTAINS 'close'`]");
        try {
            click(closeNoteSelector);
            click(closeNoteButton);
            By messageSelector = AppiumBy.iOSClassChain("**/XCUIElementTypeStaticText[`label == 'Note closed successfully!'`]");
            checkElement(messageSelector);
            return "Note closed successfully!";
        } catch (Exception e) {
            System.out.println("Verify if Close Note button or Note Closed message were displayed for:" + noteText);
            System.out.println(e.toString());
            return "Error";
        }
    }
}
