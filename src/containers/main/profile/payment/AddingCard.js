import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  AsyncStorage,
} from 'react-native';
import { Circle } from 'react-native-progress';

import { Label } from '../../../../components/Text';
import { dynamicSize } from '../../../../utils/DynamicSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLoading: {
    margin: dynamicSize(16),
  },
});

const iconCheck = require('../../../../assets/images/icon/iconCheck1.png');

export class AddingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fadeAnim: new Animated.Value(0),
    };
    let director;
    try {
      AsyncStorage.getItem('Director', (err, value) => {
        if (value !== null) {
          if (value === 'summary') {
            director = 'summary';
          }
          // We have data!!
        }
        setTimeout(() => {
          this.setState({ loading: false });
          setTimeout(() => {
            this.props.navigation.pop(3);
          }, 2000);
        }, 2000);
      });
    } catch (error) {
      // Error retrieving data
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
    const viewImage = {
      position: 'absolute',
      width: dynamicSize(40),
      marginTop: dynamicSize(12),
      marginLeft: dynamicSize(6),
    };
    return (
      <Animated.View style={[styles.container, style]}>
        <View style={styles.viewLoading}>
          {
            this.state.loading ?
              <Circle size={50} indeterminate color="#CCCCCC" /> :
              <View><Circle size={50} color="#CCCCCC" /><Image style={viewImage} source={iconCheck} /></View>
          }
        </View>
        <Label>
          {
            this.state.loading ?
              'Your card is being added' :
              'Your card has been successfully added'
          }
        </Label>
      </Animated.View>
    );
  }
}
