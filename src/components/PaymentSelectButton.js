import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet,CheckBox } from 'react-native';
import PropTypes from 'prop-types';
import { dynamicSize } from '../utils/DynamicSize';
import { Label } from '../components/Text';
import Icons from '../lib/react-native-credit-card-input/Icons';

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
const Check = require('../assets/images/icon/checked.png');
const unCheck = require('../assets/images/icon/unchecked.png');
export class PaymentSelectButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      visible : false,
    }
    setTimeout(() => {
      if (this.props.select.key == this.props.number) {
        this.setState({visible : true})
      } else {
        this.setState({visible : true})
      }

    },300)
  }
  
  _showCheckbox() {
    
  }

  render() {
    const { type } = this.props;
    const icon = Icons[type];
    // let clickbox;
    // if (this.props.select.key == this.props.number) {
    //   clickbox = <Image source={unCheck} style={styles.iconRight} />
    // } else {
    //   clickbox = <Image source={Check} style={styles.iconRight} />
    // }
    return (
      <View style={styles.viewAction} >
        <TouchableOpacity activeOpacity={0.6} style={styles.button} {...this.props} >
          <Image source={icon} style={styles.icon} />
          <Label pointerEvents="none">{this.props.text}</Label>
          {this.props.select.key == this.props.number?<Image source={Check} style={styles.iconRight} />:<Image source={unCheck} style={styles.iconRight} />}
        </TouchableOpacity>
      </View>
    );
  }
}
