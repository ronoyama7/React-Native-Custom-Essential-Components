import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  AsyncStorage,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import CheckBox from 'react-native-check-box';
import Meteor from 'react-native-meteor';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';
// import * as moment from 'moment';

import { RenderTitle, RenderFee, RenderVehicle } from './Utils';
import { dynamicSize } from '../../../utils/DynamicSize';
import mapStyle from '../../../utils/mapStyle';
import NavBar from '../../../components/NavBar';
import { Label } from '../../../components/Text';
import Separator from '../../../components/Separator';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { getImageUrl } from '../../../utils/images';
import PaymentMethodsList from '../../../components/PaymentMethodsList';
import ModalAlert from '../../../components/ModalAlert';
import { NetInfoState } from '../../../components/NetInfoState';

const moment = require('moment');

const { width, height } = Dimensions.get('window');

const guardIcon = require('../../../assets/images/icon/guard.png');
const speedIcon = require('../../../assets/images/icon/speed.png');
const userIcon = require('../../../assets/images/icon/user.png');
const checkIcon = require('../../../assets/images/icon/checked.png');
const uncheckIcon = require('../../../assets/images/icon/unchecked.png');
const markerIcon = require('../../../assets/images/icon/marker.png');
const pinIcon = require('../../../assets/images/icon/icon_pin.png');
const knowIcon = require('../../../assets/images/icon/icon_chauffeur.png');
const waitIcon = require('../../../assets/images/icon/Icon_complimentary waiting time.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55 + 61) - getStatusBarHeight(),
    width,
  },
  viewContent: {
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  viewDetails: {
    paddingTop: dynamicSize(24),
    paddingBottom: dynamicSize(20),
    borderTopColor: '#EBEBEB1F',
    borderTopWidth: 1,
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
  },
  viewRow: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  semiView: {
    width: '50%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rightLineView: {
    borderRightColor: '#EBEBEB1F',
    borderRightWidth: 1,
  },
  boldText: {
    marginTop: dynamicSize(5),
  },
  map: {
    width: '100%',
    height: dynamicSize(135),
    marginTop: dynamicSize(10),
  },
  maker: {
    width: 0,
    height: 0,
  },
  addressText: {
    marginTop: dynamicSize(10),
    width: (width / 2) - dynamicSize(64),
  },
  mediumText: {
    marginTop: dynamicSize(10),
  },
  serviceView: {
    marginTop: dynamicSize(20),
  },
  iconView: {
    flexDirection: 'row',
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingBottom: dynamicSize(20),
    marginTop: dynamicSize(20),
  },
  guard: {
    width: dynamicSize(25),
    height: dynamicSize(25),
    resizeMode: 'contain',
  },
  chk: {
    marginRight: dynamicSize(12),
  },
  iconPayment: {
    width: dynamicSize(30),
    height: dynamicSize(20),
  },
  text: {
    marginLeft: dynamicSize(10),
  },
  paymentView: {
    flexDirection: 'row',
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
    paddingBottom: dynamicSize(20),
    marginTop: dynamicSize(20),
  },
  viewFooter: {
    marginTop: 48,
    marginBottom: 48,
    alignItems: 'center',
  },
  viewFooter2: {
    marginBottom: 8,
  },
  viewCheck: {
    alignItems: 'center',
  },
  makerPostion: {
    marginLeft: dynamicSize(60),
    marginTop: dynamicSize(33),
    width: dynamicSize(27),
    height: dynamicSize(35),
  },
});

export class Summary extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    const { vehicleId, recommendationId } = this.props.navigation.state.params;
    const vehicle = Meteor.collection('vehicles').findOne({ _id: vehicleId });
    const carImages = vehicle.imageIds.map((imageId) => {
      return getImageUrl(imageId);
    });
    const recommendation = Meteor.collection('recommendations').findOne({ _id: recommendationId });
    this.state = {
      fadeAnim: new Animated.Value(0),
      depositDescription: 'The amount of the Security Deposit is subject to the reservation length and market value of the car. This deposit will be refunded when the car is collected without incidents.',
      accepted: true,
      carImages,
      vehicle,
      visibleModal: false,
      recommendation,
    };
    try {
      AsyncStorage.setItem('Director', 'summary');
    } catch (error) {
      // Error saving data
    }
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

  onReserve() {
    const { recommendationId, vehicleId } = this.props.navigation.state.params;
    const paymentId = this.state.cardId;
    Meteor.call('reserveRecommendation', recommendationId, vehicleId, paymentId, (err) => {
      if (!err) {
        this.props.navigation.navigate('Reservated');
      } else {
        this.setState({ visibleModal: true });
      }
    });
  }

  onPressPayment(cardId) {
    this.setState({ cardId });
  }

  renderMap(title, item, isLine = false) {
    const {
      location: {
        // city,
        // state,
        // country,
        lat,
        lng,
        // geometry: {
        //   type: 'Point',
        //   coordinates: [2.3522219000000177, 48.85661400000001],
        // },
        fullAddress,
        // placeId,
      },
    } = item;
    const date = moment(`${item.date}`, 'ddd MMM DD YYYY hh:mm:ss GMT');// GMT+0200 (CEST)
    const strDate = date.format('DD MMM YY');
    const strTime = item.time;
    const styleMap = [styles.semiView];
    if (isLine) {
      styleMap.push(styles.rightLineView);
    }
    return (
      <View style={styleMap}>
        <Label strong font="BentonSans-Medium">{title}</Label>
        <Label title style={styles.boldText}>{strDate}</Label>
        <Label title style={styles.boldText}>{strTime}</Label>
        <MapView
          style={styles.map}
          provider="google"
          customMapStyle={mapStyle}
          region={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsIndoors={false}
          zoomEnabled={false}
          zoomControlEnabled={false}
          minZoomLevel={15}
          rotateEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          loadingEnabled
          loadingIndicatorColor="#A79779"
          loadingBackgroundColor="#0C0C0C"
          moveOnMarkerPress={false}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}>
            <Image
              source={markerIcon}
              style={styles.maker}
            />
          </Marker>
          <Image
            source={markerIcon}
            style={styles.makerPostion}
          />
        </MapView>
        <Label button style={styles.addressText}>{fullAddress}</Label>
      </View>
    );
  }
  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };

    const { recommendationId, vehicleId } = this.props.navigation.state.params;

    const recommendation = Meteor.collection('recommendations').findOne({ _id: recommendationId });
    const { mode } = recommendation;
    const currency = Meteor.collection('currencies').findOne({ _id: recommendation.currency });
    const myQuote = recommendation.quotes.find((quote) => {
      return quote.vehicleId === vehicleId;
    });

    const {
      vehicle: { make, model },
      recommendation: { delivery, collection, notes },
      depositDescription,
    } = this.state;

    const recommendationStatus = recommendation.status !== 'sent';

    const { depositFee, dailyFee, days } = myQuote;

    const selfMode = (mode === 'selfDrive');

    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Summary" back />
        <View style={styles.viewMain}>
          <ScrollView indicatorStyle="white">
            <View>
              <RenderVehicle carImages={this.state.carImages} />
              <View style={styles.viewContent}>
                <RenderTitle
                  serviceMode={mode}
                  make={make}
                  model={model}
                  description={this.state.description}
                />
                <View style={styles.viewDetails}>
                  <View style={styles.viewRow}>
                    {this.renderMap('PICK-UP', delivery, true)}
                    {this.renderMap('DROP-OFF', collection)}
                  </View>
                </View>
                <Separator color="#D8D8D8" width={width} height={1} style={{ }} />
                {
                  notes
                  ?
                    <View style={styles.viewDetails}>
                      <View style={styles.titleDetail}>
                        <Label strong font="BentonSans-Medium">NOTES</Label>
                        <Label button style={styles.mediumText}>{notes}</Label>
                      </View>
                    </View>
                  :
                    null
                }
                <View>
                  <View style={styles.serviceView}>
                    <Label strong font="BentonSans-Medium">COMPLIMENTARY SERVICES</Label>
                  </View>
                  {
                    selfMode
                    ?
                      <View style={styles.iconView}>
                        <View>
                          <Image source={guardIcon} style={styles.guard} />
                        </View>
                        <View style={styles.text}>
                          <Label button>Comprehensive Insurance</Label>
                        </View>
                      </View>
                    :
                      <View style={styles.iconView}>
                        <View>
                          <Image source={knowIcon} style={styles.guard} />
                        </View>
                        <View style={styles.text}>
                          <Label button>Locally knowledgeable driver</Label>
                        </View>
                      </View>
                  }

                  {
                    selfMode
                    ?
                      <View style={styles.iconView}>
                        <View>
                          <Image source={pinIcon} style={styles.guard} />
                        </View>
                        <View style={styles.text}>
                          <Label button>Delivery and Collection</Label>
                        </View>
                      </View>
                    :
                      <View style={styles.iconView}>
                        <View>
                          <Image source={waitIcon} style={styles.guard} />
                        </View>
                        <View style={styles.text}>
                          <Label button>Complimentary waiting time</Label>
                        </View>
                      </View>
                  }
                  <View style={styles.iconView}>
                    <View>
                      <Image source={speedIcon} style={styles.guard} />
                    </View>
                    <View style={styles.text}>
                      <Label button>Unlimited Miles</Label>
                    </View>
                  </View>
                  <View style={styles.iconView}>
                    <View>
                      <Image source={userIcon} style={styles.guard} />
                    </View>
                    <View style={styles.text}>
                      <Label button>24/7 Concierge Service</Label>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={styles.serviceView}>
                    <Label strong font="BentonSans-Medium">PAYMENT METHOD</Label>
                  </View>
                  <View>
                    <View style={styles.paymentView}>
                      <PaymentMethodsList addPaymentEnable={true} onPress={this.onPressPayment.bind(this)} />
                    </View>
                  </View>
                </View>
                <RenderFee
                  daily={dailyFee}
                  days={days}
                  depositFee={depositFee}
                  currency={currency.name}
                  description={depositDescription}
                  serviceMode={mode}
                />
                <View style={styles.viewFooter}>
                  <View style={styles.viewCheck}>
                    <View style={[styles.viewRow, styles.viewCheck]}>
                      <CheckBox
                        style={styles.chk}
                        isChecked={true}
                        onClick={() => { this.setState({ accepted: !this.state.accepted }); }}
                        checkedImage={<Image source={checkIcon} />}
                        unCheckedImage={<Image source={uncheckIcon} />} />
                      <Label> I have read and agree to the terms of the </Label>
                    </View>
                    <TouchableOpacity onPress={() =>
                      this.props.navigation.navigate('CustomAgreement', { quote: myQuote })
                    }>
                      <Label strong font="BentonSans-Medium">Booking Agreement</Label>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.viewFooter2}>
                  <PrimaryButton
                    text="COMPLETE BOOKING"
                    onPress={this.onReserve.bind(this)}
                    disabled={
                      (
                        !this.state.accepted ||
                        !(
                          typeof this.state.cardId === 'string' &&
                          this.state.cardId.length > 0
                        )
                        ||
                        recommendationStatus
                      )
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <ModalAlert
          visibleModal={this.state.visibleModal}
          title="Oops"
          content="Something went wrong with your request"
          onTouch={() => this.setState({ visibleModal: false })}
        />

        <NetInfoState />
      </Animated.View>
    );
  }
}
