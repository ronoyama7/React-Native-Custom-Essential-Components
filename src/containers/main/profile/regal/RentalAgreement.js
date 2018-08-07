import React, { Component } from 'react';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { dynamicSize } from '../../../../utils/DynamicSize';
import NavBar from '../../../../components/NavBar';
import { Label } from '../../../../components/Text';
import { NetInfoState } from '../../../../components/NetInfoState';


const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  viewMain: {
    height: height - dynamicSize(55) - getStatusBarHeight(),
    width: dynamicSize(335),
    left: dynamicSize(20),
  },
  title1: {
    marginTop: dynamicSize(67),
    marginBottom: dynamicSize(20),
  },
  title2: {
    marginTop: dynamicSize(30),
    marginBottom: dynamicSize(20),
  },
  text: {
    marginBottom: dynamicSize(20),
  },
  text2: {
    marginBottom: dynamicSize(40),
  },
});

export class RentalAgreement extends Component {
  constructor() {
    super();
    this.state = {
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

  render() {
    const style = {
      opacity: this.state.fadeAnim,
    };
    return (
      <Animated.View style={[styles.container, style]}>
        <NavBar title="FAQ" back />
        <ScrollView style={styles.viewMain} indicatorStyle="white">
          <Label button style={styles.title1} font="BentonSans-Medium">1. ROLZO Services</Label>
          <Label span style={styles.text}>
            {'The ROLZO Services constitute a technology platform, including but not limited to, mobile applications and websites (collectively, the “ROLZO Applications”), that connects users of the ROLZO Services who desire to rent vehicles (“Members”) with owners (including car rental agencies and individual owners) who have vehicles available for rent (“Affiliates”), facilitating the online search for potential vehicles to rent, and coordinating the associated pricing, contractual and delivery arrangements. ROLZO acts as an interactive computer service provider. ROLZO serves as a conduit or platform to connect Members desiring vehicle rental services and Affiliates desiring to provide such vehicle rental services. Any and all vehicle rental services provided by an Affiliate to a Member shall be provided under and pursuant to the Rental Agreement (as defined below) entered into by such Affiliate and Member.'}
          </Label>
          <Label span style={styles.text}>
            {'By using the ROLZO Services, you understand and agree that ROLZO’s role is limited to payment processor, services provider, and coordinator (e.g. arranging rentals, connecting Members with Affiliates, setting vehicle rental prices).'}
          </Label>

          <Label button style={styles.title2} font="BentonSans-Medium">2. Agreements </Label>
          <Label span style={styles.text}>
            {'2.1 A Member is granted the possibility of renting Vehicles from ROLZO on the basis of these General Terms and Conditions as applicable from time to time (as displayed on the ROLZO Website).  Unless otherwise agreed, when an individual rental contract is concluded the charges stated in the current price list at that time will apply. '}
          </Label>
          <Label span style={styles.text}>
            {'2.2 The Applicant will pay a one-off registration fee once they are designated by ROLZO as a Member, this fee will be charged as shown on the ROLZO welcome email.'}
          </Label>
          <Label span style={styles.text}>
            {'2.3 The Applicant will only be designated an Authorised Member and provided with a ROLZO ID when ROLZO confirms that the Applicant’s registration has been accepted.'}
          </Label>
          <Label span style={styles.text}>
            {'2.4 The Applicant may only register with ROLZO to become an Authorised Member if the Applicant:'}
          </Label>
          <Label span>
            {'(a)  holds a current full and valid driving licence which is valid for the use of motor vehicles in the UK;'}
          </Label>
          <Label span>
            {'(b)  has less than 6 points on their driving license (or the equivalent if the driving license is not a UK driving license); holds a current full and valid driving licence which is valid for the use of motor vehicles in the UK;'}
          </Label>
          <Label span>
            {'(c)  holds a current full and valid driving licence which is valid for the use of motor vehicles in the UK;'}
          </Label>
          <Label span>
            {'(d)  has not been convicted of any drink or drug driving offence at any time during the last 5 years;'}
          </Label>
          <Label span style={styles.text}>
            {'(f)   has the financial means to pay the charges due under these General Terms and Conditions when due.'}
          </Label>
          <Label span style={styles.text2}>
            {'2.5 The Authorised Member must immediately notify ROLZO in writing if they no longer fulfil the requirements set out in Clause 2.5.'}
          </Label>
        </ScrollView>
        <NetInfoState />
      </Animated.View>
    );
  }
}
