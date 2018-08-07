import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor from 'react-native-meteor';

import { NumberInput } from '../../components/Input';
import { PrimaryButton } from '../../components/PrimaryButton';
import NavBar from '../../components/NavBar';
import { Label } from '../../components/Text';
import ModalAlert from '../../components/ModalAlert';
import { dynamicSize } from '../../utils/DynamicSize';
import { NetInfoState } from '../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
    paddingTop: dynamicSize(60),
    alignItems: 'center',
  },
  authView: {
    width: width - dynamicSize(40),
    top: dynamicSize(26),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewBottom: {
    width: width - dynamicSize(40),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
    position: Platform.OS === 'ios' ? null : 'absolute',
    bottom: Platform.OS === 'ios' ? null : 0,
    marginTop: 'auto',
    marginBottom: dynamicSize(30),
    alignItems: 'center',
  },
  viewTerms1: {
    flexDirection: 'row',
    marginBottom: dynamicSize(64),
  },
  viewTerms2: {
    flexDirection: 'row',
    marginBottom: 28,
  },
});

class Verify extends Component {
  constructor(props) {
    super(props);
    const timer = setInterval(() => {
      if (this.state.secRemaining <= 0) {
        clearTimeout(this.state.timer);
        this.setState({ timer: null });
        return;
      }
      this.setState({ secRemaining: this.state.secRemaining - 1 });
    }, 1000);
    this.state = {
      number1: '',
      number2: '',
      number3: '',
      number4: '',
      secRemaining: 60,
      timer,
      visibleModal: false,
    };
  }
  onSend() {
    const user = Meteor.user();
    Meteor.call('sendPhoneVerification', user.profile.phone, (err) => {
      if (err) {
        this.setState({ visibleModal: true });
      }
    });
    const timer = setInterval(() => {
      if (this.state.secRemaining <= 0) {
        clearTimeout(this.state.timer);
        this.setState({ timer: null });
        return;
      }
      this.setState({ secRemaining: this.state.secRemaining - 1 });
    }, 1000);
    this.setState({
      secRemaining: 60,
      timer,
    });
  }
  onConfirm() {
    const { number1, number2, number3, number4 } = this.state;
    const validationNumber = `${number1}${number2}${number3}${number4}`;
    Meteor.call('verifyPhone', validationNumber, (err) => {
      if (!err) {
        this.props.navigation.replace('AuthStack');
      } else {
        this.setState({ visibleModal: true });
      }
    });
  }
  render() {
    let resentMsg = 'Resend SMS';
    if (this.state.secRemaining > 0) {
      resentMsg = `${resentMsg} in ${this.state.secRemaining}s`;
    }
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} accessible={false}>
        <View style={styles.container}>
          <NavBar
            title="Register"
            back
            onBack={() => {
              Meteor.logout((err) => {
                if (!err) {
                  this.props.navigation.replace('Login');
                }
              });
          }} />
          <KeyboardAvoidingView style={styles.viewMain} behavior="padding" enabled>
            <Label title>Enter SMS code</Label>
            <View style={styles.authView}>
              <NumberInput
                ref={ref => this.number1 = ref}
                pos={0}
                value={this.state.number1}
                onChangeText={(text) => {
                  this.setState({ number1: text });
                  this.number2.focus();
                }} />
              <NumberInput
                ref={ref => this.number2 = ref}
                pos={1}
                value={this.state.number2}
                onChangeText={(text) => {
                  this.setState({ number2: text });
                  this.number3.focus();
                }} />
              <NumberInput
                ref={ref => this.number3 = ref}
                pos={1}
                value={this.state.number3}
                onChangeText={(text) => {
                  this.setState({ number3: text });
                  this.number4.focus();
                }} />
              <NumberInput
                ref={ref => this.number4 = ref}
                pos={2}
                value={this.state.number4}
                onChangeText={text => this.setState({ number4: text })} />
            </View>
            <View style={styles.viewBottom}>
              <View style={styles.viewTerms1}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={this.state.timer != null}
                  onPress={this.onSend.bind(this)}>
                  <Label>{resentMsg}</Label>
                </TouchableOpacity>
              </View>
              <PrimaryButton text="CONFIRM" onPress={this.onConfirm.bind(this)} />
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

export default Verify;
