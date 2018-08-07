import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { dynamicSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  input: {
    fontSize: dynamicSize(15),
    fontFamily: 'BentonSans-Book',
    backgroundColor: '#000000',
    color: '#EBEBEB',
    borderWidth: dynamicSize(0.3),
    width: dynamicSize(335),
    height: dynamicSize(58),
    paddingLeft: dynamicSize(22),
    marginBottom: dynamicSize(-1),
    marginTop: dynamicSize(-1),
  },
  input1: {
    // borderTopLeftRadius: dynamicSize(6),
    // borderTopRightRadius: dynamicSize(6),
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  input2: {
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  input3: {
    // borderBottomLeftRadius: dynamicSize(6),
    // borderBottomRightRadius: dynamicSize(6),
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  input4: {
    borderRadius: dynamicSize(4),
  },
  inputNumber: {
    fontSize: dynamicSize(15),
    fontFamily: 'BentonSans-Book',
    backgroundColor: '#000000',
    color: '#EBEBEB',
    borderWidth: dynamicSize(0.5),
    width: dynamicSize(48),
    height: dynamicSize(58),
    paddingLeft: dynamicSize(22),
    marginBottom: dynamicSize(-1),
    marginTop: dynamicSize(-1),
  },
  inputNumber1: {
    // borderTopLeftRadius: dynamicSize(4),
    // borderBottomLeftRadius: dynamicSize(4),
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  inputNumber2: {
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  inputNumber3: {
    // borderTopRightRadius: dynamicSize(4),
    // borderBottomRightRadius: dynamicSize(4),
    borderTopLeftRadius: dynamicSize(0),
    borderTopRightRadius: dynamicSize(0),
    borderBottomLeftRadius: dynamicSize(0),
    borderBottomRightRadius: dynamicSize(0),
  },
  inputInActive: {
    borderColor: '#1D1D1D',
    zIndex: 0,
  },
  inputActive: {
    borderColor: '#A5977C',
    zIndex: 1,
  },
});

export class CustomeInput extends Component {
  static propTypes = {
    pos: PropTypes.number.isRequired,
    onFocused: PropTypes.func,
  }
  static defaultProps = {
    onFocused: () => {},
  }
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  render() {
    const inputs = [styles.input1, styles.input2, styles.input3, styles.input4];
    return (
      <TextInput
        {...this.props}
        placeholderTextColor={this.state.selected ? '#4A4A4A' : '#9B9B9B'}
        underlineColorAndroid="transparent"
        style={[
          styles.input,
          inputs[this.props.pos],
          (this.state.selected ? styles.inputActive : styles.inputInActive)
        ]}
        onFocus={(e) => { this.setState({ selected: true }); this.props.onFocused(e); }}
        onBlur={() => this.setState({ selected: false })}
      />
    );
  }
}

export class NumberInput extends Component {
  static propTypes = {
    pos: PropTypes.number.isRequired,
    onFocused: PropTypes.func,
    keyboardType: PropTypes.string,
  }
  static defaultProps = {
    onFocused: () => {},
    keyboardType: 'numeric',
  }
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  focus() {
    this.input.focus();
  }
  render() {
    const inputs = [styles.inputNumber1, styles.inputNumber2, styles.inputNumber3];
    return (
      <TextInput
        {...this.props}
        ref={ref => this.input = ref}
        placeholderTextColor={this.state.selected ? '#4A4A4A' : '#9B9B9B'}
        underlineColorAndroid="transparent"
        maxLength={1}
        style={[
          styles.inputNumber,
          inputs[this.props.pos],
          (this.state.selected ? styles.inputActive : styles.inputInActive)]}
        onFocus={(e) => { this.setState({ selected: true }); this.props.onFocused(e); }}
        onBlur={() => this.setState({ selected: false })}
      />
    );
  }
}
