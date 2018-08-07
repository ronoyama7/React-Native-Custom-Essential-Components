import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

const check1 = require('../assets/images/icon/iconCheck1.png');
const check2 = require('../assets/images/icon/iconCheck2.png');

export class RadioButton extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    isSelected: false,
    onPress: () => null,
  }

  render() {
    const { isSelected, onPress } = this.props;

    return (
      <TouchableOpacity style={[styles.radio]} onPress={onPress}>
        <Image source={isSelected ? check1 : check2} />
      </TouchableOpacity>
    );
  }
}
