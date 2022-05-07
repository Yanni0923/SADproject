import React from "react";
import { View, Text, Button, StyleSheet } from 'react-native';


const QueryModifyScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>QueryModifyScreen</Text>
            <Button
                title="Click Here"
                onPress={() => alert("Button Clicked!")}
            />
        </View>
    );
};


export default QueryModifyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFCCCC'

    },
});