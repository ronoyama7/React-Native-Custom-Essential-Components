import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Animated,
} from 'react-native';
import { Label } from '../../../components/Text';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { dynamicSize } from '../../../utils/DynamicSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewBottom: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    width: '60%',
    left: '20%',
    marginBottom: dynamicSize(64),
  },
  description: {
    textAlign: 'center',
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(32),
  },
  closeButton: {
    position: 'absolute',
    left: dynamicSize(32),
    top: dynamicSize(32),
  },
});

const imgLogo = require('../../../assets/images/reservation/reservation.png');
const imgClose = require('../../../assets/images/icon/iconClose.png');

export class Reservated extends Component {
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
      flex: 1,
      opacity: this.state.fadeAnim,
    };
    return (
      <Animated.View style={style}>
        <ImageBackground source={imgLogo} style={styles.container}>
          <View style={
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: 0.6,
            }
          } />
          <View style={styles.viewBottom}>
            <Label title>Thank you</Label>
            <Label style={styles.description}>
              {'Your card will be charged once your booking is confirmed.'}
            </Label>
            <PrimaryButton text="OK" onPress={() => { this.props.navigation.replace('Chat'); }} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => this.props.navigation.pop()}>
            <Image source={imgClose} />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    );
  }
}
