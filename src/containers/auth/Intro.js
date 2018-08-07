import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';
import Meteor, { withTracker } from 'react-native-meteor';

import { dynamicSize } from '../../utils/DynamicSize';
import { getImageUrlFromCache } from '../../utils/images';
import { Label } from '../../components/Text';
import Login from '../../containers/auth/Login';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  imageView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  textView: {
    position: 'absolute',
    alignItems: 'center',
    bottom: dynamicSize(120),
    width: '78%',
  },
  image: {
    width,
    height,
  },
  description: {
    marginTop: dynamicSize(10),
    textAlign: 'center',
  },
  viewLogin: {
    position: 'absolute',
    height: dynamicSize(40),
    width: (width / 4),
    right: dynamicSize(20),
    bottom: dynamicSize(25),
  },
});

class Intro extends Component {
  static propTypes = {
    intros: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // index: 0,
      fadeAnim: new Animated.Value(0),
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

  onIndexChanged(index) {
    // this.setState({ index });
    if (index === this.props.intros.length) {
      this.props.navigation.replace('Login');
    }
  }

  renderItem(image, titleText, description) {
    return (
      <View style={styles.slide}>
        <View style={styles.imageView}>
          <Image resizeMode="cover" style={styles.image} source={{ uri: image }} />
        </View>
        <View style={styles.textView}>
          <Label title>{titleText}</Label>
          <Label style={styles.description}>{description}</Label>
        </View>
      </View>
    );
  }

  render() {
    const style = {
      opacity: this.state.fadeAnim,
      flex: 1,
    };
    const dotStyle = { backgroundColor: 'rgba(255,255,255,.3)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3 };
    const activeDotStyle = { backgroundColor: '#fff', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3 };
    // if (this.state.index === 4) {
    //   dotStyle.backgroundColor = 'transparent';
    //   activeDotStyle.backgroundColor = 'transparent';
    // }

    const introsItems = this.props.intros.map((intro, index) => {
      return this.renderItem(getImageUrlFromCache(intro.imageId), intro.title, intro.description);
    });
    if (introsItems.length > 0) {
      introsItems.push(<Login key={this.props.intros.length} />);
    }
    return (
      <Animated.View style={style}>
        <Swiper
          key={this.props.intros.length}
          onIndexChanged={this.onIndexChanged.bind(this)}
          loop={false}
          showsButtons={false}
          dot={<View style={dotStyle} />}
          activeDot={<View style={activeDotStyle} />}
          paginationStyle={{
            bottom: 48,
          }} >
          {introsItems}
        </Swiper>
      </Animated.View>
    );
  }
}

export default withTracker(() => {
  const introsSub = Meteor.subscribe('intros', { active: true });

  return {
    introsReady: introsSub.ready(),
    intros: Meteor.collection('intros').find({ active: true }),
  };
})(Intro);
