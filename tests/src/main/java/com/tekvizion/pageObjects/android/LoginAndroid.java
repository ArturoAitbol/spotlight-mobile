package com.tekvizion.pageObjects.android;

import com.tekvizion.pageObjects.ios.Dashboard;
import com.tekvizion.utils.AndroidActions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class LoginAndroid extends AndroidActions {
    AndroidDriver driver;
    @AndroidFindBy(className = "android.widget.EditText")
    private WebElement input;
    @AndroidFindBy(xpath = "//android.widget.Button[@text='Next']")
    private WebElement nextButton;
    @AndroidFindBy(xpath = "//android.widget.Button[@text='No']")
    private WebElement noButton;
    public LoginAndroid(AndroidDriver driver) {
        super(driver);
        this.driver = driver;
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }
    public DashboardAndroid signIn() throws InterruptedException {
/*        List<WebElement> elements = driver.findElement(By.xpath("//*[contains(@class,'android.widget.EditText')]"));
        int productListSize = elements.size();
        for (int i=0; i<productListSize; i++){
            String productPrice = elements.get(i).getText();
        }*/
        String res = driver.findElement(By.xpath("//*[contains(@class,'android.widget.EditText')]")).getAttribute("clickable");
        System.out.println(res);
//        sendKeys(By.className("android.widget.EditText"), "test-functional-subaccount-admin@tekvizion360.com");

//        sendKeys(input, "test-functional-subaccount-admin@tekvizion360.com");
//        nextButton.click();
//        sendKeys(input, "Zuwo8872a");
//        nextButton.click();
        noButton.click();
        return new DashboardAndroid(this.driver);
    }
}
