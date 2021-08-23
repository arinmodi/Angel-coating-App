import React, { useEffect } from 'react';
import { View,Text,StyleSheet,FlatList, Image, TouchableOpacity, ToastAndroid, ScrollView, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { FontAwesome } from '../Icons/icons';
import { Primary } from '../Styles/colors';
import { connect } from 'react-redux';
import { Fetch_Request_Data } from '../App-Store/Actions/painterRequest';
import { f,firestore } from '../config/config';
import DataLoader from '../Components/DataLoader';
import Confirmation from '../Components/Confirmation';
import LoadingBar from '../Components/Loading';

class URequests extends React.Component{
    constructor(){
        super();
        this.state = {
            modal : false,
            selectedrequestdata : [],
            refresh : false,
            acceptcon : false,
            denydon : false,
            process : 0,
            process2 : 0,
            refresh : false
        }

    }

    componentDidMount(){
        const user = f.auth().currentUser.uid;
        this.props.Fetch_Request_Data(user);
    }



    render(){

        const HideModalAccept  = () => {
            this.setState({
                acceptcon : false
            })
        }

        const HideModalDeny = () => {
            this.setState({
                denydon : false
            })
        };

        const onAccept = async () => {
            HideModalAccept();
            this.setState({ process : 2 });
            const requestref = firestore.collection('Request').doc(this.state.selectedrequestdata.requestID);
            const userref = firestore.collection('users').doc(this.state.selectedrequestdata.PainterID);

            try{
                const res = await firestore.runTransaction(async t => {
                    t.update(userref, {
                        isApproved : true
                    });
                    t.delete(requestref);
                    return true;
                });
                console.log('Transaction success', res);
                this.setState({ process : 0 });
                ToastAndroid.show("Request Accepted",ToastAndroid.LONG);
            }catch(e){
                console.log(e);
                this.setState({ process : 0 });
                alert("Something Bad Happen...!");
            }
        };

        const onDeny = async () => {
            HideModalDeny();
            this.setState({ process2 : 2 });
            console.log('hello')
            const requestref = firestore.collection('Request').doc(this.state.selectedrequestdata.requestID);
            console.log('hello2')

            try {
                await requestref.update({
                    Deny : true
                });
                console.log('hello3')

                this.setState({ process2 : 0 });
                console.log('hello4')
                ToastAndroid.show("Request Deleted",ToastAndroid.LONG);
                console.log('hello5')
            }catch(e){
                console.log(e);
                this.setState({ process2 : 0 });
                alert('Something Bad Happen ...!');
            }
        };

        const onRefresh = () => {
            const user = f.auth().currentUser.uid;
            this.setState({ refresh : true });
            this.props.Fetch_Request_Data(user);
            this.setState({ refresh : false });
        }

        if(this.props.Painters_Requests.length === 0){
            return(
                <View style = {{flex : 1}}>
                    <ScrollView refreshControl = {<RefreshControl refreshing = {this.state.refresh} onRefresh = {onRefresh} />}>
                        {this.props.Load === false ? (
                                <View style={{flex : 1,justifyContent : 'center',alignItems : 'center',marginTop : hp('20%')}}>
                                    <FontAwesome name="users" size={hp('13%')} color="#A9A9B8" />
                                    <Text style = {{fontSize : hp('2.5%'),marginTop : hp('5%'),color : 'black'}}> No Request Pending </Text>
                                </View>
                        ):(
                            <DataLoader style = {{flex : 2,marginTop : hp('30%')}}/>
                        )}
                    </ScrollView>
                </View>
                
            )
        }else {

        return(
            <View style = {{flex : 1}}>
                {this.props.Load === true ? (
                    <DataLoader style = {{flex : 1}}/>
                ):(
                    <View style={styles.main}>
                    <FlatList 
                        data = {this.props.Painters_Requests}
                        keyExtractor = {(item,index)=>index.toString()}
                        showsVerticalScrollIndicator = {false}
                        refreshing = {this.state.refresh}
                        onRefresh = {() => onRefresh()}
                        renderItem = { (data) => 
                            <View>
                                <Card style={styles.Request}>
                                    <View style={{flexDirection : 'row'}}>
                                        <View style={styles.imagecon}>
                                            <Image source={{uri : data.item.Image}} style={styles.ImageBackground}>

                                            </Image>
                                        </View>
                                        <View style={styles.details}>
                                            <View style={{flexDirection:'row'}}>
                                                <Ionicons name="ios-person" size={hp('4%')} color= {Primary} style={styles.icon} />
                                                <Text style={styles.Username} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.Username}</Text>
                                            </View>
                                            <View style={{flexDirection:'row'}}>
                                                <FontAwesome name="phone" size={hp('3%')} color={Primary} style={styles.Phone_icon} />
                                                <Text style={styles.Phone} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.phone}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style = {{alignItems : 'center'}}>
                                        <View style={{flexDirection : 'row',marginTop : hp('3%')}}>
                                            <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.setState({ acceptcon : true,selectedrequestdata : data.item })}>
                                                <Button style = {{backgroundColor : Primary,borderRadius : wp('3%'),height : hp('6%')}} labelStyle = {{color : 'white',fontSize : hp('1.8%')}}>ACCEPT</Button>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.setState({ denydon : true, selectedrequestdata : data.item })}>
                                                <Button style = {{backgroundColor : 'red',borderRadius : wp('3%'),height : hp('6%'),marginLeft : wp('5%')}} labelStyle = {{color : 'white',fontSize : hp('1.8%')}}>DENY</Button>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        }
                    />

                <Confirmation 
                    isVisible = {this.state.acceptcon}
                    onBackButtonPress = {() => HideModalAccept()}
                    onBackdropPress = {() => HideModalAccept()}
                    question = {"Are You Sure, Want To Accept ?"}
                    onPressYes = {async () => await onAccept()}
                    onPressNo = {() => HideModalAccept()}
                />

                <Confirmation 
                    isVisible = {this.state.denydon}
                    onBackButtonPress = {() => HideModalDeny()}
                    onBackdropPress = {() => HideModalDeny()}
                    question = {"Are You Sure, Want To Deny ?"}
                    onPressYes = {async () => await onDeny()}
                    onPressNo = {() => HideModalDeny()}
                />

                <LoadingBar 
                    isVisible = {this.state.process > 0}
                    data = {"Accepting ...!"}
                />

                <LoadingBar 
                    isVisible = {this.state.process2 > 0}
                    data = {"Deleting...!"}
                />
                    
                </View>
                )}
            </View>
        )
    }}
}

const styles = StyleSheet.create({
    main : {
        flex:1,
    },
    ImageBackground : {
        width:hp('13%'),
        height:hp('13%'),
        borderRadius : hp('13%'),
        borderWidth : 1,
        borderColor : 'black',
        overflow : 'hidden'
    },
    Request : {
        height:hp('27%'),
        marginHorizontal:wp('3%'),
        marginVertical:hp('1.5%'),
        borderRadius:wp('3%'),
        overflow:'hidden',
        elevation:10,
    },
    imagecon : {
        marginLeft : wp('3%'),
        marginTop : hp('2%'),
        width : wp('25%'),
        overflow : 'hidden'
    },
    details : {
        width:wp('75%'),
        backgroundColor : 'white',
    },
    Username : {
        marginLeft : wp('4%'),
        fontSize : hp('3%'),
        marginTop : hp('4%'),
        color : 'black',
    },
    icon : {
        marginTop : hp('4%'),
        marginLeft : wp('4%'),
    },
    Phone: {
        marginLeft : wp('6%'),
        fontSize : hp('2.5%'),
        marginTop : hp('2%'),
        color : 'black'

    },
    Phone_icon : {
        marginTop : hp('2%'),
        marginLeft : wp('6%'),
    },
    modal : {
        height : hp('70%'),
        backgroundColor : 'white',
        borderRadius : hp('4%'),
        overflow : 'hidden'
    },
    modalimage : {
        height : hp('30%'),
        width : wp('90%'),
        resizeMode : 'contain'
    },
    modalicon : {
        margin : hp('2%')
    },
    button : {
        marginTop : hp('4%'),
        width : wp('30%'),
        height : hp('6%'),
        backgroundColor : '#93F014',
        borderRadius : wp('3%'),
        elevation : 10,
        alignItems:'center'
    },
    buttontext : {
        color : '#154293',
        fontSize : hp('3%'),
        marginTop : hp('0.5%')
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Request_Data : (sid) => { dispatch(Fetch_Request_Data(sid)) },
    }
}

const mapStateToProps = (state) => {
    return {
        Painters_Requests : state.Request_Reducer.Request_Data,
        Load : state.Request_Reducer.Load
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(URequests);