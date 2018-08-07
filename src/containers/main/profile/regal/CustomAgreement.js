import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Animated,
  WebView,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { dynamicSize } from '../../../../utils/DynamicSize';
import NavBar from '../../../../components/NavBar';
import { NetInfoState } from '../../../../components/NetInfoState';


const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
    width,
    left: dynamicSize(20),
    backgroundColor: '#FF0000',
  },
  webView: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
    width,
  },
  title1: {
    marginTop: dynamicSize(67),
    marginBottom: dynamicSize(20),
  },
});

export class CustomAgreement extends Component {
  constructor(props) {
    super(props);
    let quote;
    this.state = {
      fadeAnim: new Animated.Value(0),
      quote: props.navigation.state.params.quote
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
      <Animated.View style={styles.container}>
        <NavBar title="Rental agreement" back />
        <WebView style={styles.webView} source={{ html: this.state.quote.agreement }} />
        <NetInfoState />
      </Animated.View>
    );
  }
}
