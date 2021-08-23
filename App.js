import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import MainApp from './src/Navigations/mainNavigator';
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// reucers imports
import Request_Reducer from './src/App-Store/reducers/painterRequest';

// screen imports
import Painter from './src/Navigations/PainterNavigator';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Primary } from './src/Styles/colors';
import { Provider } from 'react-redux';

export default class App extends React.Component {

  constructor(){
    super();
    this.state = {
      connection : true
    }
  }

  getHash = () => {
    RNOtpVerify.getHash()
        .then((hash) => {
            console.log('App.js: Application hash is=> ', hash);
        })
        .catch((error) => {
            console.log(error);
        });
  };

  componentDidMount = () => {
    var that = this;
    StatusBar.setBackgroundColor("#702f8b");
    NetInfo.addEventListener(networkState => {
      if(networkState.isConnected){
        that.setState({
          connection : true
        })
      }else{
        that.setState({
          connection : false
        })
      }
    });
    this.getHash();
  };



  render(){

    const Mainreducer=combineReducers({
      Request_Reducer : Request_Reducer
    });

    const store = createStore(Mainreducer, applyMiddleware(thunkMiddleware));

    return (
      <View style = {{flex : 1}}>
        <Provider store={store}>
          <MainApp ref={(x) => (global.stackNavigator = x)}/>
          <Modal
            isVisible = {!this.state.connection}
          >
            <View style = {{height : hp('30%'),backgroundColor : 'white',borderRadius : wp('5%'),overflow : 'hidden',alignItems : 'center'}}>
              <Image source = {require('./assets/Logo.png')} style = {{height : hp('8%'),width : hp('8%'),resizeMode : 'contain',marginTop : hp('4%')}} />
              <Text style = {{marginVertical : hp('2%'),color : 'red',fontWeight : 'bold',fontSize : hp('1.8%')}}>Connection Error</Text>
              <Text style = {{fontSize : hp('2%'),color : Primary,fontWeight : 'bold'}}>Check Your Connection and </Text>
              <Text style = {{fontSize : hp('2%'),color : 'black',fontWeight : 'bold',marginTop : hp('1%')}}>Restart the app..!</Text>
            </View>
          </Modal>
        </Provider>
      </View>
    );
  }
}
