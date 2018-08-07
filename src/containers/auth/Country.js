import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { allCountries } from 'country-telephone-data';
import PropTypes from 'prop-types';

import NavBar from '../../components/NavBar';
import { dynamicSize } from '../../utils/DynamicSize';
import { Label } from '../../components/Text';
import { Flag } from '../../components/Flag';
import { RadioButton } from '../../components/RadioButton';
import { NetInfoState } from '../../components/NetInfoState';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
  },
  authView: {
    width: width - dynamicSize(40),
    left: dynamicSize(20),
    right: dynamicSize(20),
    top: dynamicSize(26),
    alignItems: 'center',
  },
  viewBottom: {
    position: 'absolute',
    bottom: 0,
    width: width - dynamicSize(40),
    left: dynamicSize(20),
    right: dynamicSize(20),
    alignItems: 'center',
  },
  viewTerms1: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  viewTerms2: {
    flexDirection: 'row',
    marginBottom: dynamicSize(28),
  },
  textCountry: {
    marginLeft: dynamicSize(20),
    width: 300,
  },
  radio: {
    right: 0,
    position: 'absolute',
  },
  item: {
    flexDirection: 'row',
    position: 'relative',
    height: dynamicSize(69),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    marginBottom: -0.25,
    marginTop: -0.25,
    borderColor: '#EBEBEB1E',
  },
});

export class Country extends Component {
  static propTypes = {
    selectedCountry: PropTypes.string,
  };
  static defaultProps = {
    selectedCountry: '',
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onSelect(country) {
    const { navigation } = this.props;
    if (navigation.state.params.onSelectCountry) {
      navigation.state.params.onSelectCountry(country);
    }
    // this.props.navigation.replace()
  }
  renderCountry(country) {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this.onSelect(country)}>
        <Flag code={country.iso2} />
        <Label style={styles.textCountry}>{`${country.name} +${country.dialCode}`}</Label>
        <View style={styles.radio}>
          <RadioButton animation="bounceIn" isSelected={this.props.navigation.state.params.selectedCountry === country.iso2} borderWidth={1} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const ITEM_HEIGHT = dynamicSize(68.375);
    allCountries.map((country, index) => {
      return { key: index, ...country };
    });
    const found = allCountries.find((country) => {
      return country.iso2 === this.props.navigation.state.params.selectedCountry;
    });
    const index = allCountries.indexOf(found);
    return (
      <View style={styles.container}>
        <NavBar title="Select country code" back />
        <View style={styles.viewMain}>
          <FlatList
            data={allCountries}
            initialScrollIndex={index}
            keyExtractor={(item, index) => `list-item-${index}`}
            getItemLayout={(data, index) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
            renderItem={country => this.renderCountry(country.item)} />
        </View>
        <NetInfoState />
      </View>
    );
  }
}
