package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.Activity;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import java.io.IOException;
import java.util.List;

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
    @AndroidFindBy(xpath = "//android.widget.Button[contains(@text,'Close')]")
    WebElement closeNoteButton;
    String noteText;
    public NotesAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public String addNote(String text) throws IOException {
        try {
            clickAndroid(addNote, 720,1450);
            System.out.println("First note!");
        } catch (Exception e) {
            clickAndroid(addButton, 1250, 2060);
            System.out.println("This user had notes already!");
            System.out.println(e);
        } finally {
            takeScreenshot("0_openModal", driver);
            noteText = addTimeStamp(text);
            sendKeys(noteMessageInput, noteText);
            takeScreenshot("1_sendKeys", driver);
            clickAndroid(addNoteButton, 1160,960);
            takeScreenshot("2_clickAddNote", driver);
            waitInvisibilityElement(noteMessageInput);
            try {
                takeScreenshot("3_checkNoteCreated", driver);
                By dialogSelector = By.xpath("//*[contains(@resource-id,'ion-overlay-')]/descendant::*[@text!='']");
                List<WebElement> elements = getElements(dialogSelector);
                System.out.println("Getting dialog elements...");
                for (WebElement element: elements) {
                    System.out.println(element.getText());
                }
            } catch (Exception e) {
                System.out.println("No dialogs were displayed!");
                System.out.println(e);
            }
            waitElements(60);
        }
        return noteText;
    }

    public String verifyNote() {
        Activity activity = new Activity("com.tekvizion.spotlight", "com.tekvizion.spotlight.MainActivity");
        driver.startActivity(activity);
        By notesButtonSelector = By.xpath("//android.view.View[@resource-id='tab-button-notes']");
        click(notesButtonSelector);
        By noteTextSelector = By.xpath(String.format("//android.view.View[@text='%s']", noteText));
        try {
            String noteText = getText(noteTextSelector);
            System.out.println(noteText);
            return noteText;
        } catch (Exception e) {
            System.out.println("Note wasn't found");
            System.out.println(e.toString());
            return "Error";
        }
    }
    public String closeNote(String text) {
        try{
//            By noteTextSelector = By.xpath("//android.view.View[@resource-id='items-0']");
            noteText = addTimeStamp(text);
            By noteTextSelector = By.xpath(String.format("//android.view.View[@text='%s']", noteText));
            WebElement element = getElement(noteTextSelector);
            Rectangle rectangle = element.getRect();
            int x = rectangle.getWidth() - 25;
            int y = rectangle.getY() - 85;
            System.out.println(rectangle.getDimension());
            System.out.println(rectangle.getX() + " " + rectangle.getY());
            clickGesture(x, y);
            click(closeNoteButton);
            return "";
        } catch (Exception e) {
            System.out.println("Force close note!");
            System.out.println(e);
            clickGesture(1238, 615);
            click(closeNoteButton);
            /*try {
                click(closeNoteButton);
            } catch (Exception exception) {
                System.out.println(exception);
            }*/
            return "error";
        } finally {
//            waitElements(60);
        }
    }
}
