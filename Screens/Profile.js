import React from 'react';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { f, auth, database } from '../config/config';
import PhotoList from '../Components/PhotoList';
import UserAuth from '../Components/UserAuth';

const Profile = ({ navigation }) => {
    const [isLogIn, logIn] = React.useState(false);
    const [userId, setUserId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const [name, setName] = React.useState('');
    const [editingProfile, setEditingProfile] = React.useState(false);

    React.useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                fetchUserInfo(user.uid);
            } else {
                logIn(false);
            }
        })
    }, [])

    const fetchUserInfo = (userId) => {
        database.ref('users').child(userId).once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null)
            if (exists) data = snapshot.val();
            setName(data.name);
            setUserName(data.username);
            setAvatar(data.avatar);
            setUserId(userId);
            logIn(true);
        })
    }

    const logoutUser = () => {
        f.auth().signOut();
        alert('Logged Out')
    }

    const editProfile = () => {
        setEditingProfile(true);
    }

    const saveProfile = () => {
        if(name !== '') {
            database.ref('users').child(userId).child('name').set(name);
        }
        if(userName !== '') {
            database.ref('users').child(userId).child('username').set(userName);
        }
        setEditingProfile(false);
    }

    return (
        <View style={{ flex: 1 }}>
            {isLogIn === true ? (
                <View style={{ flex: 1 }}>
                    <View style={{
                        height: 70, paddingTop: 30, backgroundColor: 'white',
                        borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>Profile</Text>
                    </View>

                    <View style={{ justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", paddingVertical: 10 }}>
                        <Image source={{ uri: avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50, }} />
                        <View style={{ marginRight: 10 }}>
                            <Text>{name}</Text>
                            <Text>{userName}</Text>
                        </View>
                    </View>

                    {editingProfile === true ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={() => setEditingProfile(false)}>
                                <Text style={{color: 'black', fontWeight: 'bold'}}>Cancel Editing</Text>
                            </TouchableOpacity>
                            <Text>Name:</Text>
                            <TextInput
                                editable={true}
                                placeholder='Enter your name'
                                onChangeText={(text) => setName(text)}
                                value={name}
                                style={{ width: 250, marginVertical: 10, padding: 5, borderWidth: 1, borderColor: 'grey' }}
                            />
                            <Text>Username:</Text>
                            <TextInput
                                editable={true}
                                placeholder='Enter your name'
                                onChangeText={(text) => setUserName(text)}
                                value={userName}
                                style={{ width: 250, marginVertical: 10, padding: 5, borderWidth: 1, borderColor: 'grey' }}
                            />
                            <TouchableOpacity style={{backgroundColor: 'blue', padding: 10}}
                            onPress={() => saveProfile()}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Save Profile</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
                                <TouchableOpacity
                                    onPress={() => logoutUser()}
                                    style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5 }}>
                                    <Text style={{ textAlign: "center", color: 'grey' }}>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => editProfile()}
                                    style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5 }}>
                                    <Text style={{ textAlign: "center", color: 'grey' }}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Upload')}
                                    style={{ backgroundColor: 'grey', marginTop: 10, marginHorizontal: 40, paddingVertical: 35, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5 }}>
                                    <Text style={{ textAlign: "center", color: 'white' }}>Upload New</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    {userId !== '' ?
                        <PhotoList isUser={true} userId={userId} navigation={navigation} />
                        : console.log("USER ID EMPTY", userId)}

                </View>
            ) : (
                    <UserAuth message="Please login to view your profile" />
                )}
        </View>
    );
}

export default Profile;