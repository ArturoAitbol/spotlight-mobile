package com.tekvizion.iosTests;

import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.testUtils.IOSBaseTest;
import org.testng.annotations.Test;

import java.util.Set;

public class LoginTest extends IOSBaseTest {
    HomePage homePage;

    @Test
    public void loginSuccessfully(){
        homePage = new HomePage(driver);
        Login login = homePage.goToLoginForm();
        login.signIn();
    }
}
