package com.tekvizion.androidTests;

import com.tekvizion.pageObjects.android.*;
import com.tekvizion.testUtils.AndroidBaseTest;
import org.testng.annotations.Test;

public class LoginTest extends AndroidBaseTest {
    HomePageAndroid homePage;
    @Test
    public void loginSuccessfully() throws InterruptedException {
        homePage = new HomePageAndroid(driver);
        LoginAndroid login = homePage.goToLoginForm();
        DashboardAndroid dashboard = login.signIn();
        dashboard.checkUserName();
    }

    @Test
    public void addNote(){
        DashboardAndroid dashboard = new DashboardAndroid(driver);
        NotesAndroid notes = dashboard.goToNotes();
        String expectedNote = notes.addNote("note");
//        String actualNote = notes.verifyNote();
//        Assert.assertEquals(actualNote, expectedNote);

    }

    @Test
    public void closeNote(){
        DashboardAndroid dashboard = new DashboardAndroid(driver);
        NotesAndroid notes = dashboard.goToNotes();
        String noteText = notes.closeNote("note");
//        Assert.assertEquals("", noteText);
    }
}