import React, { Component } from 'react';
import {
  View,
  Image,
  ListView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import Meteor, { createContainer } from 'react-native-meteor';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PropTypes from 'prop-types';

import { getImageUrl } from '../../../utils/images';
import { dynamicSize } from '../../../utils/DynamicSize';
import NavBar from '../../../components/NavBar';
import { Label } from '../../../components/Text';
import { NetInfoState } from '../../../components/NetInfoState';

const moment = require('moment');

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewEmpty: {
    height: height - dynamicSize(55 + 61) - getStatusBarHeight(),
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMain: {
    height: height - dynamicSize(55 + 61) - getStatusBarHeight(),
    width,
    alignItems: 'center',
  },
  iconWrapper: {
    width: dynamicSize(50),
    height: dynamicSize(50),
    padding: dynamicSize(15),
    borderRadius: dynamicSize(25),
    backgroundColor: '#A79779',
    marginTop: dynamicSize(22),
  },
  icon: {
    marginTop: dynamicSize(2),
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  list: {
    flex: 1,
  },
  reservation: {
    height: dynamicSize(300),
  },
  title: {
    marginTop: dynamicSize(36),
    marginLeft: dynamicSize(42),
  },
  date: {
    marginLeft: dynamicSize(42),
    marginBottom: dynamicSize(8),
  },
  image: {
    marginBottom: dynamicSize(18),
    width: dynamicSize(305),
    height: dynamicSize(181),
    marginLeft: dynamicSize(42),
  },
  styleLine: {
    position: 'absolute',
    overflow: 'visible',
    marginLeft: dynamicSize(10),
    marginRight: dynamicSize(10),
    top: dynamicSize(64),
    bottom: dynamicSize(64),
    width: dynamicSize(10.6),
    height: dynamicSize(296),
  },
  carImageOpacity: {
    opacity: 0.5
  }
});

const iconChat = require('../../../assets/images/icon/iconChat.png');
const car1 = require('../../../assets/images/cars/car1.png');
const car2 = require('../../../assets/images/cars/car2.png');
const car3 = require('../../../assets/images/cars/car3.png');

const reservations = [
  {
    car: car1,
    name: 'Aston Martin, DB11',
    date: '23 Oct 17 – 05 Nov 17',
  },
  {
    car: car2,
    name: 'Lamborghini, Huracan',
    date: '06 Sep 17 – 25 Sep 17',
  },
  {
    car: car3,
    name: 'Bugatti, Veyron',
    date: '02 Jul 17 – 23 Jul 17',
  },
];
const line1 = require('../../../assets/images/reservation/leftLine1.png');
const line2 = require('../../../assets/images/reservation/leftLine2.png');

class Reservations extends Component {
  static propTypes = {
    reservations: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(reservations),
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

  onSelect(id, reservation) {
    this.props.navigation.navigate('Reservation', reservation);
  }

  renderEmpty() {
    return (
      <View style={styles.viewEmpty} >
        <Label>Make a reservation by sending a</Label>
        <Label>message to your concierge</Label>
        <View style={styles.iconWrapper}>
          <Image style={styles.icon} source={iconChat} />
        </View>
      </View>
    );
  }
  renderFirstLine() {
    return (
      <Image style={styles.styleLine} source={line1} />
    );
  }
  renderTimeLine() {
    return (
      <Image style={styles.styleLine} source={line2} />
    );
  }
  renderReservation(reservation, sectionID, rowID) {
    const opacity = reservation.status === 'pending';

    return (
      <View style={styles.reservation}>
        <TouchableOpacity
          style={opacity ? styles.carImageOpacity : {}}
          onPress={() => this.onSelect(sectionID, reservation)}
        >
          <Label title style={styles.title}>{reservation.name}</Label>
          <Label style={styles.date}>{reservation.date}</Label>
          <Image style={styles.image} source={reservation.car} />
        </TouchableOpacity>
        { rowID === '0' ? this.renderFirstLine() : this.renderTimeLine()}
      </View>
    );
  }
  renderScrollComponent(props) {
    return (
      <ScrollView indicatorStyle="white" {...props} />
    );
  }
  renderReservations(reservations) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const mappedReservations = reservations.map((reservation) => {
      const vehicle = Meteor.collection('vehicles').findOne({ _id: reservation.vehicleId });
      const vehicleImageUrl = getImageUrl(vehicle.imageIds[0]);

      const startDate = moment(`${reservation.delivery.date}`, 'ddd MMM DD YYYY hh:mm:ss GMT').format('DD MMM YY');
      const endDate = moment(`${reservation.collection.date}`, 'ddd MMM DD YYYY hh:mm:ss GMT').format('DD MMM YY');
      const { status } = reservation;
      return {
        car: { uri: vehicleImageUrl },
        name: `${vehicle.make}, ${vehicle.model}`,
        date: `${startDate} - ${endDate}`,
        status,
        reservation,
      };
    });
    const dataSource = ds.cloneWithRows(mappedReservations);
    if (mappedReservations.length > 0) {
      return (
        <View style={styles.viewMain} >
          <ListView
            renderScrollComponent={this.renderScrollComponent.bind(this)}
            style={styles.list}
            dataSource={dataSource}
            renderRow={this.renderReservation.bind(this)}
          />
        </View>
      );
    }
    return (
      <View style={styles.viewEmpty} >
        <Label>Simply message your concierge to</Label>
        <Label>request your first car</Label>
        <View style={styles.iconWrapper}>
          <TouchableOpacity
            onPress={() => {
              // Actions.popTo('home');
              // Actions.jump('chat');
              this.props.navigation.popToTop();
            }}
            accessible={false}
          >
            <Image style={styles.icon} source={iconChat} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    // const data = [
    //   { time: '', title: 'Aston Martin, DB11', description: reservations[0] },
    //   { time: '', title: 'Lamborghini, Huracan', description: reservations[1] },
    //   { time: '', title: 'Bugatti, Veyron', description: reservations[2] },
    // ];
    const style = {
      opacity: this.state.fadeAnim,
    };

    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="Reservations" back/>
        {/* { this.renderEmpty() } */}
        { this.props.ready && this.renderReservations(this.props.reservations) }
        {/* <Timeline
          separator={false}
          data={data}
          renderDetail={this.renderReservation.bind(this)}
          rowContainerStyle={{}}
        /> */}

        <NetInfoState />
      </Animated.View>
    );
  }
}

export default createContainer(() => {
  const sub = Meteor.subscribe('reservations', { memberId: Meteor.userId() });
  const reservations = Meteor.collection('reservations').find({ memberId: Meteor.userId() }, { sort: { createdAt: -1 } });
  const user = Meteor.collection('users').findOne({ _id: Meteor.userId() });
  return {
    ready: sub.ready(),
    reservations: reservations || [],
    user: user || [],
  };
}, Reservations);
