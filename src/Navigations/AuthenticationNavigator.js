import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import Login from '../Authentication/Login';
import Register from '../Authentication/Register';
import OTP from '../Authentication/OTPVerification';
import ProfilePhoto from '../Authentication/ProfilePhoto';

const AuthenticationScreens = createStackNavigator({

    Login:Login,
    Register:Register,
    OTP:OTP,
    ProfilePhoto : ProfilePhoto
    
    },
    
    {   
      headerMode: 'none',
      mode:'modal',
      navigationOptions: {
        headerVisible: false,
      }
    }
)

const Authenticate = createStackNavigator({
    auth : AuthenticationScreens,
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Authenticate);