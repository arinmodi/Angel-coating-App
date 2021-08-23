import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native'
import { Card, Button } from 'react-native-paper'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import Header from '../Components/mainHeader'
import { Primary, secondary } from '../Styles/colors'
import { main } from '../Styles/main'
import Modal from 'react-native-modal'
import { AntDesign, MaterialIcons, FontAwesome, Octicons } from '../Icons/icons'
import { f, storage } from '../config/config'
import validateEmail from '../Constants/validateEmail';
import LoadingBar from '../Components/Loading';
import DataLoader from '../Components/DataLoader';
import Confirmation from '../Components/Confirmation';
import ImagePicker from 'react-native-image-crop-picker';
import * as Permissions from 'expo-permissions';

export default function Profile (props) {
  const [uid, setUid] = useState('');
  const [model, setmodel] = useState(false);
  const [Firstname, setFirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [Email, setemail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setimage] = useState('');
  const [ seller, setseller ] = useState('');

  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [process, setprocess ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ lmodal, setlmodal ] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const user = f.auth().currentUser.uid
    console.log(user)
    if (user) {
      await f.firestore().collection('users').doc(user).get().then(r => {
          const data = r.data()
          console.log(data)
          setFirstname(data['firstName'])
          setLastname(data['lastName'])
          setemail(data['email'])
          setPhone(data['phone'])
          setimage(data['Profile_Image']);
          setUid(user);
          setseller(data['SellerCode'])
          setEditEmail(data['email']);
          setEditFirstName(data['firstName']);
          setEditLastName(data['lastName']);
        }).catch(e => {
          console.log(e);
          alert('Something bad happend');
        });
      setLoading(false)
    } else {
      setLoading(false)
      gotoLoginScreen();
    }
  }

  const Hidemodel = () => {
    setmodel(false)
  };

  const HideLmodal = () => {
      setlmodal(false);
  }

  const logout = async () => {
    await f.auth().signOut().then(r => {
        gotoLoginScreen()
    }).catch(e => {
        console.log(e)
        alert('Something bad happend')
    });
  }

  const updateProfile = () => {
    setprocess(2);
    const data = {
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail
    }
    if (editFirstName == Firstname &&editLastName == Lastname &&editEmail == Email) {
      alert('Information Already up to date');
    } else {
      if (editFirstName != '' && editLastName != '' && editEmail != '') {
        if (validateEmail(editEmail)) {
          f.firestore().collection('users').doc(uid).update(data)
            .then(r => {
              setFirstname(editFirstName)
              setLastname(editLastName)
              setEditEmail(editEmail)
              setmodel(false);
              setprocess(0);
              ToastAndroid.show("Profile Update Successfully..!",ToastAndroid.LONG);
            }).catch(e => {
                setprocess(0);
                alert('Something bad happend');
            });
        } else {
            setprocess(0);
          alert('Invalid Email Address');
        }
      } else {
        setprocess(0);
        alert('Please Fill all information');
      }
    }
  };

  const gotoLoginScreen = () => {
    HideLmodal();
    ToastAndroid.show("Signed Out", ToastAndroid.LONG);
    props.navigation.navigate({routeName : 'Login',params : { Restart : true }})
  };

  const getGalleryPermissionAsync = async () => {
    let Gallery = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if ( Gallery.status !== "granted") {
      alert('Sorry, we need Gallery permissions to make this work!');
    }
  };

  const _pickGalleryImage = async () => {
    await getGalleryPermissionAsync();
    try{
        ImagePicker.openPicker({
            mediaType : 'photo',
            cropping : true
        }).then(async res => {
            if(!res.path){

            }else{
                await UploadImage(res.path);
            }
        }).catch(e => {

        })
    }catch (error){
        console.log(error);
    }
  };

  const s4 = () => {
    return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
  }
  
  const uniqueid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
  };

  const UploadImage = async (PP) => {
    setprocess(2);
    var userid = f.auth().currentUser.uid;;
    var imageid = uniqueid();

    console.log('UploadImage')
  
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(PP)[1];
  
    const response = await fetch(PP);
    const blob = await response.blob();
    var filepath = imageid + '.' + ext;
  
    const UploadTask = storage.ref('Profile_Images_Users/'+userid+'/img').child(filepath).put(blob);
    UploadTask.on('state_changed', function(snapshot){
      var Progres = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0);
    },
    function(error){
      setprocess(0);
      alert(error)
    },
    function(){
      UploadTask.snapshot.ref.getDownloadURL().then(
        async function(downloadURL){
          await updatepic(downloadURL)
        }
        )
      }
    )
  };
  
  const updatepic = async (imageUrl) => {
    var userid = f.auth().currentUser.uid;
    try{
      await f.firestore().collection('users').doc(userid).update({
        Profile_Image : imageUrl
      })
    }catch(e){
      console.log(e);
    }
    setprocess(0);
    ToastAndroid.show("Edited Successfully",ToastAndroid.LONG);
    setimage(imageUrl);
}

  return (
    <View style = {{flex : 1}}>
      <Header Name={'Profile'} />

      {loading === false ? (
            <View style = {{flex : 1}}>
                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                    <View style = {{flexDirection : 'row'}}>
                      <View>
                        <TouchableOpacity activeOpacity = {0.5} onPress = {() => _pickGalleryImage()}>
                          <Image source = {{uri : image}} style = {{height : hp('15%'),width : hp('15%'),borderRadius : hp('15%'),borderWidth : 1,borderColor : 'black'}} />
                        </TouchableOpacity>
                      </View>
                      <View style={{marginLeft : wp('10%')}}>
                      <Text
                        style={{ fontSize: hp('3%'), color: 'black', fontWeight: 'bold' }}
                        >
                        {Firstname + ' ' + Lastname}
                        </Text>
                        <Card
                        style={{
                            width: wp('40%'),
                            marginTop: hp('2%'),
                            height: hp('7%'),
                            borderRadius: wp('5%'),
                            backgroundColor: secondary,
                            elevation: 5
                        }}
                        >
                        <TouchableOpacity onPress={() => setmodel(true)}>
                            <View style={{ alignItems: 'center' }}>
                            <Text
                                style={{
                                fontSize: hp('2.5%'),
                                color: 'white',
                                marginTop: hp('1.2%')
                                }}
                            >
                                Edit Profile
                            </Text>
                            </View>
                        </TouchableOpacity>
                        </Card>
                      </View>
                    </View>
                </View>

                <View
                    style={{
                    marginVertical: hp('5%'),
                    height: hp('0.5%'),
                    backgroundColor: '#E3DFDF'
                    }}
                ></View>

                <View>
                    <View style = {{flexDirection : 'row'}}>
                        <Octicons name="paintcan" size={hp('4%')} color= {Primary} style = {{marginLeft : wp('6%'),marginTop : hp('0.8%')}}/>
                        <Text style = {{...main.content,...{marginLeft : wp("5%"),fontWeight : 'bold'}}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{seller}</Text>
                    </View>
                </View>

                <View style={{ marginTop: hp('4%') }}>
                    <View style = {{flexDirection : 'row'}}>
                        <MaterialIcons name='email' size={hp('4%')} color= {Primary} style = {{marginLeft : wp('5%'),marginTop : hp('0.8%')}}/>
                        <Text style = {main.content} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Email}</Text>
                    </View>
                </View>

                <View style={{ marginTop: hp('4%') }}>
                    <View style = {{flexDirection : 'row'}}>
                        <FontAwesome name="phone" size={hp('4%')} color={Primary} style = {{marginLeft : wp('7%'),marginTop : hp('0.8%')}} />
                        <Text style = {{...main.content,...{marginLeft : wp('5%')}}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{phone}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => setlmodal(true)}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{fontSize: hp('2.5%'),color: Primary,marginTop: hp('1.2%')}}>LOGOUT</Text>
                    </View>
                    </TouchableOpacity>
                </View>

                <Modal
                    isVisible={model}
                    onBackButtonPress={() => Hidemodel()}
                    onBackdropPress={() => Hidemodel()}
                >
                    <View
                    style={{
                        backgroundColor: 'white',
                        height: hp('70%'),
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
                        Edit Profile
                    </Text>

                    <Text
                        style={{
                        marginTop: hp('4%'),
                        fontSize: hp('2.5%'),
                        marginLeft: wp('6%'),
                        fontWeight: 'bold',
                        color: 'black'
                        }}
                    >
                        First name :
                    </Text>
                    <View>
                        <TextInput
                        style={{
                            width: wp('50%'),
                            backgroundColor: 'white',
                            borderWidth: 1,
                            marginTop: hp('1%'),
                            marginLeft: wp('5%'),
                            padding: hp('1%'),
                            fontSize: hp('2.2%'),
                            borderRadius: wp('3%')
                        }}
                        editable={true}
                        numberOfLines={1}
                        maxLength={15}
                        value = {editFirstName}
                        onChangeText={setEditFirstName}
                        />
                    </View>

                    <Text
                        style={{
                        marginTop: hp('4%'),
                        fontSize: hp('2.5%'),
                        marginLeft: wp('6%'),
                        fontWeight: 'bold',
                        color: 'black'
                        }}
                    >
                        Last name :
                    </Text>
                    <View>
                        <TextInput
                        style={{
                            width: wp('50%'),
                            backgroundColor: 'white',
                            borderWidth: 1,
                            marginTop: hp('1%'),
                            marginLeft: wp('5%'),
                            padding: hp('1%'),
                            fontSize: hp('2.2%'),
                            borderRadius: wp('3%')
                        }}
                        editable={true}
                        numberOfLines={1}
                        maxLength={15}
                        value = {editLastName}
                        onChangeText={setEditLastName}
                        />
                    </View>

                    <Text
                        style={{
                        marginTop: hp('2%'),
                        fontSize: hp('2.5%'),
                        marginLeft: wp('6%'),
                        fontWeight: 'bold',
                        color: 'black',
                        marginTop: hp('4%')
                        }}
                    >
                        Email :
                    </Text>
                    <View>
                        <TextInput
                        style={{
                            width: wp('80%'),
                            backgroundColor: 'white',
                            borderWidth: 1,
                            marginTop: hp('1%'),
                            marginLeft: wp('5%'),
                            padding: hp('1%'),
                            fontSize: hp('2.2%'),
                            borderRadius: wp('3%')
                        }}
                        editable={true}
                        placeholder={'Email'}
                        value = {editEmail}
                        onChangeText={setEditEmail}
                        numberOfLines={1}
                        maxLength={40}
                        />
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
                            onPress={() => updateProfile()}
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

                <LoadingBar 
                    isVisible = {process > 0}
                    data = {"Editing"}
                />

                <Confirmation 
                    isVisible = {lmodal}
                    onBackButtonPress = {() => HideLmodal()}
                    onBackdropPress = {() => HideLmodal()}
                    question = {"Are You Sure, Want To Logout ?"}
                    onPressYes = {() => logout()}
                    onPressNo = {() => HideLmodal()}
                />

                </View>
      ):(
            <DataLoader style = {{flex : 1}}/>
      )}
    </View>
  )
}
