package com.tekvizion.testUtils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.tekvizion.utils.AppiumUtils;
import io.appium.java_client.AppiumDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class Listeners extends AppiumUtils implements ITestListener {
    ExtentReports extent = ExtentReporterNG.getReporterObject();
    ExtentTest extentTest;
    AppiumDriver driver;
    @Override
    public void onTestStart(ITestResult iTestResult) {
        extentTest = extent.createTest(iTestResult.getMethod().getMethodName());
    }

    @Override
    public void onTestSuccess(ITestResult iTestResult) {
        extentTest.log(Status.PASS, "Test Passed!");
    }

    @Override
    public void onTestFailure(ITestResult iTestResult) {
        //Screenshot
        extentTest.fail(iTestResult.getThrowable());
        try {
            driver = (AppiumDriver) iTestResult.getTestClass().getRealClass().getField("driver").
                        get(iTestResult.getInstance());
            extentTest.addScreenCaptureFromPath(takeScreenshot(iTestResult.getMethod().getMethodName(), driver), iTestResult.getMethod().getMethodName());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onTestSkipped(ITestResult iTestResult) {

    }

    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult iTestResult) {

    }

    @Override
    public void onStart(ITestContext iTestContext) {

    }

    @Override
    public void onFinish(ITestContext iTestContext) {
        extent.flush();
    }
}
