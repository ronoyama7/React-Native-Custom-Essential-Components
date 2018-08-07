import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';

import { Label } from '../../../components/Text';
import { dynamicSize } from '../../../utils/DynamicSize';

const styles = StyleSheet.create({
  viewSwiper: {
    height: dynamicSize(225),
  },
  dots: {
    bottom: 0,
  },

  viewTitle: {
    marginTop: dynamicSize(35),
    marginBottom: dynamicSize(24),
  },
  viewSelfDrive: {
    width: dynamicSize(85),
    height: dynamicSize(27),
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: dynamicSize(13.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicSize(10),
  },
  viewChauffeurDrive: {
    width: dynamicSize(125),
    height: dynamicSize(27),
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: dynamicSize(13.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicSize(10),
  },
  txtTitle: {
    height: dynamicSize(30),
    paddingTop: dynamicSize(8),
  },
  viewDescription: {
    paddingTop: dynamicSize(16),
  },

  serviceView: {
    marginTop: dynamicSize(20),
  },
  subTitle: {
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(10),
  },
  price: {
    position: 'absolute',
    right: 0,
  },
  price2: {
    position: 'absolute',
    right: 0,
    paddingTop: 12,
  },
  fee: {
    marginTop: dynamicSize(15),
    paddingBottom: dynamicSize(15),
    borderBottomColor: '#EBEBEB1F',
    borderBottomWidth: 1,
  },
  hide: {
    display: 'none',
  },
});

function numberWithCommas(x) {
  const parts = parseFloat(x).toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function RenderTitle(props) {
  const { make, model, description, serviceMode } = props;
  let renderDescription = null;
  // change mode spell
  const changedServiceMode = serviceMode === 'selfDrive' ? 'Self Drive' : 'Chauffeur Drive';
  if (description) {
    renderDescription = (
      <View style={styles.viewDescription}>
        <Label button>{description}</Label>
      </View>
    );
  }
  return (
    <View style={styles.viewTitle}>
      <View style={serviceMode === 'selfDrive' ? styles.viewSelfDrive : styles.viewChauffeurDrive}>
        <Label>{changedServiceMode}</Label>
      </View>
      <View style={styles.txtTitle}>
        <Label title fontSize={24}>{make}</Label>
      </View>
      <View style={styles.txtTitle}>
        <Label title fontSize={24}>{model}</Label>
      </View>
      {renderDescription}
    </View>
  );
}

RenderTitle.propTypes = {
  make: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  serviceMode: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export function RenderVehicle(props) {
  const { carImages } = props;
  return (
    <Swiper
      style={styles.viewSwiper}
      loop={false}
      showsButtons={false}
      dot={<View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 5, height: 5, borderRadius: 3, marginLeft: 3, marginRight: 3 }} />}
      activeDot={<View style={{ backgroundColor: '#fff', width: 5, height: 5, borderRadius: 3, marginLeft: 3, marginRight: 3 }} />}
      paginationStyle={styles.dots} >
      {
        carImages.map((imag, index) => {
          return <Image key={index} source={{ uri: imag }} style={{ width: '100%', height: dynamicSize(190) }} />;
        })
      }
    </Swiper>
  );
}
RenderVehicle.propTypes = {
  carImages: PropTypes.array.isRequired,
};

export function RenderFee(props) {
  const { days, depositFee, daily, description, currency, serviceMode } = props;
  const tatalFee = parseInt(depositFee, 10) + (parseInt(daily, 10) * parseInt(days, 10));
  return (
    <View>
      <View style={serviceMode === 'selfDrive' ? null : styles.hide}>
        <View style={styles.serviceView}>
          <Label strong font="BentonSans-Medium">DEPOSIT</Label>
        </View>
        {depositFee &&
          <View style={styles.subTitle}>
            <Label button>Refundable Security Deposit</Label>
            <Label button style={styles.price}>{`${numberWithCommas(depositFee)} ${currency}`}</Label>
          </View>
        }
        {description &&
          <View>
            <Label>{description}</Label>
          </View>
        }
      </View>
      <View>
        <View style={styles.serviceView}>
          <Label strong font="BentonSans-Medium">BOOKING</Label>
        </View>
        {numberWithCommas(daily) &&
          <View style={[styles.fee, styles.bottomLine]}>
            <Label button>Daily Fee</Label>
            <Label button style={styles.price}>{`${numberWithCommas(daily)} ${currency}`}</Label>
          </View>
        }
        {days &&
          <View style={[styles.fee, styles.bottomLine]}>
            <Label button>Reservation Period</Label>
            <Label button style={styles.price}>{days} days</Label>
          </View>
        }
        {numberWithCommas(tatalFee) &&
          <View style={[styles.fee, styles.bottomLine]}>
            <Label button>Total Reservation Fee</Label>
            <Label>Including VAT</Label>
            <Label title style={styles.price2}>{`${numberWithCommas(tatalFee)} ${currency}`}</Label>
          </View>
        }
      </View>
    </View>
  );
}
RenderFee.propTypes = {
  depositFee: PropTypes.string.isRequired,
  days: PropTypes.string.isRequired,
  daily: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  serviceMode: PropTypes.string.isRequired,
};
