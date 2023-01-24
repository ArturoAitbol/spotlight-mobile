package com.tekvizion.testUtils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

public class ExtentReporterNG {

    static ExtentReports extent;

    public static ExtentReports getReporterObject(){
        String path = System.getProperty("user.dir");
        String os = System.getProperty("os.name").toLowerCase();
        if(os.contains("win"))
            path =  path + "\\reports\\index.html";
        else if (os.contains("nix") || os.contains("nux") || os.contains("aix") || os.contains("mac"))
            path =  path + "//reports//index.html";

        ExtentSparkReporter reporter = new ExtentSparkReporter(path);
        reporter.config().setReportName("tekvizion 360 Report");
        reporter.config().setDocumentTitle("Functional Test Results");

        extent = new ExtentReports();
        extent.attachReporter(reporter);
        extent.setSystemInfo("Tester", "Arturo");
        return extent;
    }
}
