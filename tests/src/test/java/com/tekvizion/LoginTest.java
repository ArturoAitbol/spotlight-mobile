package com.tekvizion;

import com.tekvizion.pageObjects.android.FormPage;
import com.tekvizion.testUtils.AndroidBaseTest;
import io.appium.java_client.android.Activity;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest extends AndroidBaseTest {
    @BeforeMethod
    public void preSetup(){
        Activity activity = new Activity("com.androidsample.generalstore", "com.androidsample.generalstore.MainActivity");
        driver.startActivity(activity);
    }

    @Test
    public void setPersonalInformation() {
        try {
            FormPage formPage = new FormPage(driver);
            formPage.fillNameField("Arturo");
            formPage.setGender("Male");
            formPage.selectCountry("Argentina");
            formPage.submitForm();
//            this.driver.findElement(By.xpath("//android.widget.TextView[@content-desc='Messages']")).click();
//            Thread.sleep(5000);
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }

/*    @Test
    public void fillForm_errorToast() {
        try {
            FormPage formPage = new FormPage(driver);
            formPage.submitForm();
            String error = formPage.getErrorToast();
            Assert.assertEquals(error, "Please enter your name");
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            exception.printStackTrace();
        }
    }*/
}