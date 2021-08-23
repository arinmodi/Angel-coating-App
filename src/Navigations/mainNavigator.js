import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Seller from './SellerNavigator';
import Painter from './PainterNavigator';
import Loading from '../LoadingScreens/Loading';
import Wait from '../LoadingScreens/Waiting';
import Authentication from './AuthenticationNavigator';

const MainApp = createStackNavigator({

    Load : { screen : Loading,navigationOptions : {
      ...TransitionPresets.ModalTransition
    }},

    Seller : Seller,
    
    Auth : {
      screen: Authentication,
    },

    Wait : {screen : Wait, navigationOptions : {
      ...TransitionPresets.ScaleFromCenterAndroid
    }},

    Painter : Painter
    },{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
      }
  });

  export default createAppContainer(MainApp);