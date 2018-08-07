import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor, { Accounts } from 'react-native-meteor';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

import { CustomeInput } from '../../components/Input';
import { PhoneInput, replaceCountryCode } from '../../components/PhoneInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import NavBar from '../../components/NavBar';
import { Label } from '../../components/Text';
import ModalAlert from '../../components/ModalAlert';
import { NetInfoState } from '../../components/NetInfoState';

import { dynamicSize } from '../../utils/DynamicSize';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
  },
  authView: {
    width: width - dynamicSize(40),
    left: dynamicSize(20),
    right: dynamicSize(20),
    top: dynamicSize(26),
    alignItems: 'center',
  },
  viewBottom: {
    position: 'absolute',
    bottom: 0,
    width: width - dynamicSize(40),
    left: dynamicSize(20),
    right: dynamicSize(20),
    alignItems: 'center',
  },
  viewTerms1: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  viewTerms2: {
    flexDirection: 'row',
    marginBottom: 28,
  },
});

export class Signup extends Component {
  static propTypes = {
    country: PropTypes.shape({
      dialCode: PropTypes.string,
      iso2: PropTypes.string,
    }),
  }
  static defaultProps = {
    country: {
      dialCode: '+1',
      iso2: 'us',
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '+1',
      email: '',
      password: '',
      visibleModal: false,
      waringTitle: '',
      waringContent: '',
      selectedCountry: {
        dialCode: '1',
        format: '+. (...) ...-....',
        iso2: 'us',
        key: 222,
        name: 'United States',
        priority: 0,
      },
    };
  }

  onAgreement() {
    this.props.navigation.navigate('RentalAgreement');
  }

  onSignUp() {
    const { email, password, phoneNumber, firstName, lastName } = this.state;

    const deviceUid = DeviceInfo.getUniqueID();
    const deviceName = DeviceInfo.getDeviceId();

    const options = {
      email,
      password,
      phoneNumber,
      deviceName,
      deviceUid,
      profile: {
        firstName,
        lastName,
      },
    };
    Accounts.createUser(options, (err) => {
      if (err) {
        this.setState({ visibleModal: true });
        this.setState({ waringTitle: 'Oops' });
        this.setState({ waringContent: 'Something went wrong with your request' });
      } else {
        Meteor.loginWithPassword(email, password, (err) => {
          if (!err) {
            this.props.navigation.navigate('Verify');
          } else {
            this.setState({ visibleModal: true });
            this.setState({ waringTitle: 'Oops' });
            this.setState({ waringContent: 'Somethings are fail while log in' });
          }
        });
      }
    });
  }
  onSelectCountry(selectedCountry) {
    const oldCountry = this.state.selectedCountry;
    const oldphoneNumber = this.state.phoneNumber;
    const phoneNumber = replaceCountryCode(oldCountry, selectedCountry, oldphoneNumber);
    this.setState({ selectedCountry, phoneNumber });
    this.props.navigation.pop();
  }
  render() {
    const params = { selectedCountry: 'us' };
    if (this.props.country) {
      params.selectedCountry = this.props.country.iso2;
    }
    return (
      <View style={styles.container}>
        <NavBar title="Register" back />
        <View style={styles.viewMain}>
          <View style={styles.authView}>
            <CustomeInput
              placeholder="First name"
              pos={0}
              value={this.state.firstName}
              onChangeText={text => this.setState({ firstName: text })} />
            <CustomeInput
              placeholder="Last name"
              pos={1}
              value={this.state.lastName}
              onChangeText={text => this.setState({ lastName: text })} />
            <PhoneInput
              placeholder="Phone number"
              pos={1}
              onClickFlags={(data) => {
                this.props.navigation.navigate('Country', {
                  selectedCountry: data.selectedCountry.iso2,
                  onSelectCountry: this.onSelectCountry.bind(this),
                });
              }}
              onChange={(phoneNumber, selectedCountry) => {
                this.setState({ phoneNumber, selectedCountry });
              }}
              selectedCountry={this.state.selectedCountry}
              keyboardType="phone-pad"
              value={this.state.phoneNumber} />
            <CustomeInput
              placeholder="Email"
              pos={1}
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
          </View>
          <View style={styles.viewBottom}>
            <View style={styles.viewTerms1}>
              <Label>By using ROLZO, you agree</Label>
            </View>
            <View style={styles.viewTerms2}>
              <Label>to our </Label>
              <TouchableOpacity onPress={this.onAgreement.bind(this)}>
                <Label strong>Terms and Conditions</Label>
              </TouchableOpacity>
            </View>
            <PrimaryButton text="REGISTER" onPress={this.onSignUp.bind(this)} />
          </View>
        </View>
        <ModalAlert
          visibleModal={this.state.visibleModal}
          title={this.state.waringTitle}
          content={this.state.waringContent}
          onTouch={() => this.setState({ visibleModal: false })}
       />
        <NetInfoState />
      </View>
    );
  }
}
