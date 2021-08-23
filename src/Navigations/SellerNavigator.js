import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import Main from '../Seller/main';

const SellerScreens = createStackNavigator({

    main : Main
    },
    
    {   
      headerMode: 'none',
      mode:'modal',
      navigationOptions: {
        headerVisible: false,
      }
    }
)

const Seller = createStackNavigator({
    main : SellerScreens,
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Seller);