import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { dynamicSize } from '../../../../utils/DynamicSize';
import NavBar from '../../../../components/NavBar';
import TabBar from '../../../../components/Tab';
import { SecondaryButton } from '../../../../components/SecondaryButton';
import { NetInfoState } from '../../../../components/NetInfoState';

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
  viewMethod: {
    marginTop: dynamicSize(32),
    marginBottom: dynamicSize(8),
  },
});

const iconCredit = require('../../../../assets/images/icon/iconCredit.png');
// const iconBitcoin = require('../../../../assets/images/icon/iconBitcoin.png');

export class AddPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Payment" back />
        <View style={styles.viewMain} >
          <View style={styles.viewMethod}>
            <SecondaryButton
              text="Credit card"
              icon={iconCredit}
              onPress={() => { this.props.navigation.navigate('AddCard'); }} />
          </View>
          {/* <SecondaryButton
            text="Bitcoin"
            icon={iconBitcoin}
            onPress={() => {}} /> */}
        </View>

        <NetInfoState />
      </Animated.View>
    );
  }
}
