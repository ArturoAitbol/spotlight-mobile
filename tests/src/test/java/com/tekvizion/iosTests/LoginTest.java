package com.tekvizion.iosTests;

import com.tekvizion.pageObjects.ios.Dashboard;
import com.tekvizion.pageObjects.ios.HomePage;
import com.tekvizion.pageObjects.ios.Login;
import com.tekvizion.pageObjects.ios.Notes;
import com.tekvizion.testUtils.IOSBaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.Set;

public class LoginTest extends IOSBaseTest {
    HomePage homePage;
    @Test
    public void loginSuccessfully(){
        homePage = new HomePage(driver);
        Login login = homePage.goToLoginForm();
        Dashboard dashboard = login.signIn();
        dashboard.verifyTitle();
        String title = dashboard.getHeader();
        Assert.assertEquals(title, "tekVizion");
    }

    @Test
    public void addNote() throws IOException {
        Dashboard dashboard = new Dashboard(driver);
        Notes notes = dashboard.goToNotes();
        String expectedNote = notes.addNote("note");
        String actualNote = notes.verifyNote();
        Assert.assertEquals(expectedNote, actualNote);
    }

    @Test
    public void closeNote(){
        Notes notes = new Notes(driver);
        String expectedMessage = "Note closed successfully!";
        String actualMessage = notes.closeNote("note");
        Assert.assertEquals(actualMessage, expectedMessage);
    }

}
