package com.tekvizion.androidTests;

import com.tekvizion.pageObjects.android.*;
import com.tekvizion.testUtils.AndroidBaseTest;
import org.testng.annotations.Test;

import java.io.IOException;

public class LoginTest extends AndroidBaseTest {
    HomePageAndroid homePage;
    @Test
    public void loginSuccessfully() throws IOException {
        homePage = new HomePageAndroid(driver);
        LoginAndroid login = homePage.goToLoginForm();
        DashboardAndroid dashboard = login.signIn();
        dashboard.checkUserName();
    }

    @Test
    public void addNote() throws IOException {
        DashboardAndroid dashboard = new DashboardAndroid(driver);
        NotesAndroid notes = dashboard.goToNotes();
        String expectedNote = notes.addNote("note");
        if (expectedNote.equals("error")){
            DashboardAndroid dashboardRetry = new DashboardAndroid(driver);
            NotesAndroid notesRetry = dashboardRetry.goToNotes();
            expectedNote = notesRetry.addNote("note");
        }
//        String actualNote = notes.verifyNote();
//        Assert.assertEquals(actualNote, expectedNote);
    }

    @Test
    public void closeNote() throws IOException {
        DashboardAndroid dashboard = new DashboardAndroid(driver);
        NotesAndroid notes = dashboard.goToNotes();
        String noteStatus = notes.closeNote("note");
//        Assert.assertEquals(noteStatus, "Note closed!");
    }
}