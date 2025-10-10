import { useEffect, useState } from "react";
import { Platform, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { registerToken } from "../api/user";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const useNotifications = () => {
  const [, setReqStatus] = useState("idle");
  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data?.url;
      if (url) {
        Linking.openURL(url);
      }
    });
    return () => subscription.remove();
  }, []);

useEffect(() => {
  const listener = Notifications.addNotificationReceivedListener(notification => {
    console.log("Notifica ricevuta:", notification);
  });

  return () => listener.remove();
}, []);


  useEffect(() => {
    const sendToken = async (pT) => {
      try {
        setReqStatus("pending");
        const response = await registerToken({ devicetoken: pT });
        console.log("Token registered successfully:", response.data);
        setReqStatus("fulfilled");
      } catch (e) {
        setReqStatus("rejected");
      }
    };

    const registerForPushNotificationsAsync = async () => {
      // if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.warn("Failed to get push token for push notification!");
        return;
      }
      const tk = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Push Notification Token:", tk);
      sendToken(tk);
      //} else {
      //   console.warn("Must use physical device for Push Notifications");
      // }

      if (Platform.OS === "android") {
        console.log("Setting up Android notification channel");
        const channel = await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#ab2431",
        });
        console.log("Android Notification Channel created:", channel);
      }
    };
    registerForPushNotificationsAsync();

  }, []);
};

export default useNotifications;
