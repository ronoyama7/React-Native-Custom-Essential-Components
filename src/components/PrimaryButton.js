import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { dynamicSize } from '../utils/DynamicSize';
import { Label } from '../components/Text';

const styles = StyleSheet.create({
  button: {
    height: dynamicSize(60),
    width: dynamicSize(335),
    backgroundColor: '#000000',
    borderRadius: dynamicSize(4),
  },
  viewAction: {
    position: 'relative',
    height: dynamicSize(60),
    width: dynamicSize(335),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dynamicSize(18),
  },
  viewEnable: {
    flex: 1,
    opacity: 1.0,
  },
  viewDisable: {
    flex: 1,
    opacity: 0.2,
  },
  buttonEnable: {
    backgroundColor: '#A79779',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisable: {
    backgroundColor: '#EBEBEB7F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class PrimaryButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  }
  static defaultProps = {
    disabled: false,
  }
  render() {
    return (
      <View
        style={[styles.viewAction, (this.props.disabled ? styles.viewDisable : styles.viewEnable)]}
        >
        <TouchableOpacity
          {...this.props}
          activeOpacity={0.6}
          style={[styles.button,
            (this.props.disabled ? styles.buttonDisable : styles.buttonEnable)]}
        >
          <Label
            pointerEvents="none"
            font="BentonSans-Book"
            style={styles.label}
            button
          >
            {this.props.text}
          </Label>
        </TouchableOpacity>
      </View>
    );
  }
}
