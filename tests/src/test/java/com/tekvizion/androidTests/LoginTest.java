package com.tekvizion.androidTests;

import com.tekvizion.pageObjects.android.*;
import com.tekvizion.pageObjects.ios.Dashboard;
import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.testUtils.AndroidBaseTest;
import io.appium.java_client.android.Activity;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest extends AndroidBaseTest {
    HomePageAndroid homePage;

    @Test
    public void loginSuccessfully() throws InterruptedException {
        homePage = new HomePageAndroid(driver);
        LoginAndroid login = homePage.goToLoginForm();
        DashboardAndroid dashboard = login.signIn();
        String title = dashboard.getTitle();
        Assert.assertEquals(title, "Spotlight");
    }

    @Test
    public void newNote(){
        DashboardAndroid dashboard = new DashboardAndroid(driver);
        NotesAndroid notes = dashboard.goToNotes();
        String noteText = notes.addNote("NewNoteTest");
        Assert.assertEquals("newNoteTest", noteText);
        notes.closeNote("text");
    }
}