package com.tekvizion.spotlight;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle; 
import android.os.Build;
import android.app.NotificationChannel;
import android.app.NotificationManager;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelID = "notes-notifications";
            CharSequence name = "New notes notifications";
            String description = "This channel is to notify when a new note has been created";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(channelID, name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
    
    
