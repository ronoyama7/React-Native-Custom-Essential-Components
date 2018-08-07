import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { dynamicSize, getFontSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  label: {
    fontSize: getFontSize(13),
    color: '#9B9B9B',
    lineHeight: dynamicSize(22),
  },
  span: {
    lineHeight: dynamicSize(16),
  },
  title: {
    fontSize: getFontSize(20),
    color: '#EBEBEB',
  },
  button: {
    color: '#FFFFFF',
    fontSize: getFontSize(15),
  },
  strong: {
    color: '#A99774',
  },
  error: {
    color: '#9E3333',
  },
});

export class Label extends Component {
  static propTypes = {
    style: PropTypes.number,
    title: PropTypes.bool,
    strong: PropTypes.bool,
    error: PropTypes.bool,
    button: PropTypes.bool,
    span: PropTypes.bool,
    fontSize: PropTypes.number,
    font: PropTypes.string,
  }
  static defaultProps = {
    style: 0,
    title: false,
    strong: false,
    error: false,
    button: false,
    span: false,
    fontSize: 0,
    font: 'BentonSans-Book',
    // font: 'BentonSans-Medium',
  }
  render() {
    const style = [styles.label, this.props.style];
    if (this.props.title) {
      style.push(styles.title);
    }
    if (this.props.strong) {
      style.push(styles.strong);
    }
    if (this.props.error) {
      style.push(styles.error);
    }
    if (this.props.title) {
      style.push(styles.title);
    }
    if (this.props.button) {
      style.push(styles.button);
    }
    if (this.props.span) {
      style.push(styles.span);
    }
    if (this.props.fontSize) {
      style.push({ fontSize: this.props.fontSize, lineHeight: this.props.fontSize });
    }
    style.push({ fontFamily: this.props.font });
    return (
      <Text
        {...this.props}
        style={style} />
    );
  }
}
