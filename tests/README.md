

# Running tests
mvn test -DdeviceUDID="<some UDID>"
mvn clean package -DdeviceUDID="<some UDID>"

DeviceUDID parameter is optional and has a default value of "emulator-5554"