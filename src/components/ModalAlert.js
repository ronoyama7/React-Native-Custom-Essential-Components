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

const { Width, Height } = Dimensions.get('window');
const closeIcon = require('../assets/images/icon/iconClose.png');

export default class ModalAlert extends Component {
  constructor(Props){
    super(Props);
  }

  render() {
    return (
      <Modal 
      animationType = {'fade'} 
      supportedOrientations={['portrait', 'landscape']} 
      transparent = {true} 
      visible = {this.props.visibleModal} 
      onRequestClose = {() => { console.log("Modal has been closed.") } } >
        <View style={styles.container}>
            <View style={styles.modal}>
                <TouchableOpacity onPress={this.props.onTouch} style={styles.modalTitleSlash}>
                    <Image  source={closeIcon} />
                </TouchableOpacity>
                <Text style={styles.modalTitleText}>{this.props.title}</Text>
                <Text style={styles.modalContentText}>{this.props.content}</Text>
                <TouchableOpacity onPress={this.props.onTouch} style={styles.okBtn}>
                    <Text style={styles.okBtnText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#000000'

      },
    modal: {
        width:'90%',
        height:'50%',
        alignItems: 'center',
        backgroundColor:'#0C0C0C'
    },
    modalTitleSlash: {
        position: 'absolute',
        left: dynamicSize(16),
        top: dynamicSize(16),
        color: '#FFFEFE',
    },
    modalTitleText: {
        top: '20%',
        color: '#FFFEFE',
        fontSize:22
    },
    modalContentText: { 
        top:'25%',
        color:'#898989',
        fontSize:16,
        paddingLeft: '8%',
        paddingRight: '8%',
    },
    okBtn:{
        width:'90%',
        height:'18%',
        position: 'absolute',
        bottom: dynamicSize(20),
        borderRadius: 5,
        backgroundColor:'#A69778',
        justifyContent: 'center',
        alignItems: 'center',
    },
    okBtnText:{
        color: '#FFFEFE',
        fontSize:20
    }

});
