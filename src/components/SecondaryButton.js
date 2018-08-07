import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { dynamicSize } from '../utils/DynamicSize';
import { Label } from '../components/Text';

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

const iconRight = require('../assets/images/icon/iconRight.png');

export class SecondaryButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
  }
  render() {
    return (
      <View style={styles.viewAction} >
        <TouchableOpacity activeOpacity={0.6} style={styles.button} {...this.props}>
          <Image source={this.props.icon} style={styles.icon} />
          <Label pointerEvents="none">{this.props.text}</Label>
          <Image source={iconRight} style={styles.iconRight} />
        </TouchableOpacity>
      </View>
    );
  }
}
