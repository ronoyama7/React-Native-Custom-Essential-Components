
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

CustomStatusBar.defaultProps = {
  backgroundColor: '#3A28B0',
};

CustomStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
};
