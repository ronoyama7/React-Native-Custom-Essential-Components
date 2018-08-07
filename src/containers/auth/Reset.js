import React, { Component } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import NavBar from '../../components/NavBar';
import { dynamicSize } from '../../utils/DynamicSize';
import { Label } from '../../components/Text';
import { NetInfoState } from '../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    width: width - dynamicSize(40),
    height: height - dynamicSize(100),
    left: dynamicSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAction: {
    position: 'absolute',
    bottom: dynamicSize(18),
    width: width - dynamicSize(40),
    left: dynamicSize(20),
    right: dynamicSize(20),
    alignItems: 'center',
  },
  imgTick: {
    marginBottom: dynamicSize(19),
  },
});
const imgTick = require('../../assets/images/icon/Tick.png');

export class Reset extends Component {
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

  onConfirm() {
    this.props.navigation.replace('Login')
  }

  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Forgot Password" back onBack={this.props.navigation.goBack}/>
        <View style={styles.viewMain}>
          <Image style={styles.imgTick} source={imgTick} />
          <Label>
            We have sent an email to
          </Label>
          <Label>
            {this.props.email} with instructions to
          </Label>
          <Label>
            reset your password
          </Label>
        </View>
        <View style={styles.viewAction}>
          <PrimaryButton text="OK" onPress={this.onConfirm.bind(this)} />
        </View>
        <NetInfoState />
      </Animated.View>
    );
  }
}
