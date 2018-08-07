import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Accounts } from 'react-native-meteor';

import { CustomeInput } from '../../components/Input';
import { PrimaryButton } from '../../components/PrimaryButton';
import NavBar from '../../components/NavBar';
import { Label } from '../../components/Text';
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
  },
  viewBottom: {
    position: Platform.OS === 'ios' ? null : 'absolute',
    bottom: Platform.OS === 'ios' ? null : 0,
    marginTop: 'auto',
    marginBottom: dynamicSize(32),
    alignItems: 'center',
    width,
  },
  txtTitle: {
    marginTop: dynamicSize(32),
    marginBottom: dynamicSize(20),
  },
  txtDescription: {
    height: dynamicSize(45),
    marginBottom: dynamicSize(19),
  },
  txtError: {
    marginTop: dynamicSize(6),
  },
});

export class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fadeAnim: new Animated.Value(0),
      wrongEmail: false,
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
  onConfirm() {
    const { email } = this.state;
    Accounts.forgotPassword({ email }, (e) => {
      if (!e) {
        this.props.navigation.navigate('Reset', { email });
      } else {
        this.setState({ wrongEmail: true });
      }
    });
  }
  onUpdateEmail(text) {
    this.setState({ email: text, wrongEmail: false });
  }
  validate() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      return false;
    }
    return true;
  }

  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} accessible={false}>
        <Animated.View style={[styles.container, style]}>
          <NavBar title="Forgot Password" back/>
          <KeyboardAvoidingView style={styles.viewMain} behavior="padding" enabled>
            <View style={styles.authView}>
              <Label strong style={styles.txtTitle} font="BentonSans-Medium">ENTER YOUR EMAIL</Label>
              <Label style={styles.txtDescription}>
                {  'You will receive an email with a link to reset your password.'}
              </Label>
              <CustomeInput
                placeholder="Email"
                pos={3}
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={this.onUpdateEmail.bind(this)} />
            {
              this.state.wrongEmail?
              <Label error style={styles.txtError}>
                This email cannot be recognised by ROLZO.
              </Label>:
              <Label error style={styles.txtError}>
              </Label>
            }
            </View>
            <View style={styles.viewBottom}>
              { this.validate() && <PrimaryButton text="CONFIRM" onPress={this.onConfirm.bind(this)} />}
            </View>
            </KeyboardAvoidingView>
            <NetInfoState />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
