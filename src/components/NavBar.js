import React, { Component } from 'react';
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import NavigationBar from 'react-native-navbar';
import { withNavigation } from 'react-navigation';
import { Label } from '../components/Text';
import { dynamicSize, getFontSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  navBar: {
    height: dynamicSize(54),
    backgroundColor: '#000000',
  },
  line: {
    backgroundColor: '#FFFFFF1A',
    height: 0,
  },
  btnBack: {
    justifyContent: 'center',
    paddingLeft: dynamicSize(16),
    paddingRight: dynamicSize(16),
  },
  logo: {
    width: dynamicSize(160),
    height: dynamicSize(20),
    margin: dynamicSize(15),
  },
  title: {
    bottom: 8,
    position: 'absolute',
    fontSize: getFontSize(15),
    fontFamily: 'BentonSans-Medium',
  },
});

const imgLogo = require('../assets/images/logo/Logo.png');

const titleConfig = (title) => {
  if (title) {
    return (
      <Label button style={styles.title}>{title}</Label>
    );
  }
  return (
    <Image style={styles.logo} source={imgLogo} />
  );
};

const statusBarConfig = {
  style: 'light-content',
  tintColor: '#000000',
};
const backIcon = require('../assets/images/icon/iconBack.png');

class NavBar extends Component {
  static propTypes = {
    title: PropTypes.string,
    back: PropTypes.bool,
    rightButton: PropTypes.any,
    onBack: PropTypes.func,
    navigation: PropTypes.object,
  }
  static defaultProps = {
    back: false,
    title: '',
    rightButton: null,
    navigation: {},
  }
  render() {
    const attr = {};
    if (this.props.back) {
      attr.leftButton = (
        <TouchableHighlight
          onPress={
            this.props.onBack ||
            (() => { this.props.navigation.goBack(); })
          }
          style={styles.btnBack}
        >
          <Image source={backIcon} />
        </TouchableHighlight>
      );
      if (this.props.rightButton) {
        attr.rightButton = this.props.rightButton;
      }
    }
    return (
      <View>
        <NavigationBar
          {...attr}
          style={styles.navBar}
          title={titleConfig(this.props.title)}
          statusBar={statusBarConfig}
          tintColor="transparent" />
      </View>
    );
  }
}

export default withNavigation(NavBar);
