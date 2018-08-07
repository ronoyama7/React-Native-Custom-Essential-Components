import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Linking,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { dynamicSize } from '../../../../utils/DynamicSize';
import NavBar from '../../../../components/NavBar';
import { ListButton } from '../../../../components/ListButton';
import { NetInfoState } from '../../../../components/NetInfoState';


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55 + 72) - getStatusBarHeight(),
    width,
    alignItems: 'center',
  },
});

export class Legal extends Component {
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
        <NavBar title="Support" back />
        <View style={styles.viewMain} >
          <ListButton text="About ROLZO" borderTop={false} onPress={() => { Linking.openURL('https://rolzo.com/'); }} />
          <ListButton text="FAQ" onPress={() => { this.props.navigation.navigate('RentalAgreement'); }} />
          <ListButton text="Terms of Service" onPress={() => { this.props.navigation.navigate('Terms'); }} />
          <ListButton text="Privacy Policy" onPress={() => { this.props.navigation.navigate('Terms'); }} />
        </View>

        <NetInfoState />
      </Animated.View>
    );
  }
}
