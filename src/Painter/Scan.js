import React from 'react';
import { View, Text, Linking } from 'react-native';
import Header from '../Components/mainHeader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Primary } from '../Styles/colors';

export default function Scan(){

    const onSuccess = (e) => {
        console.log(e);
        Linking.openURL(e.data).catch(err => {
           alert("Something bad happen try again");
        });
    }

    return(
        <View>

            <Header 
                Name = {"Scan"}
            />

            <Text style= {{textAlign : 'center',marginTop : hp('5%'),color : 'black',fontWeight : 'bold',fontSize : hp('4%')}}>Scan QR Code</Text>

            <QRCodeScanner 
                onRead = {onSuccess}
                flashMode = {RNCamera.Constants.FlashMode.on}
                fadeIn = {false}
                containerStyle = {{
                    marginTop : hp('5%'),
                    marginHorizontal : wp('5%')
                }}
                cameraStyle = {{
                   height : hp('50%'),
                   overflow : 'hidden',
                   borderRadius : wp('7%'),
                   borderWidth : 1,
                   borderColor : Primary,
                }}
                reactivate = {true}
            />


        </View>
    )
}