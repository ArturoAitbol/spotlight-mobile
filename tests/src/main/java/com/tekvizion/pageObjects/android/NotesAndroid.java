package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

public class NotesAndroid extends AndroidActions {
    AndroidDriver driver;
    @AndroidFindBy(xpath = "//android.widget.Button[contains(@text,'add')]")
    WebElement addButton;
    @AndroidFindBy(className = "android.widget.EditText")
    WebElement noteMessageInput;
    @AndroidFindBy(xpath = "//android.widget.Button[@text='add-note-button']")
    WebElement addNoteButton;
    @AndroidFindBy(xpath = "//*[@text='New Note!']")
//    @AndroidFindBy(xpath = "//android.view.View[(@text='New Note!') and not (contains(@resource-id,'overlay'))]")
    WebElement newNoteAlert;

    @AndroidFindBy(xpath = "//*[contains(@text,'test-functional-subaccount-admin:')]")
    WebElement noteMessage;

    @AndroidFindBy(xpath = "//android.widget.Button[contains(@text,'OK')]")
    WebElement okButton;

    public NotesAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public String addNote(String text) {
        click(addButton);
        noteMessageInput.sendKeys("newNoteTest");
        addNoteButton.click();
        try{
            checkElement(newNoteAlert);
            String rawText = noteMessage.getText();
            String[] parts = rawText.split(": ");
            String note = parts[1];
            okButton.click();
            return note;
        } catch (Exception e) {
            System.out.println("New note alert was not displayed");
            System.out.println(e.toString());
            return "Error";
        }
    }

    public void closeNote(String text) {

    }
}
