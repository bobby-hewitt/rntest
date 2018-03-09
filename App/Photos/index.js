

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
import LinearGradient from 'react-native-linear-gradient';
import { fromTimestamp } from '../../helpers/date'
export default class Photos extends Component<{}> {

  keyExtractor = (item, index) => index;

  renderItem(item){
    if (item && item.item && item.item.extras && item.item.extras.isArray){
      return this.renderScrollView(item)
    } else if( item && item.item && item.item.extras && item.item.extras.uri){
    return(
      <View 
        style={styles.container}>
        <Image
            key={item.key}
             style={styles.image}
             source={{ uri: item.item.extras.uri}}>
        </Image>
        <Text 
          style={styles.text}>
          {fromTimestamp(item.item.extras.timestamp)}
        </Text>
      </View>
    )
    } else {
      return <View />
    }
  }

  renderScrollViewItem(item, isInScrollView){
    return(
      <View 
        style={styles.scrollItemContainer}>
        <Image
            key={item.key}
            style={{
              width: Dimensions.get('window').width-130,
              height: 200,}}
            source={{ uri: item.item.uri}}>
        </Image>
        <Text 
          style={styles.text}>
          {fromTimestamp(item.item.timestamp)}
        </Text>
      </View>
    )
  }

  renderScrollView(item){
    return(
      <View 
        style={styles.scrollViewContainer}>
        <Text style={styles.title}>{item.item.extras.place ? item.item.extras.place: 'fallback'}</Text>
        <FlatList
        style={styles.scrollViewContainer}
          showHorizontalScrollIndicator={true}
          horizontal={true}
          snapToInterval={200}
          keyExtractor={this.keyExtractor}
          data={item.item.extras.photos}
          renderItem={this.renderScrollViewItem}
        />
      </View>
    )
  }


  render() {
    return (
      <View stye={styles.pageContainer}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.photos}
          renderItem={this.renderItem.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text:{
    textAlign:'center',
    fontWeight: 'bold',
    fontSize:20,
    paddingVertical:7,
    backgroundColor:'transparent',
    color: '#242424',
  },
  title:{
    fontWeight: "900",
    fontSize:30,
    paddingLeft:15,
    paddingVertical:7,
    backgroundColor:'transparent',
    color: '#242424',
  },
  container: {
    backgroundColor:'#e6e6e6',
    height:240,
    marginTop:15,
    width: Dimensions.get('window').width, 
  },
  scrollItemContainer: { 
    backgroundColor:'#e6e6e6',
    height:240,
    maxWidth: Dimensions.get('window').width-130,
    marginLeft:15,
  },
  scrollViewContainer: {
    marginTop:15,
  },
  image:{
    width: Dimensions.get('window').width,
    borderTopLeftRadius:10,
    height: 200,
  }
  
});
