import React from 'react';
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native';
import { database } from '../config/config';
import { timeConverter } from '../Utils/TimeUtils';

const PhotoList = (props) => {
    const [photoFeed, setPhotoFeed] = React.useState([]);
    const [isRefresh, setRefresh] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);
    const [isEmpty, empty] = React.useState(false);

    React.useEffect(() => {
        const { isUser, userId } = props;
        if (isUser) {
            loadFeed(userId);
        } else {
            loadFeed('');
        }
    }, [])

    const addToFlatlist = (photo_feed, data, photo) => {

        var photoObj = data[photo];
        database.ref('users').child(photoObj.author).child('username').once('value').then((snapshot) => {
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            photo_feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: timeConverter(photoObj.posted),
                timestamp: photoObj.posted,
                author: data,
                authorId: photoObj.author
            })
            setRefresh(false);
            setLoading(false);
            photo_feed.sort((a, b) => a.timestamp < b.timestamp);
            setPhotoFeed(photo_feed);
        }).catch((error) => console.log(error));
    }

    const loadFeed = (userId = '') => {
        setRefresh(true);
        setPhotoFeed([]);

        let loadRef = database.ref('photos');
        if (userId !== '') {
            loadRef = database.ref('users').child(userId).child('photos');
        }
        loadRef.orderByChild('posted').once('value').then((snapshot) => {
            const exists = (snapshot.val() !== null);
            if (exists) {
                data = snapshot.val();
                let photo_feed = [];
                empty(false);
                for (let photo in data) {
                    addToFlatlist(photo_feed, data, photo);
                }

            } else {
                empty(true);
            }
        }).catch((error) => console.log(error));
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoading === true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {isEmpty === true ? (
                        <Text>No photos found...</Text>
                    ) : (
                            <Text>loading...</Text>
                        )}
                </View>
            ) : (
                    <FlatList
                        refreshing={isRefresh}
                        onRefresh={loadFeed}
                        data={photoFeed}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1, backgroundColor: '#eee' }}
                        renderItem={({ item, index }) => (
                            <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                                <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{item.posted}</Text>
                                    <TouchableOpacity
                                        onPress={() => props.navigation.navigate('User', { userId: item.authorId })}>
                                        <Text>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Image
                                        source={{ uri: item.url }}//'https://source.unsplash.com/random/500' + Math.floor((Math.random() * 800) + 500) }}
                                        style={{ resizeMode: 'cover', width: '100%', height: 275 }}
                                    />
                                </View>
                                <View style={{ padding: 5 }}>
                                    <Text>{item.caption}</Text>
                                    <TouchableOpacity
                                        onPress={() => props.navigation.navigate('Comments', { photoId: item.id })}>
                                        <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>[ View Comments ]</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
        </View>
    );
}

export default PhotoList;