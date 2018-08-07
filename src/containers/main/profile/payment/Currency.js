import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ListView,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import PropTypes from 'prop-types';
import Meteor from 'react-native-meteor';

import NavBar from '../../../../components/NavBar';
import { dynamicSize } from '../../../../utils/DynamicSize';
import { Label } from '../../../../components/Text';
import { Flag } from '../../../../components/Flag';
import { RadioButton } from '../../../../components/RadioButton';
import { NetInfoState } from '../../../../components/NetInfoState';

export const allCountries = [
  [
    'Pound Sterling (£)',
    'gb',
    'GBP',
  ],
  [
    'Euros (£)',
    'eu',
    'EUR',
  ],
  [
    'United States dollar ($)',
    'us',
    'USD',
  ],
  [
    'Emirati dirham (د.إ)',
    'ae',
    'AED',
  ],
  [
    'Swiss Franc (CHF)',
    'ch',
    'CHF',
  ],
  [
    'Chinese yuan (¥)',
    'cn',
    'eu',
  ],
  [
    'Brazilian real (R$)',
    'br',
    'BRL',
  ],
];

// we will build this in the loop below

for (let i = 0; i < allCountries.length; i++) {
// countries
  const c = allCountries[i];
  allCountries[i] = {
    name: c[0],
    iso2: c[1],
    code: c[2],
  };
}


const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
  },
  textCountry: {
    marginLeft: dynamicSize(20),
    width: dynamicSize(300),
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
    borderBottomWidth: 1,
    borderColor: '#EBEBEB1F',
  },
});

export class Currency extends Component {
  static propTypes = {
  };

  onSelect(country) {
    Meteor.call('setCurrency', country);
    this.props.navigation.goBack();
  }

  renderCountry(country) {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this.onSelect(country)}>
        <Flag code={country.iso2} />
        <Label style={styles.textCountry}>{`${country.name}`}</Label>
        <View style={styles.radio}>
          <RadioButton animation="bounceIn" isSelected={this.props.navigation.state.params.country.code === country.code} borderWidth={1} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(allCountries);
    return (
      <View style={styles.container}>
        <NavBar title="Select country code" back />
        <View style={styles.viewMain}>
          <ListView
            removeClippedSubviews={false}
            dataSource={dataSource}
            renderRow={country => this.renderCountry(country)} />
          }
        </View>
        <NetInfoState />
      </View>
    );
  }
}
