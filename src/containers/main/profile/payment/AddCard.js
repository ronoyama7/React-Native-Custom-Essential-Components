import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Meteor from 'react-native-meteor';
import stripe from 'tipsi-stripe';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import { LiteCreditCardInput } from '../../../../lib/react-native-credit-card-input';
import { dynamicSize } from '../../../../utils/DynamicSize';
import NavBar from '../../../../components/NavBar';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import ModalAlert from '../../../../components/ModalAlert';
import { NetInfoState } from '../../../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(115) - getStatusBarHeight(),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
    width: width - dynamicSize(40),
    paddingBottom: dynamicSize(8),
  },
  viewMethod: {
    marginTop: dynamicSize(32),
  },
  viewBottom: {
    position: Platform.OS === 'ios' ? null : 'absolute',
    bottom: Platform.OS === 'ios' ? null : 0,
    marginTop: 'auto',
    marginBottom: dynamicSize(26),
  },
  inputStyle: {
    color: '#EBEBEB',
  },
});

export class AddCard extends Component {
  constructor(props) {
    super(props);
    stripe.setOptions({
      publishableKey: 'pk_test_AlBaC5HL1gohmPhqYwT0gJHW',
    });
    this.state = {
      form: {},
      disableButton: false,
      visibleModal: false,
      modalContent: '',
      fadeAnim: new Animated.Value(0),
    };
  }
  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500,
      },
    ).start();
  }
  onSave() {
    const { form } = this.state;
    const user = Meteor.user();
    const params = {
      number: form.values.number,
      expMonth: Number(form.values.expiry.split('/')[0]),
      expYear: Number(form.values.expiry.split('/')[1]),
      cvc: form.values.cvc,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      currency: user.currency ? user.currency.code.toLowerCase() : 'gbp',
    };

    this.setState({ disableButton: true });
    const promise = stripe.createTokenWithCard(params);
    promise.then((token) => {
      Meteor.call(
        'addPaymentMethod',
        form.values.type,
        token,
      );
      
      this.props.navigation.navigate('AddingCard');
    }).catch((e) => {
      this.setState({ visibleModal: true });
      this.setState({ modalContent: e.message });
    });
  }

  onChange(form) {
    this.setState({ form });
  }

  validate() {
    if (!this.state.form) {
      return false;
    }
    return this.state.form.valid && !this.state.disableButton;
  }
  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} accessible={false}>
        <Animated.View style={[styles.container, style]}>
          <NavBar title="Payment" back/>
          <KeyboardAvoidingView style={styles.viewMain} behavior="padding" enabled>
            <View style={styles.viewMethod}>
              <LiteCreditCardInput
                onChange={this.onChange.bind(this)}
                inputStyle={styles.inputStyle}
              />
            </View>
            <View style={styles.viewBottom}>
              <PrimaryButton text="SAVE" disabled={!this.validate()} onPress={this.onSave.bind(this)} />
            </View>
          </KeyboardAvoidingView>
          <ModalAlert
            visibleModal={this.state.visibleModal}
            title="Oops"
            content="Something went wrong with your request"
            onTouch={() => { this.setState({ visibleModal: false }); this.setState({ disableButton: false }); }}
        />
          <NetInfoState />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
