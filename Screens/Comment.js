import React from 'react';
import { FlatList, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { f, auth, database } from '../config/config';
import UserAuth from '../Components/UserAuth';
import { timeConverter } from '../Utils/TimeUtils';
import { uniqueId } from '../Utils/IdUtils';

const Comment = ({ route, navigation }) => {
    const [isLogIn, logIn] = React.useState(false);
    const [commentsList, setCommentsList] = React.useState([]);
    const [isRefresh, setRefresh] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);
    const [comment, setComment] = React.useState('');
    const [imageId, setImageId] = React.useState('');

    React.useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                logIn(true);
            } else {
                logIn(false);
            }
        });
        checkParams();
    }, [])

    const checkParams = () => {
        let params = route.params;
        if (params) {
            if (params.photoId) {
                setImageId(params.photoId);
                fetchComments(params.photoId);
            }
        }
    }

    const addCommentToList = (comments_list, data, comment) => {
        let commentObject = data[comment];
        database.ref('users').child(commentObject.author).child('username').once('value').then(function (snapshot) {
            let exists = (snapshot !== null);
            if (exists) data = snapshot.val();
            comments_list.push({
                id: comment,
                comment: commentObject.comment,
                posted: timeConverter(commentObject.posted),
                timestamp: commentObject.posted,
                author: data,
                authorId: commentObject.author
            });

            setRefresh(false);
            setLoading(false);
            comments_list.sort((a, b) => a.timestamp < b.timestamp)
            setCommentsList(comments_list);
        }).catch((error) => console.log(error));
    }

    const fetchComments = (photoId) => {
        setRefresh(true);
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function (snapshot) {
            const exists = (snapshot !== null);
            if (exists) data = snapshot.val();
            let comments_list = []
            for (let comment in data) {
                addCommentToList(comments_list, data, comment);
            }

        }).catch((error) => console.log(error))
    }

    const postComment = () => {
        if (comment !== '') {
            const userId = f.auth().currentUser.uid;
            const commentId = uniqueId();
            const dateTime = Date.now();
            const timestamp = Math.floor(dateTime / 1000);

            setComment('');

            const commentObject = {
                posted: timestamp,
                author: userId,
                comment: comment
            }

            database.ref('/comments/' + imageId + '/' + commentId).set(commentObject);
            reloadCommentsList();

        } else {
            alert('Please enter a comment before posting');
        }
    }

    const reloadCommentsList = () => {
        setCommentsList([]);
        fetchComments(imageId);
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                height: 70, paddingTop: 30, backgroundColor: 'white',
                borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 100 }}>
                    <Text style={{ paddingLeft: 10, fontSize: 12, fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
                <Text>Comments</Text>
                <Text style={{ width: 100 }}></Text>
            </View>

            {commentsList.length === 0 ? (
                <Text>No comments found...</Text>
            ) : (
                    <FlatList
                        data={commentsList}
                        refreshing={isRefresh}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1, backgroundColor: '#eee' }}
                        renderItem={({ item, index }) => (
                            <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                                <View style={{ padding: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                    <Text>{item.posted}</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('User', { userId: item.authorId })}>
                                        <Text>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 5 }}>
                                    <Text>{item.comment}</Text>
                                </View>
                            </View>
                        )} />
                )}
            {isLogIn === true ? (
                <KeyboardAvoidingView behavior="padding" enabled style={{ borderTopWidth: 1, borderTopColor: 'grey', padding: 10, marginBottom: 15 }}>
                    <Text style={{ fontWeight: 'bold' }}>Post Comment</Text>
                    <View>
                        <TextInput
                            editable={true}
                            placeholder="enter your comment here..."
                            onChangeText={(text) => setComment(text)}
                            value={comment}
                            style={{ marginVertical: 10, height: 50, padding: 5, borderTopColor: 'grey', borderRadius: 3, backgroundColor: 'white', color: 'black' }}
                        />
                        <TouchableOpacity
                            onPress={() => postComment()}
                            style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}>
                            <Text style={{ color: 'white', alignSelf: 'center' }}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                    <UserAuth message="Please login to post a comment" moveScreen={true} navigation={navigation} />
                )}
        </View>
    );
}

export default Comment;