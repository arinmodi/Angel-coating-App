import React, { useState, useRef } from 'react'
import { View, TextInput, ScrollView, Image } from 'react-native'
import { main } from '../Styles/main'
import Header from '../Components/header';
import { Card, Button } from 'react-native-paper'
import { AntDesign, MaterialIcons, Octicons } from '../Icons/icons'
import PhoneInput from 'react-native-phone-number-input'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DropDownPicker from 'react-native-dropdown-picker'
import validateEmail from '../Constants/validateEmail'
import validatePhoneNumber from '../Constants/valdiatePhoneNumber';
import Loading from '../Components/Loading';
import { f } from '../config/config'

export default function Register (props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [Emailid, setemailid] = useState('')
  const [MobileNo, setMobileNO] = useState('')
  const [accountType, setaccountType] = useState('');
  const [ sellercode, setsellercode ] = useState('');
  const [ process, setprocess ] = useState(0);

  const ProfilePhoto = props.navigation.getParam('PP');
  const ImageID = props.navigation.getParam('imgid');

  const phoneInput = useRef(null);

  const register_account = async () => {
    setprocess(2);
    if (
      firstName != '' &&
      lastName != '' &&
      Emailid != '' &&
      MobileNo != '' &&
      accountType != ''
    ) {
      if (!validateEmail(Emailid)) {
        alert('Invalid Email Address')
      } else if (!validatePhoneNumber(MobileNo)) {
        alert('Invalid Phone Number')
      } else {
        //upload to firebase
        let finalPhoneNumber =
          '+' + phoneInput.current.getCallingCode() + MobileNo;

        await f.firestore()
          .collection('users')
          .where('phone', '==', finalPhoneNumber)
          .get().then( async docs => {
            if(docs.docs.length > 0){
              alert("user already exist");
              setprocess(0);
            }else{
              if(accountType === 'Painter'){
                if(sellercode != ''){                
                  var validsellercode = false;
                  var sellerid;
  
                  await f.firestore().collection('users').where('code','==',parseInt(sellercode)).get().then((data) => {
                    if(data.docs.length > 0){
                      validsellercode = true;
                      var docdata = data.docs[0].data();
                      sellerid = docdata.userId;
                    }else{
                      validsellercode = false;
                    }
                  });
          
                  if(validsellercode){
                    await f.auth()
                      .signInWithPhoneNumber(finalPhoneNumber)
                      .then(r => {
                        setprocess(0);
                        props.navigation.navigate({
                          routeName: 'OTP',
                          params: {
                            firstName: firstName,
                            lastName: lastName,
                            Emailid: Emailid,
                            accountType: accountType,
                            phone: finalPhoneNumber,
                            confirmResult: r,
                            SellerCode : sellercode,
                            isapproved : false ,
                            SellerId : sellerid,
                            PP : ProfilePhoto,
                            imgid : ImageID
                          }
                        });
                      })
                      .catch(e => {
                        setprocess(0);
                        alert("Something Bad Happen! please try after hour");
                        console.log(e)
                      })
                  }else{
                    setprocess(0);
                    alert("Invalid Seller Code...!");
                  }
                }else{
                  setprocess(0);
                  alert("please enter seller code ..!")
                }
              }else{
                await f.auth()
                .signInWithPhoneNumber(finalPhoneNumber)
                .then(r => {
                  setprocess(0);
                  props.navigation.navigate({
                    routeName: 'OTP',
                    params: {
                      firstName: firstName,
                      lastName: lastName,
                      Emailid: Emailid,
                      accountType: accountType,
                      phone: finalPhoneNumber,
                      confirmResult: r,
                      PP : ProfilePhoto,
                      imgid : ImageID
                    }
                  });
                })
                .catch(e => {
                  setprocess(0);
                  alert("Something Bad Happen! please try after hour");
                  console.log(e)
                });
              }
            }
          })
      }
    } else {
      alert('Please Enter All Values');
      setprocess(0);
    }
  }

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true}>
      <ScrollView>
        <View>
          <Header
            Name={'Create New Account'}
            onPress={() => props.navigation.navigate('ProfilePhoto')}
          />

          <View style = {{alignItems : 'center',marginTop : hp('3%')}}>
            <Image source = {{uri : ProfilePhoto}} style = {{height : hp('15%'),width : hp('15%'),borderRadius : hp('15%')}}/>
          </View>

          {/* First Name Input */}
          <Card style={main.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={main.inputicon}>
                <AntDesign name='user' size={hp('4%')} color='blue' />
              </View>
              <TextInput
                editable={true}
                placeholder={'First Name'}
                placeholderTextColor='#CDC7C7'
                onChangeText={setFirstName}
                style={main.input}
                numberOfLines={1}
                maxLength={15}
                autoFocus={true}
              />
            </View>
          </Card>

          {/* Last Name Input */}
          <Card style={main.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={main.inputicon}>
                <AntDesign name='user' size={hp('4%')} color='blue' />
              </View>
              <TextInput
                editable={true}
                placeholder={'Last Name'}
                placeholderTextColor='#CDC7C7'
                onChangeText={setLastName}
                style={main.input}
                numberOfLines={1}
                maxLength={15}
              />
            </View>
          </Card>

          {/* Email Input */}
          <Card style={main.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={main.inputicon}>
                <MaterialIcons name='email' size={hp('4%')} color='blue' />
              </View>
              <TextInput
                editable={true}
                placeholder={'Email id'}
                placeholderTextColor='#CDC7C7'
                onChangeText={setemailid}
                style={main.input}
                numberOfLines={1}
                maxLength={50}
                keyboardType='email-address'
              />
            </View>
          </Card>

          {/* Mobile Number Input */}
          <PhoneInput
            ref={phoneInput}
            defaultValue={MobileNo}
            defaultCode='IN'
            layout='first'
            onChangeText={num => {
              setMobileNO(num)
            }}
            textInputProps={{
              keyboardType: 'numeric'
            }}
            containerStyle={{
              marginHorizontal: wp('5%'),
              marginTop: hp('5%'),
              height: hp('10%'),
              borderRadius: wp('3%'),
              width: wp('90%'),
              borderWidth: 0.5,
              overflow: 'hidden'
            }}
            textInputStyle={{
              fontSize: hp('2.5%')
            }}
            textContainerStyle={{
              backgroundColor: 'white'
            }}
          />

          {/* User account type */}
          <DropDownPicker
            items={[
              { label: 'Seller', value: 'Seller' },
              { label: 'Painter', value: 'Painter' }
            ]}
            placeholder='Choose Type'
            containerStyle={{
              height: hp('10%'),
              width: wp('90%'),
              marginHorizontal: wp('5%'),
              marginTop: hp('4%')
            }}
            style={{ backgroundColor: 'white' }}
            itemStyle={{
              justifyContent: 'flex-start'
            }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            onChangeItem={item => setaccountType(item.value)}
            labelStyle={{ color: 'black' }}
          />

          {/* Last Name Input */}
          {accountType === 'Painter' ? (
            <Card style={main.inputContainer}>
              <View style={{ flexDirection: 'row' }}>
                <View style={main.inputicon}>
                  <Octicons name="paintcan" size={hp('4%')} color="blue" />
                </View>
                <TextInput
                  editable={true}
                  placeholder={'Seller Code'}
                  placeholderTextColor='#CDC7C7'
                  onChangeText={setsellercode}
                  style={main.input}
                  numberOfLines={1}
                  maxLength={4}
                  keyboardType = {"number-pad"}
                />
              </View>
            </Card>
          ):( null )}

          <Button
            onPress={register_account}
            style={main.buttonStyle}
            labelStyle={{ color: 'white', fontSize: hp('2.8%') }}
          >
            REGISTER
          </Button>
        </View>
        <Loading 
                isVisible = { process > 1 }
                data = "Veryfying"
            />
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}
