import React from 'react';
import { TextInput, ActivityIndicator, Text, View, Image, TouchableOpacity } from 'react-native';
import { f, auth, database, storage } from '../../config/config';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import UserAuth from '../Components/UserAuth';
import { uniqueId } from '../Utils/IdUtils';

const Upload = () => {
    const [isLogIn, logIn] = React.useState(false);
    const [imageId, setImageId] = React.useState(null);
    const [permissions, setPermissions] = React.useState(null);
    const [currentFileType, setCurrentFileType] = React.useState(null);
    const [isImageSelected, setImageSelected] = React.useState(false);
    const [isUploading, setUploading] = React.useState(false);
    const [caption, setCaption] = React.useState('');
    const [uri, setUri] = React.useState('');
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                logIn(true);
            } else {
                logIn(false);
            }
        })
        setImageId(uniqueId());
    }, [])

    const _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
        setPermissions(status);
        if (status === 'granted')
            console.log('PERMISSION GRANTED');
        else
            console.log("PERMISSION NOT GRANTED")
    }

    const uploadAndPublish = () => {
        if (isUploading === false) {
            if (caption !== '') {
                uploadImage(uri);
            } else {
                alert("Please enter a caption");
            }
        } else {
            console.log('ignore button tap as already uploading')
        }

    }

    const processUpload = (imageUrl) => {

        // const imageId = imageId;
        const userId = f.auth().currentUser.uid;
        // const caption = caption;
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);

        let photoObject = {
            author: userId,
            caption: caption,
            posted: timestamp,
            url: imageUrl
        }

        database.ref('photos/' + imageId).set(photoObject);
        database.ref('users/' + userId + '/photos/' + imageId).set(photoObject);
        alert('image uploaded');

        setUploading(false);
        setImageSelected(false);
        setCaption('');
        setUri('');
    }

    const uploadImage = async (uri) => {
        let userId = f.auth().currentUser.uid;
        let re = /(?:\.([^.]+))?$/;
        let ext = re.exec(uri)[1];
        setCurrentFileType(ext);
        setUploading(true);

        const response = await fetch(uri);
        const blob = await response.blob();
        let filePath = imageId + '.' + ext;

        const uploadTask = storage.ref('user/' + userId + '/img').child(filePath).put(blob);
        uploadTask.on('state_changed', function (snapshot) {
            let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("upload is " + progress + "% complete");
            setProgress(progress);
        }, function (error) {
            console.log('error with upload - ' + error);
        }, function () {
            setProgress(100);
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadUrl) {
                console.log("DOWNLOAD URL:", downloadUrl);
                processUpload(downloadUrl);
            })
        })
    }

    const findNewImage = async () => {
        _checkPermissions();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowEditing: true,
            quality: 1
        })
        if (!result.cancelled) {
            console.log('upload image');
            setImageSelected(true);
            // setImageId(uniqueId())
            setUri(result.uri);

            // uploadImage(result.uri);
        } else {
            setImageSelected(false)
            console.log('cancel')
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {isLogIn === true ? (
                <View style={{ flex: 1 }}>
                    {isImageSelected === true ? (
                        <View>
                            <View style={{
                                height: 70, paddingTop: 30, backgroundColor: 'white',
                                borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text>Upload</Text>
                            </View>

                            <View style={{ padding: 5 }}>
                                <Text style={{ marginTop: 5 }}>Caption:</Text>
                                <TextInput
                                    editable={true}
                                    placeholder={"Enter your caption..."}
                                    maxLength={150}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(text) => setCaption(text)}
                                    style={{ marginVertical: 10, height: 100, padding: 5, borderColor: 'grey', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                                />

                                <TouchableOpacity
                                    onPress={() => uploadAndPublish()}
                                    style={{ width: 170, marginHorizontal: 'auto', backgroundColor: 'purple', borderRadius: 5, paddingVertical: 10, alignSelf: 'center' }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center' }}>Upload and Publish</Text>
                                </TouchableOpacity>

                                {isUploading === true ? (
                                    <View style={{ marginTop: 10 }}>
                                        {progress !== 100 ? (
                                            <View style={{ alignItems: 'center' }}>
                                                <ActivityIndicator size="small" color="blue" />
                                                <Text>{progress}%</Text>
                                            </View>
                                        ) : (
                                                <Text style={{ alignSelf: "center" }}>Processing...</Text>
                                            )}
                                    </View>
                                ) : (
                                        <View></View>
                                    )}
                                <Image source={{ uri: uri }} style={{ marginTop: 10, resizeMode: 'cover', width: "100%", height: 275 }} />
                            </View>
                        </View>
                    ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
                                <TouchableOpacity
                                    onPress={() => findNewImage()}
                                    style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'blue', borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}>Select Photo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
            ) : (
                    <UserAuth message="Please login to upload a photo" />
                )}
        </View>
    );
}

export default Upload;