import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { borderRadius } from '@mui/system';


const SplashScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../assets/logo.jpg')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
                animation="fadeInUpBig"
            >
                <Text style={[styles.title, {
                    color: colors.text
                }]}>臺大男籃{"\n"}對手情報蒐集系統</Text>
                <Text style={styles.text}>歡迎使用！SADFighting！</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}
                        style={{ width: '200', height: '500' }}>
                        <LinearGradient
                            colors={['lightsalmon', 'lightsalmon']} //firebrick
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>登入／註冊</Text>
                            {/* <MaterialIcons
                                name="navigate-next"
                                color="#fff"
                                size={40}
                            /> */}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightsalmon'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingBottom: 200,
        paddingHorizontal: 30
    },
    logo: {
        borderRadius: 150,
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 40,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        // flex: 1,
        alignItems: 'center',

        // paddingBottom: 0,
        // marginBottom: 150,
        // width: 300,
        // height: 200,
        marginTop: 30
    },
    signIn: {
        // width: '200%',
        // height: '200%',
        padding: 20,
        margin: 20,
        paddingHorizontal: 30,  // 按鈕寬度
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        flexDirection: 'row'
    },
    textSign: {
        fontSize: '150%',  // 文字大小
        color: 'white',
        fontWeight: 'bold'
    }
});