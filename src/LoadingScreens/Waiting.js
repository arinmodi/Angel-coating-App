import React from 'react'
import { View, Text, StyleSheet,TouchableOpacity,Image, ToastAndroid,TouchableNativeFeedback,TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header from '../Components/mainHeader';
import { SimpleLineIcons, MaterialIcons, Feather,Octicons, AntDesign } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { Primary, secondary } from '../Styles/colors';
import Modal from 'react-native-modal';
import Loading from '../Components/Loading';
import { f } from '../config/config';

export default class Demo extends React.Component {

  constructor(props){
    super(props);
    this.state = { 
      notApproved : false,
      Phone : '',
      Email : '',
      SellerCode : '',
      UserName : '',
      Image : '',
      Deny : false,
      modal : false,
      editsellecode : '',
      process : 0,
      requestid : '',
      uid : ''
    };
  };

  Hidemodal = () => {
    this.setState({
      modal : false
    });
  }

  componentDidMount = async () => {
    await this.CheckUser();
  };

  CheckUser = async () => {
    const user = auth().currentUser.uid;
    var that = this;
    console.log('Checking User')
    if (user) {
      await firestore().collection('users').where('userId', '==', user + '').get().then( async result => {
          if (result.docs[0].data()['account'] == 'Seller') {
            //seller account
            that.props.navigation.navigate('Seller');
          } else {
            //painter account
            if(result.docs[0].data()['isApproved'] === true){
              that.props.navigation.navigate('Painter');
            }else{
              await firestore().collection('Request').where('PainterID', "==",user).get().then((ddata) => {
                if(ddata.docs.length > 0){
                  var data = ddata.docs[0].data();
                  that.setState({
                    Deny : data.Deny,
                    requestid : ddata.docs[0].id
                  })
                }
              })
              that.setState({
                notApproved : true,
                UserName : result.docs[0].data()['firstName'] +' ' + result.docs[0].data()['lastName'],
                Email : result.docs[0].data()['email'],
                Image : result.docs[0].data()['Profile_Image'],
                Phone : result.docs[0].data()['phone'],
                SellerCode : result.docs[0].data()['SellerCode'],
                editsellecode : result.docs[0].data()['SellerCode'],
                uid : result.docs[0].id
              });
            }
          }
        })
        .catch(e => {
          alert("Something Bad Happen");
        })
    } else {
      //goto auth screen
      that.props.navigation.navigate('Auth');
    }
  };

  updaterequest = async () => {
    this.setState({ process : 2 });
    var validsellercode = false;
    var sellerid;
    var that = this;

    await firestore().collection('users').where('code','==',parseInt(this.state.editsellecode)).get().then((data) => {
      if(data.docs.length > 0){
        validsellercode = true;
        var docdata = data.docs[0].data();
        sellerid = docdata.userId;
      }else{
        validsellercode = false;
      }
    });
    console.log(validsellercode)

    if(validsellercode){
      console.log(this.state.requestid);
      const reqref = firestore().collection('Request').doc(this.state.requestid);
      console.log(that.state.uid);
      const userref = firestore().collection('users').doc(that.state.uid);
      try{
        const res = await firestore().runTransaction(async t => {
          t.update(reqref,{
            Deny : false,
            SellerID : sellerid
          });
          t.update(userref, {
            SellerCode : that.state.editsellecode,
            isApproved : false

          });
        });

        console.log('Transaction success', res);
        await this.CheckUser();
        ToastAndroid.show("Request Sent",ToastAndroid.LONG);
        this.Hidemodal();
        this.setState({ process : 0 });
      }catch(e){
        console.log(e);
        this.setState({ process : 0 });
        alert("Something Bad Happen, Try Again");
      }
    }else{
      this.Hidemodal();
      this.setState({ process : 0 });
      alert("Invalid Seller Code");
    }
  };

  logout = async () => {
    await f.auth().signOut().then(r => {
        ToastAndroid.show("Signed Out", ToastAndroid.LONG)
        this.props.navigation.navigate({routeName : 'Login',params : { Restart : true }});
    }).catch(e => {
        console.log(e)
        alert('Something bad happend');
    });
  }


  render(){
    return (
      <View style = {{flex : 1}}>
        {this.state.notApproved === true ? (
          <View>
            <Header Name = {"Wait"}/>

            <View style={styles.main}>

                    <View style = {{marginTop : hp('2%')}}>
                    <View style={styles.profile}>
                        <Image source={{uri:this.state.Image}} style={styles.image}/> 
                    </View>

                    <View style={styles.UserName}>
                        <Text style={styles.text}>{this.state.UserName}</Text>
                    </View>

                    <View style={styles.email}>
                        <View style = {styles.iconcon}>
                            <MaterialIcons name="email" size={hp('3.5%')} color="white" style = {{marginTop : hp('1.25%')}} />
                        </View>
                        <Text style={styles.value}>{this.state.Email}</Text>
                    </View>

                    <View style={styles.email}>
                        <View style = {styles.iconcon}>
                            <MaterialIcons name="phone" size={hp('3.5%')} color="white" style = {{marginTop : hp('1.25%')}} />
                        </View>
                        <Text style={styles.value}>{this.state.Phone}</Text>
                    </View>

                    <View style={styles.email}>
                        <View style = {styles.iconcon}>
                            <Octicons name="paintcan" size={hp('3.5%')} color="white" style = {{marginTop : hp('1.25%')}}/>
                        </View>
                        <Text style={styles.value}>{this.state.SellerCode}</Text>
                    </View>

                    <View>
                        {this.state.Deny === true ? (
                          <View style={{marginTop:hp('7%'),alignItems:'center',marginHorizontal:wp('3%')}}>
                            <Text style={{...styles.text,...{fontSize:hp('2.5%'),color : 'red'}}}>Seller Denied Your Request</Text>
                          </View>
                        ):(
                          <View style={{marginTop:hp('7%'),alignItems:'center',marginHorizontal:wp('3%')}}>
                            <Text style={{...styles.text,...{fontSize:hp('2.5%'),color : 'red'}}}>Please Wait Untill Seller Accept</Text>
                            <Text style={{...styles.text,...{fontSize:hp('2.5%'),color : 'red'}}} >Your Request</Text>
                          </View>
                        )}
                    </View>

                    <View style={{marginTop: hp('7%'),flexDirection : 'row',justifyContent : 'space-around'}}>
                        <TouchableNativeFeedback onPress = {() => this.logout()}>
                        <Card style={{height:hp('6%'),width: wp('35%'),backgroundColor:'red',borderRadius : wp('2%')}}>
                            <View style={{flexDirection : 'row',alignItems:'center'}}>
                                <SimpleLineIcons name="logout" size={hp('3.5%')} color="white"  style = {{marginTop : hp('0.5%'),marginLeft : wp('2%')}}/>
                                <Text style={{color : 'white',fontSize : hp('3%'),marginTop : hp('0.5%'),marginLeft : wp('3%')}}>Logout</Text>
                            </View>
                        </Card>
                        </TouchableNativeFeedback>
   
                        <TouchableNativeFeedback onPress = {() => this.setState({ modal : true })}>
                        <Card style={{height:hp('6%'),width: wp('35%'),backgroundColor:secondary,borderRadius : wp('2%')}}>
                            <View style={{flexDirection : 'row',alignItems:'center'}}>
                                <AntDesign name="edit" size={hp('3.5%')} color="white"  style = {{marginTop : hp('0.5%'),marginLeft : wp('2%')}}/>
                                <Text style={{color : 'white',fontSize : hp('3%'),marginTop : hp('0.5%'),marginLeft : wp('3%')}}>Edit</Text>
                            </View>
                        </Card>
                        </TouchableNativeFeedback>
                    </View>
                    </View>

                    <Loading 
                        isVisible = { this.state.process > 0 }
                        data = "Editing"
                    />

                    <Modal
                      isVisible = {this.state.modal}
                      onBackButtonPress = {() => this.Hidemodal()}
                      onBackdropPress = {() => this.Hidemodal()}
                    >
                      <View
                        style={{
                            backgroundColor: 'white',
                            height: hp('35%'),
                            borderRadius: wp('5%')
                        }}
                        >

                        <Text
                            style={{
                            textAlign: 'center',
                            fontSize: hp('2.5%'),
                            marginTop: hp('2%'),
                            fontWeight: 'bold',
                            color: 'black',
                            color: Primary
                            }}
                        >
                            Edit Request
                        </Text>

                        <View style = {{flexDirection : 'row'}}>

                        <Text
                            style={{
                            marginTop: hp('4%'),
                            fontSize: hp('2.5%'),
                            marginLeft: wp('6%'),
                            fontWeight: 'bold',
                            color: 'black'
                            }}
                        >
                            Seller Code :
                        </Text>
                        <View>
                            <TextInput
                            style={{
                                width: wp('30%'),
                                backgroundColor: 'white',
                                borderWidth: 1,
                                marginTop: hp('3%'),
                                marginLeft: wp('5%'),
                                padding: hp('1%'),
                                fontSize: hp('2.2%'),
                                borderRadius: wp('3%')
                            }}
                            editable={true}
                            numberOfLines={1}
                            maxLength={3}
                            value = {this.state.editsellecode}
                            onChangeText={(text) => this.setState({ editsellecode : text })}
                            />
                        </View>
                      </View>

                      <View style={{ alignItems: 'center' }}>
                        <Card
                        style={{
                            backgroundColor: secondary,
                            marginTop: hp('4%'),
                            marginLeft: wp('6%'),
                            width: wp('30%'),
                            borderRadius: wp('2%'),
                            height: hp('6%')
                        }}
                        >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.updaterequest()}
                        >
                            <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginLeft: wp('3%'), marginTop: hp('1.2%') }}>
                                <AntDesign name='save' size={hp('3%')} color='white' />
                            </View>
                            <View style={{ marginLeft: wp('3%'), marginTop: hp('1%') }}>
                                <Text style={{ fontSize: hp('2.5%'), color: 'white' }}>
                                Save
                                </Text>
                            </View>
                            </View>
                        </TouchableOpacity>
                        </Card>
                    </View>
                        
                    </View>
                    </Modal>
                </View>
          </View>
        ):(
      <View style = {{alignItems : 'center',justifyContent : 'center',flex : 1}}>
        <Image source={require("../../assets/Logo.png")} style = {{height : hp('20%'),width : wp('20%'), resizeMode : 'contain'}}  />
        <Text style = {{fontSize : hp('4%'),marginTop : hp('4%'),fontWeight : 'bold',color : 'black'}}>AngelCoating</Text>
      </View>
        )}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  main : {

  },
  ImageBackground:{
      height:hp('40%'),
      width:wp('100%'),
      backgroundColor: '#154293',
  },
  image:{
      width:hp('15%'),
      height:hp('15%'),
      borderRadius:hp('15%')    
  },
  profile:{
      alignItems:'center'
  },
  UserName : {
      alignItems:'center',
      marginTop:hp('2%')
  },
  text : {
      fontSize:hp('3%'),
      color : Primary,
  },
  email : {
      flexDirection:'row',
      marginTop : hp('4%'),
      marginLeft:wp('5%')
  },
  value : {
      fontSize:hp('2.5%'),
      width : wp('75%'),
      marginLeft:wp('4%'),
      marginTop : hp('1%'),
      color : 'black'
  },
  iconcon : {
      alignItems : 'center',
      height : hp('6%'),
      width : hp('6%'),
      borderRadius : hp('6%'),
      backgroundColor : Primary
  },
  title:{
      color:'white',
      fontSize:hp('2.5%'),
      marginTop:hp('4%'),
      textAlign : 'center'
  },
})
