import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  AsyncStorage,
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import PropTypes from 'prop-types';

import { dynamicSize } from '../../../../utils/DynamicSize';
import Flags from '../../../../components/FlagResource';
import NavBar from '../../../../components/NavBar';
import PaymentMethodsList from '../../../../components/PaymentMethodsList';
import { SecondaryButton } from '../../../../components/SecondaryButton';
import { NetInfoState } from '../../../../components/NetInfoState';

import { Label } from '../../../../components/Text';
import { allCountries } from './Currency';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55 + 72) - getStatusBarHeight(),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
    width: width - dynamicSize(40),
  },
  viewCurrency: {
    marginTop: dynamicSize(32),
    paddingBottom: dynamicSize(32),
    borderColor: '#D8D8D81F',
    borderBottomWidth: 1,
  },
  viewTitle: {
    marginBottom: dynamicSize(18),
  },
  viewDescription: {
    marginBottom: dynamicSize(18),
  },
  viewPaymentMethod: {
    marginTop: dynamicSize(25),
  },
});

export class Payment extends Component {
  static propTypes = {
    country: PropTypes.shape({
      name: PropTypes.string,
      iso2: PropTypes.string,
      code: PropTypes.string,
    }),
    user: PropTypes.shape({}).isRequired,
  }
  static defaultProps = {
    country: {
      name: 'Pound Sterling (£)',
      iso2: 'gb',
      code: 'GBP',
    },
  }
  constructor(props) {
    super(props);
    let { country } = this.props;
    const { currency } = Meteor.user();
    for (let i = 0; i < allCountries.length; i++) {
      if (allCountries[i].code === currency) {
        country = allCountries[i];
        break;
      }
    }
    this.state = {
      fadeAnim: new Animated.Value(0),
      country,
    };
    try {
      AsyncStorage.setItem('Director', 'payment');
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
  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    const user = Meteor.user() || {};
    let { currency } = user;
    if (typeof currency !== 'object') {
      currency = {
        name: 'Pound Sterling (£)',
        iso2: 'gb',
        code: 'GBP',
      };
    }
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Payment" back />
        <View style={styles.viewMain} >
          <ScrollView indicatorStyle="white">
            <View>
              <View style={styles.viewCurrency}>
                <View style={styles.viewTitle}>
                  <Label strong font="BentonSans-Medium">CURRENCY</Label>
                </View>
                <SecondaryButton
                  text={currency.name}
                  icon={Flags.get(currency.iso2)}
                  onPress={() => this.props.navigation.navigate('Currency', { country: { code: currency.code } })}
                />
              </View>
              <View style={styles.viewPaymentMethod}>
                <View style={styles.viewTitle}>
                  <Label strong font="BentonSans-Medium">PAYMENT METHOD</Label>
                </View>
                <View style={styles.viewDescription}>
                  <PaymentMethodsList />
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

export default withTracker(() => {
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });
  return {
    user,
  };
})(Payment);
