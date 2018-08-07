import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PropTypes from 'prop-types';

import Meteor, { createContainer } from 'react-native-meteor';

import { dynamicSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { CustomeInput } from '../../../components/Input';
import { PhoneInput, replaceCountryCode } from '../../../components/PhoneInput';
import { getImageUrl } from '../../../utils/images';
import ModalAlert from '../../../components/ModalAlert';
import { NetInfoState } from '../../../components/NetInfoState';

const ImagePicker = require('react-native-image-picker');

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(115) - getStatusBarHeight(),
    width,
    alignItems: 'center',
  },
  viewBottom: {
    position: 'absolute',
    width,
    bottom: 0,
    alignItems: 'center',
  },
  avatar: {
    width: dynamicSize(100),
    height: dynamicSize(100),
    borderRadius: dynamicSize(50),
    borderWidth: dynamicSize(2),
    borderColor: '#A5977C',
    marginBottom: dynamicSize(11),
  },
  inputWrapper: {
    marginBottom: dynamicSize(18),
    marginTop: dynamicSize(4),
  },
  avatarWrapper: {
    top: 0,
    height: height - dynamicSize(55 + 72 + (58 * 4) + 42) - getStatusBarHeight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const avatar = require('../../../assets/images/avatar.png');

export class EditProfile extends Component {
  static propTypes = {
    user: PropTypes.shape({
      profile: PropTypes.shape({
        imageId: PropTypes.string,
      }),
    }).isRequired,
  }
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phoneNumber: user.profile.phone,
      email: user.emails[0].address,
      visibleModal: false,
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

  onSendImage(image) {
    Meteor.call('setProfileImg', `data:image/jpeg;base64,${image.data}`, image.fileName, 'image/jpg', (err) => {
      if (err) {
        this.setState({ visibleModal: true });
      }
    });
  }

  onSave() {
    const { firstName, lastName, phoneNumber, email } = this.state;
    const { navigation } = this.props;
    Meteor.call('setProfile', firstName, lastName, phoneNumber, email, (err) => {
      if (!err) {
        navigation.goBack();
      } else {
        this.setState({ visibleModal: true });
      }
    });
  }

  onUpdate() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // User has cancelled
      } else if (response.error) {
        // Error
      } else if (response.customButton) {
        // customButton
      } else {
        this.onSendImage(response);
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
    const style = {
      opacity: this.state.fadeAnim,
    };
    let scrAvatar = avatar;
    const { imageId } = this.props.user.profile;
    if (imageId) {
      scrAvatar = { uri: getImageUrl(imageId) };
    }
    const stylezIndex = {
      zIndex: 9999,
    };
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} accessible={false}>
        <Animated.View style={[styles.container, style]}>
          <View style={stylezIndex}>
            <NavBar title="Edit Profile" back />
          </View>
          <KeyboardAvoidingView behavior="position" enabled>
            <View style={styles.viewMain} >
              <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={this.onUpdate.bind(this)}>
                  <Image style={styles.avatar} source={scrAvatar} />
                </TouchableOpacity>
              </View>
              <View style={styles.viewBottom}>
                <View style={styles.inputWrapper}>
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
                    selectedCountry={this.state.selectedCountry}
                    keyboardType="phone-pad"
                    value={this.state.phoneNumber}
                    onChange={(phoneNumber, selectedCountry) => {
                      this.setState({ phoneNumber, selectedCountry });
                    }}
                    />
                  <CustomeInput
                    placeholder="Email"
                    pos={2}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })} />
                </View>
                <PrimaryButton text="SAVE" onPress={this.onSave.bind(this)} />
              </View>
            </View>
          </KeyboardAvoidingView>
          <ModalAlert
            visibleModal={this.state.visibleModal}
            title="Oops"
            content="Something went wrong with your request"
            onTouch={() => this.setState({ visibleModal: false })}
          />
          <NetInfoState />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

export default createContainer(() => {
  const sub = Meteor.subscribe('members', {});
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });
  return {
    ready: sub.ready(),
    user,
  };
}, EditProfile);
