package com.tekvizion.utils;

import org.openqa.selenium.WebDriver;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class DriverManager {
    private WebDriver driver;
    private static DriverManager driverManager;
    private String message;
    private boolean activeDirectory;
    private String timeStamp;

    private DriverManager(){
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd.HH.mm.ss");
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        this.timeStamp = sdf1.format(timestamp);
    }
    public static DriverManager getInstance(){
        if (driverManager == null){
            driverManager = new DriverManager();
        }
        return driverManager;
    }

    public void setMessage(String message){
        this.message = message;
    }
    public String getMessage(){
        return this.message;
    }

    public String getTimeStamp(){
        return this.timeStamp;
    }

}