import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PropTypes from 'prop-types';
import Meteor from 'react-native-meteor';

import { RenderTitle, RenderFee, RenderVehicle } from './Utils';
import { dynamicSize, getFontSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { Label } from '../../../components/Text';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { getImageUrl } from '../../../utils/images';
import { NetInfoState } from '../../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - getStatusBarHeight() - dynamicSize(55 + 61),
    width,
  },
  viewContent: {
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  viewRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: dynamicSize(34),
    paddingBottom: dynamicSize(34),
    marginTop: -0.5,
    marginBottom: -0.5,
  },
  viewRowTop: {
    borderTopWidth: 1,
    borderColor: '#EBEBEB1F',
  },
  viewRowBottom: {
    borderBottomWidth: 1,
    borderColor: '#EBEBEB1F',
  },
  itemTitle: {
    marginBottom: dynamicSize(32),
  },
  viewFooter: {
    marginTop: dynamicSize(16),
    marginBottom: -dynamicSize(5),
    alignItems: 'center',
  },
  itemProperty1: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: dynamicSize(24),
    paddingRight: dynamicSize(24),
    borderColor: '#EBEBEB1F',
    borderRightWidth: 0.5,
  },
  itemProperty2: {
    flex: 1,
    alignItems: 'center',
    paddingRight: dynamicSize(24),
    paddingLeft: dynamicSize(24),
    borderLeftWidth: 0.5,
    borderColor: '#EBEBEB1F',
  },
  viewBlock: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: '#0C0C0C',
    top: -35,
  },
  icon: {
    marginTop: dynamicSize(2),
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  iconWrapper: {
    width: dynamicSize(50),
    height: dynamicSize(50),
    padding: dynamicSize(15),
    borderRadius: dynamicSize(25),
    backgroundColor: '#A79779',
    marginBottom: dynamicSize(24),
  },
});

export class Recommendation extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    const { vehicleId } = this.props.navigation.state.params;
    const vehicle = Meteor.collection('vehicles').findOne({ _id: vehicleId });
    const carImages = vehicle.imageIds.map((imageId) => {
      return getImageUrl(imageId);
    });
    this.state = {
      fadeAnim: new Animated.Value(0),
      depositDescription: 'The amount of the Security Deposit is subject to the reservation length and market value of the car. This deposit will be refunded when the car is collected without incidents.',
      carImages,
      vehicle,
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

  onContinue() {
    const { vehicleId, recommendationId } = this.props.navigation.state.params;
    this.props.navigation.navigate('Summary', { vehicleId, recommendationId });
  }

  goToChat() {
    this.props.navigation.goBack();
  }

  renderBlack() {
    return (
      <View style={styles.viewBlock} />
    );
  }
  renderValueItem(title, value, isLeft) {
    return (
      <View style={isLeft ? styles.itemProperty1 : styles.itemProperty2}>
        <Label style={styles.itemTitle}>{title}</Label>
        <Label title fontSize={getFontSize(34)} font="BentonSans-Light">{value}</Label>
      </View>
    );
  }

  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    const { recommendationId, vehicleId } = this.props.navigation.state.params;
    const recommendation = Meteor.collection('recommendations').findOne({ _id: recommendationId });

    const { mode, bookable } = recommendation;
    const currency = Meteor.collection('currencies').findOne({ _id: recommendation.currency });
    const myQuote = recommendation.quotes.find((quote) => {
      return quote.vehicleId === vehicleId;
    });

    const { make, model, description, specifications: {
      engineSize,
      zeroToSixty,
      topSpeed,
      fuelType,
      seats,
      cylinders,
      power,
      transmission,
      doors,
      luggageCapacity,
    } } = this.state.vehicle;

    const { depositFee, dailyFee, days } = myQuote;

    const { depositDescription } = this.state;
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title={`${make}, ${model}`} back />
        <View style={styles.viewMain}>
          <ScrollView indicatorStyle="white">
            <View>
              <RenderVehicle carImages={this.state.carImages} />
              <View style={styles.viewContent}>
                <RenderTitle
                  make={make}
                  model={model}
                  description={description}
                  serviceMode={mode}
                />
                <View>
                  <View style={[styles.viewRow, styles.viewRowTop]}>
                    {this.renderValueItem('Engine Size', engineSize, true)}
                    {this.renderValueItem('Cylinders', `V${cylinders}`, false)}
                  </View>
                  <View style={[styles.viewRow, styles.viewRowTop]}>
                    {this.renderValueItem('0-60 MPH', `${zeroToSixty}s`, true)}
                    {this.renderValueItem('Power (BHP)', power, false)}
                    {this.renderBlack()}
                  </View>
                  <View style={[styles.viewRow, styles.viewRowTop]}>
                    {this.renderValueItem('Top Speed (MPH)', topSpeed, true)}
                    {this.renderValueItem('Transmission', transmission, false)}
                    {this.renderBlack()}
                  </View>
                  <View style={[styles.viewRow, styles.viewRowTop]}>
                    {this.renderValueItem('Fuel Type', fuelType, true)}
                    {this.renderValueItem('Doors', doors, false)}
                    {this.renderBlack()}
                  </View>
                  <View style={[styles.viewRow, styles.viewRowTop, styles.viewRowBottom]}>
                    {this.renderValueItem('Seats', seats, true)}
                    {this.renderValueItem('Luggage capacity', luggageCapacity, false)}
                    {this.renderBlack()}
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
                  {
                    bookable
                    ?
                      <PrimaryButton
                        text="BOOKING"
                        onPress={this.onContinue.bind(this)}
                        />
                      :
                      <PrimaryButton
                        text="MAKE A REQUEST"
                        onPress={this.goToChat.bind(this)}
                        />
                  }
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
