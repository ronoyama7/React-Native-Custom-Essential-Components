import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor from 'react-native-meteor';
import DeviceInfo from 'react-native-device-info';

import { dynamicSize } from '../../utils/DynamicSize';
import { CustomeInput } from '../../components/Input';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Label } from '../../components/Text';
import NavBar from '../../components/NavBar';
import ModalAlert from '../../components/ModalAlert';
import { NetInfoState } from '../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
  },
  title: {
    marginTop: 50,
    marginBottom: 25,
  },
  viewAuth: {
    top: Platform.OS === 'ios' ? null : dynamicSize(74),
    marginTop: Platform.OS === 'ios' ? 'auto' : null,
    marginBottom: Platform.OS === 'ios' ? 28 : null,
    alignItems: 'center',
  },
  viewBottom: {
    marginTop: Platform.OS === 'ios' ? 'auto' : null,
    marginBottom: Platform.OS === 'ios' ? dynamicSize(30) : null,
    alignItems: 'center',
    width,
    position: Platform.OS === 'ios' ? null : 'absolute',
    bottom: Platform.OS === 'ios' ? null : 0,
  },
  hintSignUp: {
    marginTop: dynamicSize(22),
  },
  txtForgot: {
    marginTop: dynamicSize(18),
  },
  viewSignUp: {
    flexDirection: 'row',
    paddingBottom: 40,
  },
});

class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      visibleModal: false,
      countryName: '',
      regionName: '',
      latitude: '',
      longitude: '',
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const myApiKey = 'AIzaSyDkczdey1SSWbrBMIlhDQEAaGSLu-mGWQc';
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${position.coords.latitude},${position.coords.longitude}&key=${myApiKey}`)
          .then(response => response.json())
          .then((ref) => {
            const { results } = ref;
            if (results[1] != null) {
              for (let i = 0; i < results.length; i++) {
                if (results[i].types[0] === 'locality') {
                  const city = results[i].address_components[0].long_name;
                  const state = results[i].address_components[2].long_name;
                  this.setState({
                    countryName: state,
                    regionName: city,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                }
              }
            }
          });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onFogotPwd() {
    this.props.navigation.navigate('Forgot');
  }
  onSignUp() {
    this.props.navigation.navigate('Signup');
  }
  onSignIn() {
    global.selectNumber = 0;
    Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
      if (!err) {
        Meteor.call('loggedInFrom', DeviceInfo.getDeviceId(), DeviceInfo.getUniqueID(), this.state.countryName, this.state.regionName);
        const user = Meteor.user();
        if (user && user.phoneVerification && user.phoneVerification.verified === false) {
          this.props.navigation.navigate('Verify');
        } else {
          this.props.navigation.navigate('AppStack');
        }
      } else {
        this.setState({ visibleModal: true });
      }
    });
  }
  validate() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      return false;
    }
    if (this.state.password.length < 3) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} accessible={false}>
        <View style={styles.container} >
          <NavBar />
          <KeyboardAvoidingView style={styles.viewMain} behavior="padding" enabled>
            <View style={styles.viewAuth} >
              <Label style={styles.title} title>Log In</Label>
              <CustomeInput
                placeholder="Email"
                pos={0}
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })} />
              <CustomeInput
                placeholder="Password"
                pos={2}
                secureTextEntry
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })} />
              <TouchableOpacity onPress={this.onFogotPwd.bind(this)}>
                <Label strong style={styles.txtForgot}>Forgot password?</Label>
              </TouchableOpacity>
            </View>
            <View style={styles.viewBottom}>
              <View style={styles.viewSignUp}>
                <Label>Not a member yet? </Label>
                <TouchableOpacity onPress={this.onSignUp.bind(this)}>
                  <Label strong>Register</Label>
                </TouchableOpacity>
              </View>
              <PrimaryButton text="LOG IN" onPress={this.onSignIn.bind(this)} disabled={!this.validate()} />
            </View>
          </KeyboardAvoidingView>
          <ModalAlert
            visibleModal={this.state.visibleModal}
            title="Oops"
            content="Something went wrong with your request"
            onTouch={() => this.setState({ visibleModal: false })}
          />
          <NetInfoState />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return dispatch;
}

export default Logo;
