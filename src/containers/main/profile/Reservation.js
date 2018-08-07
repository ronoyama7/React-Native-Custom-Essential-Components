import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Meteor from 'react-native-meteor';
import MapView, { Marker } from 'react-native-maps';

import { dynamicSize, getFontSize } from '../../../utils/DynamicSize';
import mapStyle from '../../../utils/mapStyle';
import NavBar from '../../../components/NavBar';
import { Label } from '../../../components/Text';
import Separator from '../../../components/Separator';
import { RenderTitle, RenderFee, RenderVehicle } from '../chat/Utils';
import { getImageUrl } from '../../../utils/images';
import Icons from '../../../lib/react-native-credit-card-input/Icons';
import { NetInfoState } from '../../../components/NetInfoState';

const moment = require('moment');

const { width, height } = Dimensions.get('window');


const guardIcon = require('../../../assets/images/icon/guard.png');
const pinIcon = require('../../../assets/images/icon/icon_pin.png');
const speedIcon = require('../../../assets/images/icon/speed.png');
const userIcon = require('../../../assets/images/icon/user.png');
const markerIcon = require('../../../assets/images/icon/marker.png');
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
  viewScroll: {
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  viewTitle: {
    marginTop: dynamicSize(35),
    height: dynamicSize(128),
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
  },
  viewDetails: {
    paddingTop: dynamicSize(24),
    paddingBottom: dynamicSize(20),
    borderTopColor: '#EBEBEB1F',
    borderTopWidth: 1,
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
  },
  titleDetail: {
    marginBottom: dynamicSize(23),
  },
  viewSelfDrive: {
    width: dynamicSize(85),
    height: dynamicSize(27),
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: dynamicSize(13.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicSize(10),
  },
  txtTitle: {
    height: dynamicSize(30),
    paddingTop: dynamicSize(8),
  },
  viewRow: {
    flexDirection: 'row',
  },
  semiView: {
    width: width / 2,
  },
  map: {
    width: dynamicSize(148),
    height: dynamicSize(135),
    marginTop: dynamicSize(10),
  },
  addressText: {
    marginTop: dynamicSize(10),
    width: (width / 2) - dynamicSize(30),
  },
  mediumText: {
    color: '#ffffff',
    fontSize: getFontSize(15),
    fontFamily: 'BentonSans-Medium',
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
  iconPayment: {
    width: dynamicSize(30),
    height: dynamicSize(20),
  },
  text: {
    marginLeft: dynamicSize(15),
  },
  paymentView: {
    flexDirection: 'row',
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
    paddingBottom: dynamicSize(20),
    marginTop: dynamicSize(20),
  },
  subTitle: {
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(10),
  },
  price: {
    position: 'absolute',
    right: 0,
  },
  price2: {
    position: 'absolute',
    right: 0,
    paddingTop: 8,
  },
  fee: {
    marginTop: dynamicSize(10),
    paddingBottom: dynamicSize(8),
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
  },
  viewFooter: {
    marginTop: dynamicSize(28),
    marginBottom: dynamicSize(28),
    alignItems: 'center',
  },
  viewCheck: {
    alignItems: 'center',
  },
  check_box: {
    marginRight: 16,
  },
  viewAction: {
    height: dynamicSize(60),
    width: dynamicSize(335),
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  icon: {
    marginLeft: dynamicSize(19),
    marginRight: dynamicSize(19),
    width: dynamicSize(30),
    height: dynamicSize(20),
  },
  button: {
    flexDirection: 'row',
  },
  maker: {
    width: 0,
    height: 0,
  },
  makerPostion: {
    marginLeft: dynamicSize(60),
    marginTop: dynamicSize(33),
    width: dynamicSize(27),
    height: dynamicSize(35),
  },
});

export class Reservation extends Component {
  constructor(props) {
    super(props);
    const { reservation } = this.props.navigation.state.params;
    const user = Meteor.user();
    const paymentMethods = user && user.paymentMethods ? user.paymentMethods : [];
    let paymentType;
    // TODO change map
    paymentMethods.map((payment) => {
      if (payment.cardId === reservation.paymentId) {
        paymentType = payment.type;
      }
    });
    const paymentIcon = Icons[paymentType];
    const vehicle = Meteor.collection('vehicles').findOne({ _id: reservation.vehicleId });
    const carImages = vehicle.imageIds.map((imageId) => {
      return getImageUrl(imageId);
    });

    const currency = Meteor.collection('currencies').findOne({ _id: reservation.currency });
    this.state = {
      fadeAnim: new Animated.Value(0),
      carImages,
      vehicle,
      reservation,
      currency,
      paymentIcon,
      description: 'The amount of the Security Deposit is subject to the reservation length and market value of the car. This deposit will be refunded when the car is collected without incidents.',
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
    // if (isLine) {
    //   styleMap.push(styles.rightLineView);
    // }
    return (
      <View style={styleMap}>
        <Label>{title}</Label>
        {/* <Label title style={styles.boldText}>{strDate}</Label>
        <Label title style={styles.boldText}>{strTime}</Label> */}
        <Label title >{strDate}</Label>
        <Label title >{strTime}</Label>
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
            }}
          >
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
    const {
      vehicle: {
        make,
        model,
      },
      reservation: {
        paymentLabel,
        delivery,
        collection,
        notes,
        mode,
      },
      description,
      currency,
    } = this.state;

    const style = {
      opacity: this.state.fadeAnim,
    };

    const selfMode = (mode === 'selfDrive');
    const { depositFee, dailyFee, days } = this.state.reservation;
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Reservation" back />
        <View style={styles.viewMain}>
          <ScrollView indicatorStyle="white">
            <RenderVehicle carImages={this.state.carImages} />
            <View style={styles.viewScroll}>
              <View>
                {/* <View style={styles.viewContent}> */}
                <RenderTitle
                  serviceMode={mode}
                  make={make}
                  model={model}
                  description=""
                />
              </View>
              <View style={styles.viewDetails}>
                <View style={styles.titleDetail}>
                  <Label strong font="BentonSans-Medium">RESERVATION DATES</Label>
                </View>
                <View style={styles.viewRow}>
                  {this.renderMap('Delivery', delivery)}
                  {this.renderMap('Collection', collection)}
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
                    {/* <PaymentMethodsList addPaymentEnable = 'true' /> */}
                    <View style={styles.viewAction} >
                      <TouchableOpacity activeOpacity={0.6} style={styles.button} >
                        <Image source={this.state.paymentIcon} style={styles.icon} />
                        <Label pointerEvents="none">{paymentLabel}</Label>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <RenderFee
                  daily={dailyFee}
                  days={days}
                  depositFee={depositFee}
                  currency={currency.name}
                  description={description}
                  serviceMode={mode}
                />
              </View>

              <View style={styles.viewFooter}>
                <View style={[styles.viewRow, styles.viewCheck]}>
                  <TouchableHighlight
                    onPress={
                      () => {
                        this.props.navigation.navigate('CustomAgreement', {
                          quote: this.props.navigation.state.params.reservation
                        })
                      }
                    }
                    >
                    <Label strong font="BentonSans-Medium">Rental Agreement</Label>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <NetInfoState />
      </Animated.View>
    );
  }
}
