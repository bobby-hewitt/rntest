
import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Auth from '../../helpers/auth'
import { updateUser, logout } from '../../actions/user'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  View
} from 'react-native';



const Settings = props => (
    <View style={styles.container}>
          {props.user.loggedIn &&
            <View style={styles.profileContainer}>
            {props.user.picture &&
            <Image 
              width={200}
              height={200}
              resizeMode="cover"
              style={styles.profileImage}
              source={{uri: props.user.picture}} />
            }
            <Text style={styles.copy}>{props.user.fName + ' ' + props.user.sName}</Text>
            </View>
          }
          {!props.user.loggedIn &&
            <View style={styles.profileContainer}>
              <Text style={styles.title}>Sharing is caring!</Text>
              <Text style={styles.copy}>Log in with facebook so you can leave messages and photos for your friends to find.</Text>
            </View>
          }
         <LoginButton
          style={styles.loginButton}
          readPermissions={["email","public_profile","user_friends"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    Auth.login(data.accessToken.toString()).then((user) => {
                      props.updateUser(user)
                    })
                  }
                )
              }
            }
          }
          onLogoutFinished={() => props.logout()}/>
      </View>
)

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateUser,
  logout
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)



const styles = StyleSheet.create({
  loginButton:{
    marginLeft:30,
    paddingLeft:50,
    width:Dimensions.get('window').width -60,
    height: 50,
    marginBottom: 75,
  },
  profileContainer:{
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  profileImage:{
    padding:0,
    margin:0,
    width:200,
    height:200,
    borderRadius:100,
    resizeMode:'cover'
  },
  title:{
    marginBottom:30,
    fontSize:30,
    fontWeight:"900",
    marginTop:15,
  },
  copy:{
    textAlign:'center',
    paddingHorizontal:50,
    fontSize:20,
    fontWeight:"500",
    marginTop:15,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
