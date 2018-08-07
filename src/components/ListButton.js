import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Label } from '../components/Text';

import { dynamicSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: dynamicSize(19),
  },
  iconRight: {
    position: 'absolute',
    right: 0,
    marginTop: dynamicSize(2),
  },
  viewAction: {
    height: dynamicSize(71),
    width: dynamicSize(335),
    borderColor: '#9797971F',
    borderTopWidth: dynamicSize(1),
    borderRadius: dynamicSize(4),
  },
});

const iconRight = require('../assets/images/icon/iconRight.png');

export class ListButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.number,
    borderTop: PropTypes.bool,
  }
  static defaultProps = {
    icon: null,
    borderTop: true,
  }
  render() {
    const style = {
      borderTopWidth: this.props.borderTop ? dynamicSize(1) : dynamicSize(0),
    };
    return (
      <View style={[styles.viewAction, style]} >
        <TouchableOpacity activeOpacity={0.6} style={styles.button} {...this.props}>
          <View style={styles.wrapper}>
            { this.props.icon && <Image source={this.props.icon} style={styles.icon} />}
            <Label pointerEvents="none" button>{this.props.text}</Label>
            <Image source={iconRight} style={styles.iconRight} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
