import React from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header from '../Components/mainHeader';
import { FontAwesome, MaterialCommunityIcons } from '../Icons/icons';

export default function Transaction(){

    const TranscationUI = (data) => {
        return(
            <Card style={{marginTop : hp('3%'),marginHorizontal : wp('3%'),borderRadius : wp('5%'),elevation : 10,height : hp('25%'),overflow : 'hidden'}}>
                <View style={{marginLeft : wp('5%'),marginTop : hp('2%')}}>
                    <Text style = {{color : 'black',fontSize : hp('2.2%')}}>Transaction id : #123456</Text>
                </View>
                <View style={{marginTop : hp('1%'),marginLeft : wp('5%')}}>
                    <Text style={{fontWeight : 'bold'}}>10:00 AM 18 OCT 2020</Text>
                </View>
                <View style={{marginTop : hp('3%'),flexDirection : 'row',marginLeft : wp("5%")}}>
                    <View style={{flexDirection : 'row'}}>
                        <MaterialCommunityIcons name = "qrcode" size = {hp('10%')} color = {"black"} />
                        <View style={{marginLeft : wp('2%'),marginTop : hp('1%')}}>
                            <View style={{flexDirection : 'row'}}>
                                <Text style={{color : 'black',fontSize : hp('2%')}}>Status:</Text>
                                <Text style={{color : 'green',fontSize : hp('2%')}}> Approved</Text>
                            </View>
                            <View style={{flexDirection : 'row',marginTop : hp('2%')}}>
                                <FontAwesome name = "rupee" size = {hp('2.5%')} color = {"black"} />
                                <Text style={{color : 'black',fontSize : hp('2.5%'),marginLeft : wp('1.5%'),marginTop : -hp('0.7%'),fontWeight : 'bold'}}>10</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    return(
        <View style = {{flex : 1}}>
            <Header 
                Name = {"Transactions"}
            />

            <FlatList 
                style = {{flex : 1}}
                data = {"1234567890"}
                keyExtractor = {(item,index)=>index.toString()}
                renderItem = {TranscationUI}
                showsVerticalScrollIndicator = {false}
                ListFooterComponent = {
                    <View style = {{marginTop : hp('2%')}}>
                        
                    </View>
                }
            />
        </View>
    )
}