import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { dynamicSize } from '../utils/DynamicSize';
import { Label } from '../components/Text';
import Icons from '../lib/react-native-credit-card-input/Icons';

import { SecondaryButton } from './SecondaryButton';

const iconAddPayment = require('../assets/images/icon/iconAdd.png');
const Check = require('../assets/images/icon/checked.png');
const unCheck = require('../assets/images/icon/unchecked.png');

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: dynamicSize(19),
    marginRight: dynamicSize(19),
    width: dynamicSize(30),
    height: dynamicSize(20),
  },
  iconRight: {
    marginLeft: dynamicSize(19),
    marginRight: dynamicSize(19),
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
  },
  viewAction: {
    height: dynamicSize(60),
    width: dynamicSize(335),
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 4,
  },
});

export class PaymentMethods extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    addPaymentEnable: PropTypes.bool,
  };

  static defaultProps = {
    onPress: () => {},
    addPaymentEnable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      numshow: -1,
    };
  }

  onPress(cardId, number) {
    
    this.props.onPress(cardId);
    this.setState({ numshow: number });
    this.forceUpdate();
  }

  render() {
    const { user } = this.props || { user: {} };
    const paymentMethods = user && user.paymentMethods ? user.paymentMethods : [];
    // const cardNames = {
    //   cvc: 'CVC',
    //   cvc_amex: 'AMEX',
    //   'american-express': 'American Express',
    //   'diners-club': 'DINERS_CLUB',
    //   'master-card': 'MASTER',
    //   discover: 'DISCOVER',
    //   jcb: '',
    //   placeholder: 'Unknokow',
    //   visa: 'VISA',
    // };
    return (
      <View>
        {
          this.props.addPaymentEnable
          ?
            <SecondaryButton
              text="Add Payment Method"
              icon={iconAddPayment}
              onPress={() => {
                this.props.navigation.navigate('AddPayment');
              }}
            />
          :
            <View />
        }
        {
          paymentMethods.map((payment, key) => {
            const number = key;
            const { type } = payment;
            const icon = Icons[type];
            const text = `${payment.brand} ending ${payment.lastFour}`;
            return (
              <View key={key} style={styles.viewAction} >
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.button}
                  onPress={() => {
                    this.onPress(payment.cardId, number);
                  }}
                >
                  <Image source={icon} style={styles.icon} />
                  <Label pointerEvents="none">{text}</Label>
                  {
                    this.state.numshow === number
                    ?
                      <Image
                        source={Check}
                        style={[styles.iconRight]}
                      />
                    :
                      <Image
                        source={unCheck}
                        style={[styles.iconRight]}
                      />
                  }
                </TouchableOpacity>
              </View>
            );
          })
        }
      </View>
    );
  }
}

export default withNavigation(withTracker(() => {
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });
  return {
    user,
  };
})(PaymentMethods));
