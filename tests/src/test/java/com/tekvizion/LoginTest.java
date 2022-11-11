package com.tekvizion;

import com.tekvizion.appium.android.AutomatedAndroidDevice;
import com.tekvizion.pageObjects.android.FormPage;
import org.openqa.selenium.By;
import org.testng.annotations.Test;

import java.io.IOException;

public class LoginTest extends BaseTest {
    @Test
    public void setPersonalInformation() {
        try {
            FormPage formPage = new FormPage(driver);
            formPage.fillNameField("Arturo");
            formPage.setGender("Male");
            formPage.selectCountry("Argentina");
            formPage.submitForm();
//            this.driver.findElement(By.xpath("//android.widget.TextView[@content-desc='Messages']")).click();
            Thread.sleep(5000);
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }
}