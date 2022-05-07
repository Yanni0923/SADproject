import React from "react";
import { View, Text, Button, StyleSheet } from 'react-native';


const CreateInfoScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>CreateInfoScreen</Text>
            <Button
                title="Click Here"
                onPress={() => alert("Button Clicked!")}
            />
        </View>
    );
};


export default CreateInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFCCCC'

    },
});