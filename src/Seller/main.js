import React from 'react';
import { View } from 'react-native';
import Header from '../Components/mainHeader';
import MainScreens from './Navigator';

export default function Main(){
    return(
        <View style={{flex:1}}>
            <Header 
                Name = {"Dashboard"}
            />

            <View style={{flex:1}}>
                <MainScreens />
            </View>

        </View>
    )
}