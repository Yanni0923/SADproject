import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Picker, Switch, Button, Animated, ScrollView, TouchableHighlight, Dimensions, SafeAreaView } from 'react-native'

import Swiper from 'react-native-swiper/src';

const CreateInfoScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer}>
                <Swiper
                    autoplay={true}
                    horizontal={false}
                    height={200}
                    activeDotColor="#FFCCCC">
                    <View style={styles.slide}>
                        <Image
                            source={require('../assets/logo.png')}
                            resizeMode='cover'
                            style={styles.sliderImage}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                            source={require('../assets/logo.jpg')}
                            resizeMode='cover'
                            style={styles.sliderImage}
                        />
                    </View>
                </Swiper>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },

});
export default CreateInfoScreen;