import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
  ToastAndroid
} from 'react-native'
import OtpInputs from './OTPInputs'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Ionicons } from '../Icons/icons'
import { Card } from 'react-native-paper'
import { f, storage } from '../config/config'
import RNOtpVerify from 'react-native-otp-verify'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Header from '../Components/header'
import firestore from '@react-native-firebase/firestore';
import Loading from '../Components/Loading';
import { requesteid } from '../Components/UniqueCodeGenerators'

export default function OTP (props) {
  const firstName = props.navigation.getParam('firstName')
  const lastName = props.navigation.getParam('lastName')
  const email = props.navigation.getParam('Emailid')
  const mobile = props.navigation.getParam('phone')
  const account = props.navigation.getParam('accountType')
  const confirmResult = props.navigation.getParam('confirmResult');
  var seller_id;

  var shouldUploadUserData = true;

  if (firstName == undefined) {
    shouldUploadUserData = false;
  }

  const [code, setCode] = useState('')
  const [otp, setotp] = useState([])
  const [auto, setauto] = useState(false);
  const [ process, setprocess ] = useState(0);
  const [ currentfiletype, setcurrentfiletype ] = useState('');

  async function confirmCode () {
    setprocess(2);
    try {
      const user = f.auth().currentUser;
      if (user) {
        if(shouldUploadUserData === true){
          await UploadImage();
        }else{
          setprocess(0);
          gotoWaitScreen();
        }
      } else {
        await confirmResult
          .confirm(code)
          .then(async result => {
            if(shouldUploadUserData === true){
              await UploadImage();
            }else{
              setprocess(0);
              gotoWaitScreen();
            }
          })
          .catch(e => {
            setprocess(0);
            alert('Inalid OTP...!');
            console.log(e);
          })
      }
    } catch (error) {
      setprocess(0);
      alert('Something Bad Happen try again...!');
      console.log(error);
    }
  };

  const UploadImage = async () => {
    const PP = props.navigation.getParam('PP');
    const imageid = props.navigation.getParam('imgid');
    var userid = f.auth().currentUser.uid;

    console.log('UploadImage')
  
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(PP)[1];
    setcurrentfiletype(ext);
  
    const response = await fetch(PP);
    const blob = await response.blob();
    var filepath = imageid + '.' + currentfiletype;
  
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
                async (downloadurl) => {
                    await uploadInformation(downloadurl);
                }
            )
        }
    )
  };

  const getSellerId = async () => {
    await f
      .database()
      .ref()
      .child('seller_id')
      .once('value')
      .then(r => {
        seller_id = r.val()
      })
      .catch(e => {})
  };

  const updateSellerIdInFirebase = async () => {
    await f
      .database()
      .ref()
      .child('seller_id')
      .set(seller_id + 1)
      .then(r => {})
      .catch(e => {})
  }

  const uploadInformation = async (uri) => {
      let userId = f.auth().currentUser.uid;

      if(account === "Painter"){
        const SellerCode = props.navigation.getParam("SellerCode");
        const SellerID = props.navigation.getParam("SellerId");
        const approved = props.navigation.getParam("isapproved");

        const requestId = requesteid();

        await firestore().collection('Request').doc(requestId).set({
          SellerID : SellerID,
          PainterID : userId,
          Deny : false
        });

        const data = {
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: mobile,
          account: account,
          isApproved : approved,
          SellerCode : SellerCode,
          Profile_Image : uri
        };
  
        await firestore()
          .collection('users')
          .doc(userId).set(data)
          .then(r => {
            setprocess(0);
            gotoWaitScreen();
          }).catch(e => {
            alert("Something Bad Happen Try Again");
            setprocess(0);
        });

        
      }else{
        await getSellerId();

        const data = {
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: mobile,
          account: account,
          code : seller_id,
          Profile_Image : uri
        }
  
        await firestore()
          .collection('users')
          .doc(userId).set(data)
          .then( async r => {
            await updateSellerIdInFirebase();
            setprocess(0);
            gotoWaitScreen();
          })
          .catch(e => {
            alert("Something Bad Happen Try Again");
            setprocess(0);
        });
      }
  }

  const gotoWaitScreen = () => {
    props.navigation.navigate('Wait');
  }

  useEffect(() => {
         if (f.auth.PhoneAuthState.CODE_SENT) {
         ToastAndroid.show('OTP Sent!', ToastAndroid.LONG)
         RNOtpVerify.getOtp()
           .then(p => {
             RNOtpVerify.addListener(message => {
               console.log('Listener Added')
               try {
                 if (message && message !== 'Timeout Error') {
                   console.log('Message Found', message)
                 const otp = new RegExp(/(\d{6})/g.exec(message)[1])
                   console.log('OTP Found', otp.source, otp.source.length)
                   if (otp.source.length >= 6) {
                    console.log('setting otp...')
                    var otpnumbers = []
                    for (var i = 0; i <= otp.source.length; i++) {
                       var num = otp.source.charAt(i)
                       console.log('Setting', num)
                       otpnumbers[i] = num
                     }
                     setotp(otpnumbers)
                    setauto(true)
                   } else {
                     console.log('Not otp...')
                   }
                 } else {
                   console.log(
                     'OTPVerification: RNOtpVerify.getOtp - message=>',
                     message
                   )
                 }
               } catch (error) {
                 console.log('OTPVerification: RNOtpVerify.getOtp error=>', error)
               }
             })
         })
           .catch(error => {
             console.log(error)
        })

         return () => {
           RNOtpVerify.removeListener()
         }
       }   }, [])

  const setOtp = index => {
    console.log(otp[index])
    return otp[index].toString()
  }

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <View style={styles.container}>
        <View style={styles.ImageBackground}>
          <Header
            Name={'OTP Verification'}
            onPress={() => props.navigation.navigate('Login')}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginTop: -hp('10%'),
            backgroundColor: 'white',
            borderTopLeftRadius: wp('15%')
          }}
        >
          <View
            style={{ flex: 1, marginTop: hp('10%'), backgroundColor: 'white' }}
          >
            <Text
              style={{
                ...styles.title,
                ...{ color: 'black', marginTop: hp('1%') }
              }}
            >
              Enter OTP
            </Text>

            <OtpInputs
              getOtp={setCode}
              autofill={auto}
              setotp={index => setOtp(index)}
            />

            <View style={{ flex: 1 }}>
              <TouchableNativeFeedback onPress={confirmCode}>
                <Card style={styles.button}>
                  <Text style={styles.buttontext}>Submit</Text>
                </Card>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>

        <Loading 
                isVisible = { process > 1 }
                data = "Checking"
            />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  ImageBackground: {
    height: hp('30%'),
    width: wp('100%')
  },
  title: {
    color: '#C6C7CB',
    fontSize: hp('2.5%'),
    marginTop: hp('5%'),
    textAlign: 'center',
    marginLeft: -wp('5%'),
    fontWeight: 'bold'
  },
  icon: {
    marginLeft: wp('5%'),
    marginTop: wp('8%')
  },
  button: {
    height: hp('7%'),
    width: wp('40%'),
    marginVertical: hp('2%'),
    alignItems: 'center',
    backgroundColor: '#702f8b',
    borderRadius: wp('5%'),
    alignSelf: 'center',
    elevation: 10
  },
  buttontext: {
    color: 'white',
    fontSize: hp('3%'),
    marginTop: hp('1%')
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
})
