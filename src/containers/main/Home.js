import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Carousel from 'react-native-snap-carousel';
import PageControl from 'react-native-page-control';

import NavBar from '../../components/NavBar';
import { Label } from '../../components/Text';
import { NetInfoState } from '../../components/NetInfoState';

import { dynamicSize } from '../../utils/DynamicSize';
import { getImageUrlFromCache } from '../../utils/images';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55 + 61) - getStatusBarHeight(),
    top: 0,
  },
  bgImage: {
    width: (width * 0.9) - dynamicSize(8),
    marginLeft: dynamicSize(4),
    marginRight: dynamicSize(4),
    height: height - dynamicSize(55 + 61) - getStatusBarHeight(),
  },
  title: {
    textAlign: 'center',
    width: width * 0.7,
  },
  description: {
    marginTop: dynamicSize(20),
    textAlign: 'center',
    width: width * 0.7,
  },
  textView: {
    position: 'absolute',
    alignItems: 'center',
    bottom: dynamicSize(96),
    width: (width * 0.9) - dynamicSize(20),
  },
});

class Home extends Component {
  static defaultPropt = {
    conversation: undefined,
  }
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      carouselState: false,
      activeSlide: 1,
    };
    global.selectNumber = 0;
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500,
      },
    ).start();


    setTimeout(() => {
      this.setState({ activeSlide: 1})
    }, 1000);
  }

  renderItem({ item, index }) {
    return (
      <View key={index}>
        <ImageBackground source={{ uri: item.image }} style={styles.bgImage}>
          <View style={styles.textView}>
            <Label title style={styles.title}>{item.title}</Label>
            <Label style={styles.description}>{item.description}</Label>
          </View>
        </ImageBackground>
      </View>
    );
  }

  render() {
    const entries = this.props.homepages.map((homepage) => {
      const image = getImageUrlFromCache(homepage.imageId);
      const { title, description } = homepage;
      return { title, description, image };
    });
    const sliderWidth = width;
    const itemWidth = width * 0.9;
    const style = {
      opacity: this.state.fadeAnim,
    };

    const firstItem = 1;

    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar />
        {
          this.props.homepagesReady ?
            <View style={styles.viewMain}>
              <Carousel
                data={entries}
                renderItem={this.renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={1.0}
                onSnapToItem={index => this.setState({ activeSlide: index })}
                firstItem={firstItem}
              />
              <PageControl
                style={{ position: 'absolute', left: 0, right: 0, bottom: 10 }}
                numberOfPages={entries.length}
                currentPage={this.state.activeSlide}
                hidesForSinglePage
                pageIndicatorTintColor="gray"
                currentPageIndicatorTintColor="white"
                indicatorStyle={{ borderRadius: 5 }}
                currentIndicatorStyle={{ borderRadius: 5 }}
                indicatorSize={{ width: 6, height: 6 }}
                onPageIndicatorPress={this.onItemTap}
              />
            </View>
          :
            <View style={styles.viewMain}>
            </View>
        }
        <NetInfoState />
      </Animated.View>
    );
  }
}

export default withTracker(() => {
  const homepagesSub = Meteor.subscribe('homepages', { active: true });
  const conversationsSub = Meteor.subscribe('conversations');
  const homepages = Meteor.collection('homepages').find({ active: true });
  const conversation = Meteor.collection('conversations').findOne({ memberId: Meteor.userId() });
  return {
    homepagesReady: homepagesSub.ready(),
    conversationsReady: conversationsSub.ready(),
    homepages,
    conversation,
  };
})(Home);
