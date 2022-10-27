package com.tekvizion.appium.exceptions;

import org.openqa.selenium.NoSuchSessionException;

public class UnusableSessionException extends NoSuchSessionException {
    public UnusableSessionException() {
    }

    public UnusableSessionException(String reason) {
        super(reason);
    }

    public UnusableSessionException(String reason, Throwable cause) {
        super(reason, cause);
    }
}