package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class NotesAndroid extends AndroidActions {
    AndroidDriver driver;
    @AndroidFindBy(xpath = "//android.widget.Button[@*[contains(., 'add')]]")
    WebElement addButton;
    @AndroidFindBy(xpath = "//android.widget.Button[contains(@text,'ADD')]")
    WebElement addNote;
    @AndroidFindBy(className = "android.widget.EditText")
    WebElement noteMessageInput;
    @AndroidFindBy(xpath = "//android.widget.Button[@text='add-note-button']")
    WebElement addNoteButton;
    @AndroidFindBy(xpath = "//*[contains(@text,'test-functional-subaccount-admin:')]")
    WebElement noteMessage;
    @AndroidFindBy(xpath = "//android.widget.Button[contains(@text,'OK')]")
    WebElement okButton;
    @AndroidFindBy(xpath = "//android.widget.Button[@text='Close ']")
    WebElement closeNoteButton;
    String noteText;
    public NotesAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public String addNote(String text) {
        try {
            click(addNote);
            System.out.println("First note");
        } catch (Exception e) {
            click(addButton);
            System.out.println("There aren't notes for this user!");
            System.out.println(e.toString());
        } finally {
            noteText = addTimeStamp(text);
            sendKeys(noteMessageInput, noteText);
//            noteMessageInput.sendKeys(noteText);
//        addNoteButton.click();
        }
        return noteText;
    }

    public String verifyNote() {
        By noteTextSelector = By.xpath(String.format("//XCUIElementTypeStaticText[@name='%s']", noteText));
        try {
            return "getText(noteTextSelector)";
        } catch (Exception e) {
            System.out.println("Note wasn't found");
            System.out.println(e.toString());
            return "Error";
        }
    }

    public void closeNote(String text) {
    }
    
    public String closeNote() {
        try{
            By noteSelector = By.xpath("//android.view.View[@resource-id='items-0']");
            WebElement element = getElement(noteSelector);
            Rectangle rectangle = element.getRect();
            int x = rectangle.getWidth() - 200;
            int y = rectangle.getY() + 120;
            System.out.println(rectangle.getDimension());
            System.out.println(rectangle.getX() + " " + rectangle.getY());
            clickGesture(x, y);
            click(closeNoteButton);
            return "";
        } catch (Exception e) {
            System.out.println("New note alert was not displayed");
            System.out.println(e.toString());
            return "Error";
        }
    }
}
