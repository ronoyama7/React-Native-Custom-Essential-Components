import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Flags from './FlagResource';
import { dynamicSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  image: {
    width: dynamicSize(28),
    height: dynamicSize(28),
    resizeMode: 'contain',
  },
});

export class Flag extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Image
        style={styles.image}
        source={Flags.get(this.props.code)}
      />
    );
  }
}
