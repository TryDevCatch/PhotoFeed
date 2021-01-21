import React from 'react';
import { Text, View } from 'react-native';
import PhotoList from '../Components/PhotoList';

const Feed = ({ navigation }) => {

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                height: 70, paddingTop: 30, backgroundColor: 'white',
                borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>Feed</Text>
            </View>
            <PhotoList isUser={false} navigation={navigation} />
        </View>
    );
}

export default Feed;