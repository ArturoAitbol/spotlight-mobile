package com.tekvizion.pageObjects.android;

import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import java.io.IOException;

public class FormPage extends AndroidActions {
    AndroidDriver driver;
    @AndroidFindBy(id = "com.androidsample.generalstore:id/nameField")
    private WebElement nameField;
//    driver.findElement(By.id("com.androidsample.generalstore:id/nameField")).sendKeys("Arturo");

    @AndroidFindBy(xpath = "//android.widget.RadioButton[@text='Female']")
    private WebElement femaleButton;
//    driver.findElement(By.xpath("//android.widget.RadioButton[@text='Female']")).click();

    @AndroidFindBy(xpath = "//android.widget.RadioButton[@text='Male']")
    private WebElement maleButton;

    @AndroidFindBy(id = "com.androidsample.generalstore:id/spinnerCountry")
    private WebElement countryDropdown;

    @AndroidFindBy(id = "com.androidsample.generalstore:id/btnLetsShop")
    private WebElement shopButton;

    public FormPage(AndroidDriver driver){
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    public void fillNameField(String name){
        nameField.sendKeys(name);
        driver.hideKeyboard();
    }

    public void setGender(String gender){
        if (gender.toLowerCase().contains("female"))
            femaleButton.click();
        else
            maleButton.click();
    }

    public void selectCountry(String countryName){
        countryDropdown.click();
        scrollToText(countryName);
        driver.findElement(By.xpath("//android.widget.TextView[@text='"+countryName+"']")).click();
    }

    public void submitForm() throws IOException {
        shopButton.click();
        takeScreenshot();
    }
}
