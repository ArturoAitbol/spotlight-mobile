package com.tekvizion.appium;

public class DesiredCapability {

    private final DesiredCapabilityOption option;
    private final Object value;

    public DesiredCapability(DesiredCapabilityOption option, Object value) {
        this.option = option;
        this.value = value;
    }

    public String getOptionName() {
        return option.getName();
    }

    public Object getValue() {
        return value;
    }

    public String toString() {
        return "{ \"" + this.getOptionName() + "\" : \"" + this.getValue() + "\" }";
    }
}
