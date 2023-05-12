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

import java.io.IOException;

public class Notes extends IOSActions {
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == 'add'`]" )
    WebElement addButton;
    @iOSXCUITFindBy(accessibility = "Add a note" )
//    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == 'Add a note'`]" )
    WebElement addNoteButton;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextView[`label == 'Note message'`]" )
    WebElement messageBox;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == 'web dialog'`]/XCUIElementTypeOther[3]")
    WebElement addNote;
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`label == 'Close'`]")
    WebElement closeNoteButton;

    IOSDriver driver;
    String noteText = "";
    public Notes(IOSDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public String addNote(String text) throws IOException {
        boolean firstNote;
        firstNote = clickIOS(addNoteButton, 195,505);
        if (firstNote)
            System.out.println("First note!");
        else {
            clickIOS(addButton, 337, 720);
            System.out.println("This user had notes already!");
        }
        takeScreenshot("1.1_openModal", driver);
        clickSpecial(messageBox);
        noteText = addTimeStamp(text);
        messageBox.sendKeys(noteText);
        Rectangle rectangle = messageBox.getRect();
        int x = rectangle.getX() + rectangle.getWidth() - 50;
        int y = rectangle.getY() + rectangle.getHeight() + 60;
        takeScreenshot("1.2_sendKeys", driver);
        tapWebElement(x, y);
        takeScreenshot("1.3_clickAddNote", driver);
        return noteText;
    }

    public String verifyNote() {
//        By noteTextSelector = By.xpath(String.format("//XCUIElementTypeStaticText[@name='%s']", noteText));
        By noteTextSelector = AppiumBy.iOSClassChain(String.format("**/XCUIElementTypeStaticText[`label == '%s'`]", noteText));
        try {
            return getText(noteTextSelector);
        } catch (Exception e) {
            System.out.println("Note wasn't found");
            System.out.println(e);
            return "Error";
        }
    }

    public String closeNote(String note) {
        noteText = addTimeStamp(note);
        String noteTextSelector = String.format("**/XCUIElementTypeOther[`label == 'note-label'`][$name == '%s'$]", noteText); //Get grandparent which descendant has that name
        By closeNoteSelector = AppiumBy.iOSClassChain(noteTextSelector + "/XCUIElementTypeOther/XCUIElementTypeImage[`label CONTAINS 'close'`]"); //Get grandchild with that predicate string
        try {
            click(closeNoteSelector);
            click(closeNoteButton);
            By messageSelector = AppiumBy.iOSClassChain("**/XCUIElementTypeStaticText[`label == 'Note closed successfully!'`]");
//            checkElement(messageSelector);
            return getText(messageSelector);
        } catch (Exception e) {
            System.out.println("Verify if Close Note button or Note Closed message were displayed for:" + noteText);
            System.out.println(e);
            return "Error";
        }
    }
}
