import React from 'react';
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AntDesign, MaterialIcons, MaterialCommunityIcons  } from '../Icons/icons';
import { Primary } from '../Styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Image } from 'react-native';

// screens
import Demo from '../Painter/Demo';
import widthraw from '../Painter/widthraw';
import Transaction from '../Painter/Transaction';
import Scan from '../Painter/Scan';
import Profile from '../Painter/profile';

const default_configuration = {   
  headerMode: 'none',
  mode:'modal',
  navigationOptions: {
    headerVisible: false,
  }
};

const widthrawscreens = createStackNavigator({
  main : widthraw
},
  default_configuration
);


const Tabs = {

  Home : {
    screen : widthrawscreens,
    navigationOptions : () => ({
      tabBarIcon : ({tintColor})=>{
        return(
          <AntDesign name="home" size={hp('4%')} color={tintColor} />
        );
      }
    })
  },

  Transaction : {
    screen : Transaction,
    navigationOptions : () => ({
      tabBarIcon : ({tintColor})=>{
        return(
          <MaterialIcons name="event-note" size={hp('4%')} color={tintColor} />
        );
      }
    })
  },

  Scan2 : {
    screen : Scan,
    navigationOptions : () => ({
      tabBarIcon : ({tintColor})=>{
        return(
          <View style={{ position: 'absolute', bottom: hp('1%'),height: hp('8%'),width: hp('8%'), borderRadius: hp('8%'),backgroundColor: Primary,justifyContent: 'center',
          alignItems: 'center',
          }}>
            <MaterialCommunityIcons name="qrcode-scan" size={hp('4%')} color={'white'} />
          </View>
        );
      },
      title : ''
    })
  },

  Scan : {
    screen : Scan,
    navigationOptions : () => ({
      tabBarIcon : ({tintColor})=>{
        return(
            <MaterialCommunityIcons name="qrcode-scan" size={hp('4%')} color={tintColor} />
        );
      }
    })
  },

  Profile : {
    screen : Profile,
    navigationOptions : () => ({
      tabBarIcon : ({tintColor})=>{
        return(
          <AntDesign name="user" size={hp('4%')} color={tintColor} />
        );
      }
    })
  },

};

const PainterScreens = createBottomTabNavigator(
  Tabs,
  {
    tabBarOptions : {
      activeTintColor:Primary,
      inactiveTintColor:'black',
      style:{
        height:hp('9%'),
        elevation:24,
      }
    }
  }
)

const Painter = createStackNavigator({
    main : PainterScreens,
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Painter);