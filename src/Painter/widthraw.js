import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header from '../Components/mainHeader';
import { FontAwesome, FontAwesome5 } from '../Icons/icons';
import { Primary, secondary } from '../Styles/colors';

export default function Widthraw(){
    return(
        <View>
            <Header 
                Name = {"Home"}
            />
            
            <Card style={{height : hp('25%'),marginHorizontal : wp('3%'),marginTop : hp('3%'),borderRadius : wp('5%'),elevation : 5}}>
                <View style={{alignItems : 'center'}}>
                    <View style = {{flexDirection : 'row',marginTop : hp('2%'),marginHorizontal : wp('5%')}}>
                        <FontAwesome5 name="wallet" size={hp('4%')} color = {secondary} style = {{marginRight : wp('3%'),marginTop : hp('1%')}}/>
                        <Text style = {{textAlign : 'center',marginTop : hp('1.5%'),fontSize : hp('2.5%'),color : 'black',fontWeight : 'bold'}}>WALLET</Text>
                    </View>
                </View>

                <View style={{alignItems : 'center',marginTop : hp('5%')}}>
                    <View style = {{flexDirection : 'row'}}>
                        <FontAwesome name = "rupee" size = {hp('4.5%')} color = {Primary} />
                        <Text style={{color : Primary,fontSize : hp('5%'),marginLeft : wp('2%'),marginTop : -hp('1.5%'),fontWeight : 'bold'}}>100</Text>
                    </View>
                </View>
            </Card>
        </View>
    )
}