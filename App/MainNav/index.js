
import React, { Component } from 'react';
// import Onboard from './App/Onboard'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} from 'react-native';


import Settings from '../Settings'
import Photos from '../Photos'
import Maps from '../Map'


export default class MainNav extends Component<{}> {

  constructor(props){
    super(props)
    this.state = {
      route: 'feed',
    }
  }


  render() {
    return (
          <TabBarIOS 
            style={styles.tabBarContainer}
            itemPositioning="fill"
            barStyle="default">
            <TabBarIOS.Item
              onPress={() => {
                this.setState({route: 'feed'})
                console.log('triggering')
              }}
              selected={this.state.route === 'feed'}
              icon={require('../../assets/photos.png')}
              title="Feed">
              <Photos photos={this.props.photos.reverse()}/>
            </TabBarIOS.Item>
            <TabBarIOS.Item
              onPress={() => {
                this.setState({route: 'map'})
                console.log('triggering')
              }}
              selected={this.state.route === 'map'}
              icon={require('../../assets/map.png')}
              title="Map View">
              <Maps />
            </TabBarIOS.Item>
            <TabBarIOS.Item
              onPress={() => {
                this.setState({route: 'message'})
                console.log('triggering')
              }}
              selected={this.state.route === 'message'}
              icon={require('../../assets/pin.png')}
              title="place it">
              <Maps />
            </TabBarIOS.Item>
            <TabBarIOS.Item
              onPress={() => {
                this.setState({route: 'settings'})
                console.log('triggering')
              }}
              selected={this.state.route === 'settings'}
              icon={require('../../assets/profile.png')}
              title="Profile">
              <Settings />
            </TabBarIOS.Item>
          </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabBarContainer:{
    zIndex:100000000,
  },
  tabBar:{
    flexDirection:'row',
  }
});
