import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import IconBadge from 'react-native-icon-badge';
import Meteor, { withTracker } from 'react-native-meteor';

import { dynamicSize } from '../utils/DynamicSize';

const styles = StyleSheet.create({
  tabView: {
    position: 'absolute',
    backgroundColor: '#000000',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    height: dynamicSize(60),
    backgroundColor: '#000000',
    flexDirection: 'row',
  },
  tabItem: {
    height: dynamicSize(60),
    flex: 1 / 3,
  },
  tabItemOpacity: {
    height: dynamicSize(60),
    flex: 1 / 3,
    opacity: 0.4,
  },
  tabImage: {
    height: dynamicSize(24),
    width: dynamicSize(24),
    resizeMode: 'contain',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const iconHome = require('../assets/images/icon/iconHome.png');
const iconChat = require('../assets/images/icon/iconChat.png');
const iconProfile = require('../assets/images/icon/iconProfile.png');

export class TabBar extends Component {
  navigateToHome() {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('Home');
  }
  navigateToChat() {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('Chat');
  }
  navigateToProfile() {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('Profile');
  }
  render() {
    const { messages } = this.props;
    const unreadCount = messages ? messages.length : 0;
    return (
      <View style={styles.tabView}>
        <View style={styles.tabBar} >
          <TabItem
            select={
              this.props.navigation.state.index === 0
            }
            icon={iconHome}
            onPress={this.navigateToHome.bind(this)}
            />
          <TabItem
            select={this.props.navigation.state.index === 1}
            icon={iconChat}
            onPress={this.navigateToChat.bind(this)}
            count={unreadCount}
            />
          <TabItem
            select={this.props.navigation.state.index === 2}
            icon={iconProfile}
            onPress={this.navigateToProfile.bind(this)}
            />
        </View>
      </View>
    );
  }
}
class TabItem extends Component {
  static propTypes = {
    icon: PropTypes.number.isRequired,
    count: PropTypes.number,
    select: PropTypes.bool,
  }
  static defaultProps = {
    count: 0,
    select: false,
  }
  render() {
    const { count, select } = this.props;
    return (
      <View style={select ? styles.tabItem : styles.tabItemOpacity}>
        <TouchableOpacity style={styles.tabButton} {...this.props}>
          <IconBadge
            MainElement={<Image style={styles.tabImage} source={this.props.icon} />}
            BadgeElement={<Text style={{ color: '#FFFFFF' }}>{count}</Text>}
            IconBadgeStyle={{ left: dynamicSize(12), top: dynamicSize(-12) }}
            Hidden={count === 0}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default withTracker(() => {
  const messages = Meteor.collection('messages').find({ userFrom: { $ne: Meteor.userId() }, seenAt: { $exists: false } }, { fields: { _id: true } });
  return {
    messages,
  };
})(TabBar);
