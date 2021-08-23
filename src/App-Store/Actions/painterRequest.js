import { firestore } from '../../config/config';

export const FETCH_DATA = 'FETCH_DATA';
export const STATUS = 'STATUS';

export const set_Load = (value) => {
    return { type : STATUS, Data : value }
};

export const set_Painter_Request_Data = (Data) => {
    return { type : FETCH_DATA, Data : Data }
};

export const Fetch_Request_Data = (id) => {
    return function(dispatch){
        var request_data = [];
        var readcount = 0;
        firestore.collection('Request').where("SellerID" , "==", id).onSnapshot( async data => {
            dispatch(set_Load(true));
            request_data = [];
            readcount += 1;
            console.log("Read Count : " + readcount);
            console.log('error')
            if(data.docs.length > 0){
                await Promise.all(
                    data.docs.map(async res => {
                        let request = res.data();
                        console.log("Indie Mapping")
                        if(request.Deny === false){
                            console.log('error1')
                            await firestore.collection('users').doc(request.PainterID).get().then(udata => {
                                const userData = udata.data();
                                request_data.push({
                                    requestID : res.id,
                                    Username : userData.firstName + ' ' + userData.lastName,
                                    Image : userData.Profile_Image,
                                    phone : userData.phone,
                                    PainterID : userData.userId
                                })
                            });
                            console.log('error2')
                        }else {
                            //do nothing 
                        }
                    }));
                    console.log('dispaching action')
                dispatch(set_Painter_Request_Data(request_data));
                dispatch(set_Load(false));
            }else{
                dispatch(set_Painter_Request_Data(request_data));
                dispatch(set_Load(false));
            }
        });
    }
};