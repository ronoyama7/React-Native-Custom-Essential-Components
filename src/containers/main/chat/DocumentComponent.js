import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Pdf from 'react-native-pdf';

import { dynamicSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { NetInfoState } from '../../../components/NetInfoState';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
    width: '100%',
    left: dynamicSize(20),
  },
  pdf: {
    flex: 1,
  },
  title1: {
    marginTop: dynamicSize(67),
    marginBottom: dynamicSize(20),
  },
});

export class DocumentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      url: props.navigation.state.params.url,
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
        <NavBar title="Document" back/>
        <Pdf
          source={{ uri: this.state.url }}
          onLoadComplete={(numberOfPages,filePath)=>{
          }}
          onPageChanged={(page,numberOfPages)=>{
          }}
          onError={(error)=>{
          }}
          style={styles.pdf}
        />
        <NetInfoState />
      </Animated.View>
    );
  }
}
