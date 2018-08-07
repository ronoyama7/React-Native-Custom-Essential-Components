import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import Communications from 'react-native-communications';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor, { withTracker } from 'react-native-meteor';
import RNFetchBlob from 'react-native-fetch-blob';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import { Circle } from 'react-native-progress';

import { getImageUrl, getDocumentUrl } from '../../../utils/images';

import { GiftedChat, Actions, InputToolbar, Time } from '../../../lib/react-native-gifted-chat/';
import { dynamicSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { Label } from '../../../components/Text';
import ModalAlert from '../../../components/ModalAlert';
import CustomCarousel from '../../../components/CustomCarousel';
import { NetInfoState } from '../../../components/NetInfoState';

const iconPdf = require('../../../assets/images/icon/icon_pdf.png');
const iconRight = require('../../../assets/images/icon/iconRight.png');
const iconChat = require('../../../assets/images/icon/iconChat.png');

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    top: Platform.OS === 'ios' ? dynamicSize(76) : dynamicSize(54),
    position: 'absolute',
    bottom: dynamicSize(60),
    width,
  },
  icon: {
    marginRight: dynamicSize(19),
    marginTop: dynamicSize(2),
    width: dynamicSize(18),
    height: dynamicSize(19),
  },
  btnlabel: {
    marginLeft: -dynamicSize(10),
  },
  viewEmpty: {
    height: height - dynamicSize(55 + 61 + 61) - getStatusBarHeight(),
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChat: {
    marginTop: dynamicSize(2),
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  iconWrapper: {
    width: dynamicSize(50),
    height: dynamicSize(50),
    padding: dynamicSize(15),
    borderRadius: dynamicSize(25),
    backgroundColor: '#000000',
    marginTop: dynamicSize(22),
  },
  wrapper: {
    flexDirection: 'row',
  },
  iconRight: {
    position: 'absolute',
    right: 3,
    marginTop: dynamicSize(2),
  },
  carItem: {
    marginTop: dynamicSize(16),
    marginLeft: dynamicSize(3),
    marginRight: dynamicSize(3),
  },
  carItemOpacity: {
    marginTop: dynamicSize(16),
    marginLeft: dynamicSize(3),
    marginRight: dynamicSize(3),
    opacity: 0.65,
    borderRadius: dynamicSize(4),
  },
  carImage: {
    // width: (width * 0.8) - dynamicSize(2),
    height: dynamicSize(170),
  },
  carItemLabel: {
    backgroundColor: '#1D1D1D',
    padding: dynamicSize(12),
    paddingLeft: dynamicSize(25),
  },
  docItemLabel: {
    backgroundColor: '#000000',
    padding: 15,
    borderTopLeftRadius: dynamicSize(4),
    borderTopRightRadius: dynamicSize(4),
    borderBottomLeftRadius: dynamicSize(4),
    borderBottomRightRadius: dynamicSize(4),
    marginBottom: dynamicSize(16),
  },
  docItem: {
    width: (width * 0.75) - dynamicSize(2),
    marginLeft: dynamicSize(12) + (width * 0.20),
  },
  containerStyle: {
    backgroundColor: '#000000',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  textInputStyle: {
    color: 'white',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderBottomLeftRadius: dynamicSize(4),
    borderBottomRightRadius: dynamicSize(4),
    paddingLeft: dynamicSize(8),
    paddingRight: dynamicSize(8),
  },
  btnPhone: {
    justifyContent: 'center',
    paddingLeft: dynamicSize(16),
    paddingRight: dynamicSize(16),
  },
  sendContainer: {
    height: dynamicSize(44),
    justifyContent: 'flex-end',
  },
  sendBtn: {
    backgroundColor: 'transparent',
    marginBottom: dynamicSize(12),
    marginLeft: dynamicSize(10),
    marginRight: dynamicSize(10),
  },
  addBtn: {
    backgroundColor: 'transparent',
  },
  iconPhone: {
    width: dynamicSize(22),
    height: dynamicSize(21),
  },
  wrapperAddBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wrapperStyle1: {
    backgroundColor: '#D8D8D8',
    borderTopLeftRadius: dynamicSize(4),
    borderTopRightRadius: dynamicSize(4),
    borderBottomLeftRadius: dynamicSize(16),
    borderBottomRightRadius: dynamicSize(4),
    marginTop: dynamicSize(16),
  },
  wrapperStyle2: {
    backgroundColor: '#292929',
    borderTopLeftRadius: dynamicSize(4),
    borderTopRightRadius: dynamicSize(4),
    borderBottomLeftRadius: dynamicSize(4),
    borderBottomRightRadius: dynamicSize(16),
    marginTop: dynamicSize(16),
  },
  textStyle1: {
    color: '#303030',
    fontSize: dynamicSize(14),
    fontFamily: 'BentonSans-Book',
  },
  textStyle2: {
    color: '#FFFFFF',
    fontSize: dynamicSize(14),
    fontFamily: 'BentonSans-Book',
  },
  timeStyle1: {
    color: '#4A4A4A',
    fontSize: dynamicSize(9),
    fontFamily: 'BentonSans-Book',
  },
  timeStyle2: {
    color: '#D8D8D8',
    fontSize: dynamicSize(9),
    fontFamily: 'BentonSans-Book',
  },
});

const addIcon = require('../../../assets/images/icon/iconAddChat.png');
const sendIcon = require('../../../assets/images/icon/iconSend.png');
const phonePhone = require('../../../assets/images/icon/iconPhone.png');

const mappedMessages = (messages) => {
  return messages ? messages.map((message, index) => {
    const { content, type } = message;
    if (type === 'text') {
      return {
        _id: (index + 1),
        text: content.text.replace(/<br\s*[\/]?>/gi, '\n'),
        createdAt: message.sentAt,
        user: {
          _id: (message.userFrom === Meteor.userId() ? 2 : 1),
          name: '',
        },
      };
    } else if (type === 'image') {
      const { imageId } = content;
      return {
        _id: (index + 1),
        createdAt: message.sentAt,
        user: {
          _id: (message.userFrom === Meteor.userId() ? 2 : 1),
          name: '',
        },
        image: getImageUrl(imageId),
      };
    } else if (type === 'recommendation') {
      const { recommendationId } = content;
      const recommendation = Meteor.collection('recommendations').findOne({ _id: recommendationId });
      if (!recommendation) {
        return {
          _id: (index + 1),
          sentAt: message.sentAt,
        };
      }
      const { reservationId } = recommendation;
      const reservation = reservationId ? Meteor.collection('recommendations').findOne({ _id: reservationId }) : null;
      const recommendationStatus = recommendation.status;
      const messageType = 'recommendation';
      const vehicleIds = recommendation.quotes.map((quote) => {
        return quote.vehicleId;
      });
      const vehicles = Meteor.collection('vehicles').find({ _id: { $in: vehicleIds } });
      const entries = vehicles.map((vehicle) => {
        return {
          _id: vehicle._id,
          imageIds: vehicle.imageIds,
          make: vehicle.make,
          model: vehicle.model,
          messageType,
          reservation,
          recommendationId,
          recommendationStatus,
        };
      });

      return {
        _id: (index + 1),
        system: true,
        entries,
        messageType,
        reservation,
        recommendationId,
        recommendationStatus,
        userFrom: message.userFrom,
        sentAt: message.sentAt,
      };
    } else if (type === 'document') {
      const { documentId } = content;
      const document = Meteor.collection('documents').findOne({ _id: documentId });
      return {
        _id: (index + 1),
        system: true,
        createdAt: message.sentAt,
        messageType: 'document',
        url: getDocumentUrl(document._id),
      };
    }
    return {};
  }) : [];
};

export class Chat extends Component {
  static propTypes = {
    conversationReady: PropTypes.bool,
    conversation: PropTypes.object,
    navigation: PropTypes.object.isRequired,
  };

  static defaultProps = {
    conversationReady: undefined,
    conversation: undefined,
  };
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      countryName: '',
      regionName: '',
      visibleModal: false,
      visibleSpinner: false,
    };
    global.selectNumber = 1;
  }
  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500,
      },
    ).start();
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
  shouldComponentUpdate(nextProps, nextState) {
    const { conversationReady, conversation, messages } = this.props;

    if (conversationReady !== nextProps.conversationReady && nextProps.conversationReady) {
      return true;
    } else if (conversation && conversation._id && messages.length !== nextProps.messages) {
      return true;
    }
    return false;
  }
  componentWillUnmount() {
  }
  onSend(messages = []) {
    const { conversation } = this.props;
    const message = messages[0];
    const city = this.state.regionName;
    const country = this.state.countryName;
    Meteor.call(
      'sendMessage',
      conversation._id,
      {
        location: { city, country },
        type: 'text',
        value: message.text.replace(/(?:\r\n|\r|\n)/g, '<br />'),
      },
      (err) => {
        if (err) {
          this.setState({ visibleModal: true });
        }
      },
    );
  }
  onSendImage(image) {
    const { conversation } = this.props;
    const city = this.state.regionName;
    const country = this.state.countryName;
    this.setState({ visibleSpinner: true });
    Meteor.call('sendMessage', conversation._id, {
      location: { city, country },
      type: 'image',
      value: {
        isBase64: true,
        content: `data:image/jpeg;base64,${image.data}`,
        fileName: image.fileName,
        type: 'image/jpg',
      },
    }, (err) => {
      this.setState({ visibleSpinner: false });
      if (err) {
        this.setState({ visibleModal: true });
      }
    });
  }
  fileDownload(url) {
    const { dirs } = RNFetchBlob.fs;
    let path = dirs.DownloadDir;
    if (typeof path === 'undefined') {
      path = dirs.DocumentDir;
    }
    this.setState({ visibleSpinner: true });
    RNFetchBlob
      .config({
        path: `${path}/document.pdf`,
      })
      .fetch('GET', url, {
        // some headers ..
      })
      .then((res) => {
        this.setState({ visibleSpinner: false });
        setTimeout(() => {
          Alert.alert(
            'File download successfully.',
            'Do you need to check this file now?',
            [
              { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Yes', onPress: () => this.props.navigation.push('DocumentComponent', { url: res.path() }) },
            ],
            { cancelable: false },
          );
        }, 100);
      }).catch((e) => {
        this.setState({ visibleSpinner: false });
      });
  }
  openPicker() {
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
        this.onSendImage(response);
      }
    });
  }
  renderIcon() {
    return (
      <View style={[styles.wrapperAddBtn]}>
        <Image source={addIcon} style={[styles.addBtn]} />
      </View>
    );
  }
  renderActions(props) {
    return (
      <Actions
        {...props}
        icon={this.renderIcon.bind(this)}
      />
    );
  }

  renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        placeholder="Write a message..."
        placeholderTextColor="#9B9B9B"
        containerStyle={styles.containerStyle}
        textInputStyle={styles.textInputStyle}
      />
    );
  }
  renderSend(props) {
    const { text, containerStyle, onSend } = props;
    return (
      <TouchableOpacity
        style={[styles.sendContainer, containerStyle]}
        onPress={() => {
          if (text.trim().length > 0) onSend({ text: text.trim() }, true);
        }}
        accessibilityTraits="button">
        <View>
          <Image source={sendIcon} style={[styles.sendBtn]} />
        </View>
      </TouchableOpacity>
    );
  }
  renderTime(props) {
    const style = { left: styles.timeStyle1, right: styles.timeStyle2 };
    return (
      <Time {...props} textStyle={style} />
    );
  }
  renderReservationItem({ item, index }) {
    const {
      _id,
      imageIds: [imageId],
      make,
      model,
      recommendationId,
      reservation,
      recommendationStatus,
    } = item;
    const carImageLink = getImageUrl(imageId);
    const disable = (recommendationStatus !== 'sent');
    return (
      <TouchableOpacity
        onPress={() => {
          if (reservation) {
            this.props.navigation.navigate('Reservation', reservation);
          } else {
            this.props.navigation.navigate('Recommendation', { vehicleId: _id, recommendationId });
          }
        }}
        style={disable ? styles.carItemOpacity : styles.carItem}>
        <View key={index} style={disable ? styles.carItemOpacity : styles.carItem} >
          <Image source={{ uri: carImageLink }} style={styles.carImage} />
          <View style={styles.carItemLabel}>
            <Label button font="BentonSans-Medium">{make}</Label>
            <Label button font="BentonSans-Medium">{model}</Label>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSystemMessage(props) {
    const { currentMessage } = props;
    if (typeof currentMessage.messageType !== 'undefined' && currentMessage.messageType === 'document') {
      return (
        <TouchableOpacity
          style={styles.docItem}
          onPress={() => this.fileDownload(currentMessage.url)}
        >
          <View style={styles.docItemLabel}>
            <View style={styles.wrapper}>
              { iconPdf && <Image source={iconPdf} style={styles.icon} />}
              <Label pointerEvents="none" style={styles.btnlabel} button>View Receipt</Label>
              <Image source={iconRight} style={styles.iconRight} />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    const { entries } = currentMessage;
    const sliderWidth = width;
    const itemWidth = width * 0.8;

    return (
      <CustomCarousel
        data={entries}
        renderItem={this.renderReservationItem.bind(this)}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
      />
    );

  }
  renderScrollComponent(props) {
    return (
      <ScrollView indicatorStyle="white" {...props} />
    );
  }
  render() {
    const rightButton = (
      <TouchableHighlight
        onPress={() => {
          Communications.phonecall('+8613238831500', true);
        }}
        style={styles.btnPhone}
      >
        <Image style={styles.iconPhone} source={phonePhone} />
      </TouchableHighlight>
    );

    const style = {
      opacity: this.state.fadeAnim,
    };

    const { conversation, messages } = this.props;
    Meteor.call('seeConversation', conversation._id);

    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar back onBack={() => { this.props.navigation.navigate('Home'); }} rightButton={rightButton} />
        <View
          style={styles.viewMain}>
          <GiftedChat
            messages={messages}
            inverted={false}
            shouldResetInputToolbar={true}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
            renderLoading={() => (
              <Animated.View style={[styles.container, style]}>
                <NavBar back onBack={() => { this.props.navigation.navigate('Home'); }} rightButton={rightButton} />
                <View style={styles.viewEmpty} >
                  <Label>Waiting your concierge.</Label>
                  <Circle size={30} indeterminate color="#CCCCCC" />
                </View>

                <NetInfoState />
              </Animated.View>
            )}
            renderActions={this.renderActions.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderSend={this.renderSend.bind(this)}
            renderTime={this.renderTime.bind(this)}
            renderAvatar={null}
            onPressActionButton={() => {
              this.openPicker();
            }}
            wrapperStyle={{ left: styles.wrapperStyle1, right: styles.wrapperStyle2 }}
            textStyle={{ left: styles.textStyle1, right: styles.textStyle2 }}
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            listViewProps={{ indicatorStyle: 'white' }}
            keyboardShouldPersistTaps="never"
            bottomOffset={Platform.OS === 'ios' ? dynamicSize(53) : 0}
          />
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
  let messages;
  const conversationSub = Meteor.subscribe('conversations', { memberId: Meteor.userId() });
  const conversation = Meteor.collection('conversations').findOne({ memberId: Meteor.userId() });
  if (conversation && conversation._id) {
    messages = Meteor.collection('messages').find({ conversationId: conversation._id }, { sort: { sentAt: 1 } });
  }
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });

  return {
    conversationReady: conversationSub.ready(),
    conversation,
    messages: mappedMessages(messages),
    user: user || [],
  };
})(Chat);
