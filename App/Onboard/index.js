import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  ScrollView
} from 'react-native';

import {
  addToCount,
  subtractFromCount
} from '../../actions/counter'

onPage =() => {
  console.log('on page')
}

const Onboard = props => (
  <View style={styles.container}>
   <View style={styles.container}>
        <ScrollView
          scrollEnabled={false}
          pagingEnabled
          horizontal>
          <View style={styles.pageContainer}>
            <Text>Hello 1</Text>
          </View>
          <View style={styles.pageContainer}>
            <Text>Hello 2</Text>
          </View>
          <View style={styles.pageContainer}>
            <Text>Hello 3</Text>
          </View>
        </ScrollView>
      </View>
  </View>
)

const mapStateToProps = state => ({
  count: state.counter.count
})

const mapDispatchToProps = dispatch => bindActionCreators({
  addToCount,
  subtractFromCount,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboard)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pageContainer:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    alignItems:'center',
    justifyContent:'center'
  }
});
