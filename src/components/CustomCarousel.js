/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { dynamicSize } from '../utils/DynamicSize';
import Carousel from 'react-native-snap-carousel';
import PageControl from 'react-native-page-control';

const { Width, Height } = Dimensions.get('window');

export default class CustomCarousel extends Component {
    constructor(Props){
        super(Props);
        this.state = {
            activeSlide: 0,
        };
    }

  render() {
    return (
        <View style={styles.container}>
        <Carousel
          data={this.props.data}
          renderItem={this.props.renderItem}
          sliderWidth={this.props.sliderWidth}
          itemWidth={this.props.itemWidth}
          inactiveSlideScale={1.0}
          onSnapToItem={index => {this.setState({activeSlide: index}); }}
        >
        </Carousel>
        <PageControl
          style={{ position: 'absolute',top:dynamicSize(290), left: 0, right: 0, bottom: 10 }}
          numberOfPages={this.props.data.length}
          currentPage={this.state.activeSlide}
          hidesForSinglePage
          pageIndicatorTintColor="gray"
          currentPageIndicatorTintColor="white"
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 5 }}
          indicatorSize={{ width: 5, height: 5 }}
          onPageIndicatorPress={this.onItemTap}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: dynamicSize(305),
        // borderColor: '#0f0',
        // borderWidth: 2,
    },

});
