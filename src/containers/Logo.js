import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { dynamicSize } from '../utils/DynamicSize';
import { saveImage2Cache } from '../utils/images';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgLogo: {
    width: dynamicSize(310),
    resizeMode: 'contain',
  },
});

const imgLogo = require('../assets/images/logo/Logo.png');

export class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      ready: false,
      imagesAreDownloading: false,
    };
  }
  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500,
      },
    ).start();
  }
  shouldComponentUpdate(nextProps, nextState) {
    const {
      memberReady,
      introsReady,
      homepagesReady,
      user,
    } = this.props;
    return (
      memberReady !== nextProps.memberReady ||
      introsReady !== nextProps.introsReady ||
      homepagesReady !== nextProps.homepagesReady ||
      user !== nextProps.user ||
      this.state.ready !== nextState.ready
    );
  }
  componentWillUnmount() {
  }
  downloadImages(intros, homepages) {
    this.setState({ imagesAreDownloading: true });
    const introsPromises = intros.map((homepage) => {
      return saveImage2Cache(homepage.imageId);
    });
    const homepagesPromises = homepages.map((intro) => {
      return saveImage2Cache(intro.imageId);
    });

    Promise.all(introsPromises.concat(homepagesPromises)).then((values) => {
      this.setState({ ready: true });
    });
  }
  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };

    const {
      memberReady,
      introsReady,
      homepagesReady,
      homepages,
      intros,
    } = this.props;
    if (
      memberReady &&
      introsReady &&
      homepagesReady &&
      !this.state.ready &&
      !this.state.imagesAreDownloading
    ) {
      this.downloadImages(intros, homepages);
    }

    if (this.state.ready) {
      const user = Meteor.user();
      if (user && user.phoneVerification.verified) {
        this.props.navigation.navigate('AppStack');
      } else if (user && !user.phoneVerification.verified) {
        this.props.navigation.navigate('Verify');
      } else {
        this.props.navigation.navigate('AuthStack');
      }
    }
    return (
      <Animated.View style={[styles.container, style]}>
        <Image source={imgLogo} style={styles.imgLogo} />
      </Animated.View>
    );
  }
}

export default withTracker(() => {
  const userId = Meteor.userId();
  const memberSub = Meteor.subscribe('members', {});
  const introSub = Meteor.subscribe('intros', {});
  const homepageSub = Meteor.subscribe('homepages', {});
  return {
    memberReady: memberSub.ready(),
    homepagesReady: homepageSub.ready(),
    introsReady: introSub.ready(),
    user: userId ? Meteor.collection('users').findOne({ _id: userId }) : {},
    homepages: Meteor.collection('homepages').find({ active: true }),
    intros: Meteor.collection('intros').find({ active: true }),
  };
})(Logo);
