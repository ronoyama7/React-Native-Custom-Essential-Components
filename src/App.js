import React, { Component } from 'react';
import { View, StatusBar, YellowBox } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Meteor from 'react-native-meteor';
import firebase from 'react-native-firebase';

import TabBar from './components/Tab';

import Logo from './containers/Logo';

import Intro from './containers/auth/Intro';
import Login from './containers/auth/Login';
import { Signup } from './containers/auth/Signup';
import { Country } from './containers/auth/Country';
import { Forgot } from './containers/auth/Forgot';
import { Reset } from './containers/auth/Reset';
import Verify from './containers/main/Verify';

import Home from './containers/main/Home';

import Chat from './containers/main/chat/Chat';
import { Recommendation } from './containers/main/chat/Recommendation';
import { Summary } from './containers/main/chat/Summary';
import { Reservated } from './containers/main/chat/Reservated';
import { DocumentComponent } from './containers/main/chat/DocumentComponent';
import { CustomAgreement } from './containers/main/profile/regal/CustomAgreement';

import Profile from './containers/main/profile/Profile';
import EditProfile from './containers/main/profile/EditProfile';
import Reservations from './containers/main/profile/Reservations';
import { Reservation } from './containers/main/profile/Reservation';
import { Legal } from './containers/main/profile/regal/Legal';
import { Terms } from './containers/main/profile/regal/Terms';
import { RentalAgreement } from './containers/main/profile/regal/RentalAgreement';
import Payment from './containers/main/profile/payment/Payment';
import { Currency } from './containers/main/profile/payment/Currency';
import { AddPayment } from './containers/main/profile/payment/AddPayment';
import { AddCard } from './containers/main/profile/payment/AddCard';
import { AddingCard } from './containers/main/profile/payment/AddingCard';

const AuthStack = createStackNavigator({
  Intro,
  Login,
  Signup,
  Country,
  Reset,
  Forgot,
  Verify,
  RentalAgreement,
}, {
  initialRouteName: 'Intro',
  navigationOptions: {
    header: null,
  },
});

const ChatStack = createStackNavigator({
  Chat,
  Recommendation,
  Summary,
  AddPayment,
  AddCard,
  AddingCard,
  Reservated,
  DocumentComponent,
  CustomAgreement,
}, {
  initialRouteName: 'Chat',
  navigationOptions: {
    header: null,
  },
});

const ProfileStack = createStackNavigator({
  Profile,
  EditProfile,
  Reservations,
  Reservation,
  CustomAgreement,
  Payment,
  Legal,
  Terms,
  Country,
  Currency,
  AddPayment,
  AddCard,
  AddingCard,
}, {
  initialRouteName: 'Profile',
  navigationOptions: {
    header: null,
  },
});

const AppStack = createBottomTabNavigator({
  Home,
  ChatStack,
  ProfileStack,
}, {
  initialRouteName: 'Home',
  tabBarComponent: props => <TabBar {...props} />,
  navigationOptions: {
    header: null,
  },
});

const RootStack = createStackNavigator({
  Logo,
  AuthStack,
  Verify,
  AppStack,
}, {
  initialRouteName: 'Logo',
  navigationOptions: {
    header: null,
  },
});

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader requires main queue setup',
  'Module RNFetchBlob requires main queue setup',
]);

console.disableYellowBox = true;

// Meteor.connect('ws://localhost:3000/websocket');
Meteor.connect('ws://35.178.38.67:80/websocket');

export default class App extends Component {
  componentDidMount() {
    const firebaseMessaging = firebase.messaging();
    const firebaseNotifications = firebase.notifications();

    firebaseMessaging.hasPermission()
      .then((enabled) => {
        if (enabled) {
          // user has permissions

        } else {
          // user doesn't have permission

          firebaseMessaging.requestPermission()
            .then(() => {
              // User has authorised

            })
            .catch((error) => {
              // User has rejected permissions


            });
        }
      });
    firebaseMessaging.getToken()
      .then((token) => {
        const interval = setInterval(() => {
          if (Meteor.user()) {
            if (token) {
              Meteor.call('setFirebaseToken', token);
              clearInterval(interval);
            }
          }
        }, 1000);
      }).catch((error) => {


      });

    // onNotificationDisplayed
    this.notificationDisplayedListener = firebaseNotifications
      .onNotificationDisplayed((notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID.
        // You will have to specify this manually if you'd like to re-display the notification.
        firebaseNotifications.displayNotification(notification);
        // global.notificationFlag = true;

      });

    // onNotification
    this.notificationListener = firebaseNotifications
      .onNotification((notification) => {
        // Process your notification as required
        // global.notificationFlag = true;
        firebaseNotifications.displayNotification(notification);
      });

    // onNotificationOpened
    this.notificationOpenedListener = firebaseNotifications
      .onNotificationOpened((notificationOpen) => {



        // global.notificationFlag = true;
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;

      });

    firebaseNotifications.getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          global.notificationFlag = true;
          firebaseNotifications.removeAllDeliveredNotifications();
          // const action = notificationOpen.action;
          // const notification = notificationOpen.notification;
        }
      });
  }

  componentWillUnmount() {
    this.notificationOpenedListener();
    this.notificationDisplayedListener();
    this.notificationListener();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#6a51ae"
        />
        <RootStack />
      </View>
    );
  }
}
