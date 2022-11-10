package com.tekvizion.login;

import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import static org.testng.Assert.assertNotNull;


public class LoginTest {

    @Test
    @Parameters("deviceUDID")
    public void shouldRecognizeCustomUDID(String deviceUDID){
        System.out.println(deviceUDID);
        assertNotNull(deviceUDID);
    }
}
