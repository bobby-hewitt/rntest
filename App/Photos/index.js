

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Text,
  CameraRoll,
  Dimensions,
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { fromTimestamp } from '../../helpers/date'
export default class Photos extends Component<{}> {

  keyExtractor = (item, index) => index;

  renderItem(item){
    
    return(
      <View 
        style={styles.container}>
        <Image
              key={item.key}
             style={styles.image}
             source={{ uri: item.item.uri}}>
        </Image>
        <Text 
          style={styles.text}>
          {fromTimestamp(item.item.timestamp)}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View stye={styles.container}>
        <FlatList
         keyExtractor={this.keyExtractor}
          data={this.props.photos}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text:{
    paddingHorizontal: 5,
    fontWeight: 'bold',
    fontSize:20,
    position:'absolute',
    bottom:30,
    backgroundColor:'transparent',
    color: '#F5FCFF',
  },
  container: {
    position:'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height:315,
    width: Dimensions.get('window').width,
    backgroundColor: '#F5FCFF',
  },
  image:{
    position: 'absolute',
    top:0,
    left:15,
    borderRadius:10,
    width: Dimensions.get('window').width-30,
    height: 300,
  }
  
});
