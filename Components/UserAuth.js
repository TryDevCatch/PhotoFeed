import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { auth, database } from '../config/config';

const UserAuth = (props) => {
    const [authStep, setAuthStep] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [moveScreen, setMoveScreen] = React.useState(false);

    React.useEffect(() => {
        if (props.moveScreen === true) {
            setMoveScreen(true);
        }
    }, [])

    const login = async () => {
        if (email !== '' && password !== '') {
            try {
                let user = await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('email or password is empty');
        }
    }

    const createUserObj = (userObj, email) => {
        const uObj = {
            name: 'Enter Name',
            username: '@name',
            avatar: 'http://gravatar.com/avatar',
            email: email
        };
        database.ref('users').child(userObj.uid).set(uObj);
    }

    const signup = async () => {
        if (email !== '' && password !== '') {
            try {
                let user = await auth.createUserWithEmailAndPassword(email, password)
                    .then((userObj) => createUserObj(userObj.user, email))
                    .catch((error) => alert(error));
            } catch (error) {
                console.log(error);
                alert(error);
            }
        } else {
            alert('email or password is empty');
        }
    }

    const showLogin = () => {
        if (moveScreen === true) {
            props.navigation.navigate('Upload');
            return false;
        }
        setAuthStep(1);
    }

    const showSignup = () => {
        if (moveScreen === true) {
            props.navigation.navigate('Upload');
            return false;
        }
        setAuthStep(2);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>You are logged out</Text>
            <Text>{props.message}</Text>
            {authStep === 0 ? (
                <View style={{ marginVertical: 20, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => showLogin()}>
                        <Text style={{ fontWeight: 'bold', color: 'green' }}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 10 }}>Or</Text>
                    <TouchableOpacity onPress={() => showSignup()}>
                        <Text style={{ fontWeight: 'bold', color: 'blue' }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                    <View style={{ marginVertical: 20 }}>
                        {authStep === 1 ? (
                            <View>
                                <TouchableOpacity
                                    onPress={() => setAuthStep(0)}
                                    style={{ borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: 'black' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Login</Text>
                                <Text>Email Address:</Text>
                                <TextInput
                                    editable={true}
                                    keyboardType="email-address"
                                    placeholder="enter email address"
                                    onChangeText={(text) => setEmail(text)}
                                    value={email}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3, borderWidth: 1 }}
                                />
                                <Text>Password:</Text>
                                <TextInput
                                    editable={true}
                                    secureTextEntry={true}
                                    placeholder="enter password"
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3, borderWidth: 1 }}
                                />
                                <TouchableOpacity
                                    onPress={() => login()}
                                    style={{ backgroundColor: 'green', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', alignSelf: 'center' }}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setAuthStep(0)}
                                        style={{ borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10, borderBottomColor: 'black' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Sign Up</Text>
                                    <Text>Email Address:</Text>
                                    <TextInput
                                        editable={true}
                                        keyboardType="email-address"
                                        placeholder="enter email address"
                                        onChangeText={(text) => setEmail(text)}
                                        value={email}
                                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3, borderWidth: 1 }}
                                    />
                                    <Text>Password:</Text>
                                    <TextInput
                                        editable={true}
                                        secureTextEntry={true}
                                        placeholder="enter password"
                                        onChangeText={(text) => setPassword(text)}
                                        value={password}
                                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'grey', borderRadius: 3, borderWidth: 1 }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => signup()}
                                        style={{ backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
                                        <Text style={{ color: 'white', alignSelf: 'center' }}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                    </View>
                )}
        </View>
    );
}

export default UserAuth;