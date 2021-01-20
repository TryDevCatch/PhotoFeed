import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { database } from '../config/config';
import PhotoList from '../Components/PhotoList';

const UserProfile = ({ route, navigation }) => {
    const [isLoaded, setLoaded] = React.useState(false);
    const [userId, setUserId] = React.useState(null);
    const [avatar, setAvatar] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [userName, setUserName] = React.useState(null);

    React.useEffect(() => {
       checkParams();
    }, [])

    const checkParams = () => {
        let params = route.params;
        if(params) {
            if(params.userId) {
                fetchUserInfo(params.userId);
                setUserId(params.userId);
            }
        }
    }

    const fetchUserInfo = (userId) => {

        database.ref('users').child(userId).child('username').once('value').then(function(snapshot) {
            let exists = (snapshot !== null)
            if(exists) data = snapshot.val();
            setUserName(data);
        }).catch((error) => console.log(error));
        database.ref('users').child(userId).child('name').once('value').then(function(snapshot) {
            let exists = (snapshot !== null)
            if(exists) data = snapshot.val();
            setName(data);
        }).catch((error) => console.log(error));
        database.ref('users').child(userId).child('avatar').once('value').then(function(snapshot) {
            let exists = (snapshot !== null)
            if(exists) data = snapshot.val();
            setAvatar(data);
            setLoaded(true);
        }).catch((error) => console.log(error));
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoaded === true ? (
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', 
                        height: 70, paddingTop: 30, backgroundColor: 'white',
                        borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{width: 100}}>
                            <Text style={{paddingLeft: 10, fontSize: 12, fontWeight: 'bold'}}>Go Back</Text>
                        </TouchableOpacity>
                        <Text>Profile</Text>
                        <Text style={{width: 100}}></Text>
                    </View>

                    <View style={{ justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", paddingVertical: 10 }}>
                        <Image source={{ uri: avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50, }} />
                        <View style={{ marginRight: 10 }}>
                            <Text>{name}</Text>
                            <Text>{userName}</Text>
                        </View>
                    </View>

                    <PhotoList isUser={true} userId={userId} navigation={navigation}/>

                </View>
            ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading...</Text>
                    </View>
                )}
        </View>
    );
}

export default UserProfile;