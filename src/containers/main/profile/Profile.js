import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor, { withTracker } from 'react-native-meteor';
import Spinner from 'react-native-loading-spinner-overlay';

import { dynamicSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { ListButton } from '../../../components/ListButton';
import { Label } from '../../../components/Text';
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
    height: height - dynamicSize(55 + 61 + (71 * 4)) - getStatusBarHeight(),
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: dynamicSize(50),
  },
  viewBottom: {
    position: 'absolute',
    width,
    bottom: dynamicSize(61),
    alignItems: 'center',
  },
  avatar: {
    width: dynamicSize(100),
    height: dynamicSize(100),
    borderRadius: dynamicSize(50),
    borderWidth: dynamicSize(2),
    borderColor: '#A5977C',
    marginBottom: dynamicSize(20),
  },
});

const iconReservation = require('../../../assets/images/icon/iconReservation.png');
const iconPayment = require('../../../assets/images/icon/iconPayment.png');
const iconLegal = require('../../../assets/images/icon/iconLegal.png');
const iconLogout = require('../../../assets/images/icon/iconLogout.png');

const avatar = require('../../../assets/images/avatar.png');

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      visibleModal: false,
      visibleSpinner: false,
    };
    global.selectNumber = 2;
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

  onLogout() {
    Meteor.logout((err) => {
      if (!err) {
        // this.props.navigation.navigate('RootStack');
      }
    });
  }

  onSendImage(image) {
    this.setState({ visibleSpinner: true });
    Meteor.call('setProfileImg', `data:image/jpeg;base64,${image.data}`, image.fileName, 'image/jpg', (err) => {
      if (err) {
        this.setState({ visibleSpinner: false });
        this.setState({ visibleModal: true });
      }
    });
  }

  uploadImage() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        
        // const source = { uri: response.uri };
        // this.setState({
        //   avatarSource: source,
        // });
        // const imgMsg = {
        //   _id: this.state.messages.length + 1,
        //   createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        //   user: {
        //     _id: 2,
        //     name: 'React Native',
        //   },
        //   image: response.uri,
        // };
        this.onSendImage(response);
        // this.onSendImage(response.data);
      }
    });
  }

  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    const { user } = this.props;
    const fullName = user && user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : '';
    let scrAvatar = avatar;
    const imageId = user && user.profile ? this.props.user.profile.imageId : '';
    if (imageId) {
      scrAvatar = { uri: getImageUrl(imageId) };
    }
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar onBack={() => { this.props.navigation.navigate('Home'); }} back />
        <View style={styles.viewMain} >
          <TouchableOpacity
            style={styles.wrapper}
            onPress={() => { this.props.navigation.navigate('EditProfile'); }}
          >
            <TouchableOpacity onPress={this.uploadImage.bind(this)}>
              <Image
                style={styles.avatar}
                source={scrAvatar}
                onLoadEnd={() => {
                  if (this.state.visibleSpinner === true) {
                    this.setState({ visibleSpinner: false });
                  }
                }}
              />
            </TouchableOpacity>
            <Label title>{fullName}</Label>
          </TouchableOpacity>
        </View>
        <View style={styles.viewBottom}>
          <ListButton
            text="Bookings"
            icon={iconReservation}
            onPress={() => {
              this.props.navigation.navigate('Reservations');
            }}
          />
          <ListButton
            text="Payment"
            icon={iconPayment}
            onPress={() => {
              this.props.navigation.navigate('Payment');
            }}
          />
          <ListButton
            text="Support"
            icon={iconLegal}
            onPress={() => {
              this.props.navigation.navigate('Legal');
            }}
          />
          <ListButton text="Logout" icon={iconLogout} onPress={() => this.onLogout()} />
        </View>
        <ModalAlert
          visibleModal={this.state.visibleModal}
          title="Oops"
          content="Something went wrong with your request"
          onTouch={() => this.setState({ visibleModal: false })}
        />
        <Spinner visible={this.state.visibleSpinner} textStyle={{ color: '#FFF' }} />
        <NetInfoState />
      </Animated.View>
    );
  }
}

export default withTracker(() => {
  const sub = Meteor.subscribe('members', {});
  const conversationsSub = Meteor.subscribe('conversations');
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });
  const conversation = Meteor.collection('conversations').findOne({ memberId: Meteor.userId() });

  return {
    ready: sub.ready(),
    conversationsReady: conversationsSub.ready(),
    user,
    conversation,
  };
})(Profile);
