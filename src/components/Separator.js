import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

export const Separator = (props) => {
  const { flex, height, width, color, style } = props;
  const colorStyle = color ? { backgroundColor: color } : {};
  if (flex) {
    return <View style={[{ flex }, colorStyle, style]} />;
  }
  return <View style={[{ height, width }, colorStyle, style]} />;

};

Separator.propTypes = {
  flex: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string).isRequired,
};

Separator.defaultProps = {
  flex: 1,
  height: 1,
  width: 1,
  color: 'white',
};

export default Separator;
