import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FontAwesome, MaterialCommunityIcons } from '../Icons/icons';
import { Primary } from '../Styles/colors';

export default function Requests(props){

    const onApprove = () => {
        console.log("Approved");
    };

    const onDeny = () => {
        console.log("Deny");
    };

    const RequestUI = (data) => {
        return(
            <Card style = {{height : hp('28%'),marginHorizontal : wp('3%'),borderRadius : wp('3%'),elevation : 10,marginTop : hp('3%')}}>
                <View style={{marginLeft : wp('5%'),marginTop : hp('2%')}}>
                    <Text style = {{color : 'black',fontSize : hp('2.2%')}}>Transaction id : #123456</Text>
                </View>
                <View style={{marginTop : hp('1%'),marginLeft : wp('5%')}}>
                    <Text style={{fontWeight : 'bold'}}>10:00 AM 18 OCT 2020</Text>
                </View>
                <View style={{marginTop : hp('3%'),flexDirection : 'row',marginLeft : wp("5%")}}>
                    <View style={{flexDirection : 'row'}}>
                        <MaterialCommunityIcons name = "qrcode" size = {hp('13%')} color = {"black"} />
                        <View style={{marginLeft : wp('2%'),marginTop : hp('0.5%')}}>
                            <View style={{alignItems : 'center'}}>
                                <Text style={{color : 'black',fontSize : hp('2.5%')}}>UserName</Text>
                            </View>
                            <View style={{flexDirection : 'row',marginTop : hp('2%')}}>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => onApprove()}>
                                    <Button style = {{backgroundColor : Primary,borderRadius : wp('3%'),height : hp('6%')}} labelStyle = {{color : 'white',fontSize : hp('1.8%')}}>APPROVE</Button>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => onDeny()}>
                                    <Button style = {{backgroundColor : 'red',borderRadius : wp('3%'),height : hp('6%'),marginLeft : wp('5%')}} labelStyle = {{color : 'white',fontSize : hp('1.8%')}}>DENY</Button>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        )
    }

    return(
        <View style = {{flex : 1}}>
            <FlatList 
                style = {{flex : 1}}
                data = {'1234'}
                keyExtractor = {(item,index)=>index.toString()}
                renderItem = {RequestUI}
                showsVerticalScrollIndicator = {false}
                ListFooterComponent = {
                    <View style = {{marginTop : hp('3%')}}>
                        
                    </View>
                }
            />
        </View>
    )
};