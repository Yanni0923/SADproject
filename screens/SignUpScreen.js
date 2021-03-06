import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';

import axios from 'axios';

const SignUpScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [signUpState, setSignUpState] = React.useState('###########');

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
    });

    // const textInputChange = (val) => {
    //     if (val.length !== 0) {
    //         setData({
    //             ...data,
    //             username: val,
    //             check_textInputChange: true
    //         });
    //     } else {
    //         setData({
    //             ...data,
    //             username: val,
    //             check_textInputChange: false
    //         });
    //     }
    // }

    const textInputChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    // const handlePasswordChange = (val) => {
    //     setData({
    //         ...data,
    //         password: val
    //     });
    // }
    const handlePasswordChange = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: true
            });
        } else {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const signupHandle = (username, password, confirm_password) => {
        if (username.length >= 4 && password.length >= 8 && confirm_password.length >= 8) {
            axios
                .post("http://localhost:7777/signup", {
                    username,
                    password,
                    confirm_password
                })
                .then((res) => {
                    // navigate("/signin");
                    // alert("?????????");
                    setSignUpState(res.data['message']);

                    if (res.data['message'] == 'REGISTER_SUCCESSFULLY') {
                        // alert("????????????!", username);
                        setSignUpState(() => username + ' ' + '???????????????');
                        // navigate("/home");
                    }
                    else if (res.data['message'] == 'ACCOUNT_ALREADY_EXISTS') {
                        // alert("???????????????!");
                        setSignUpState(() => username + ' ' + '??????????????????????????????????????????????????????');
                    }
                    else if (password !== confirm_password) {
                        setSignUpState(() => "??????????????????????????????");
                    }
                })
                .catch((e) => {
                    alert(e.response.error);
                    if (e.response.error) {
                        alert("????????????????????????????????????????????????????????????");
                    }
                });
        } // ?????????????????????????????????????????????
        else if (username === "") {
            // alert("?????????!");
            setSignUpState(() => '???????????????????????? Username???');
        }
        else if (password === "") {
            // alert("??????????????? Password!");
            setSignUpState(() => "??????????????? Password???");
        } else if (confirm_password === "") {
            // alert("???????????????????????? Confirm Password!");
            setSignUpState(() => "???????????????????????? Confirm Password???");
        } else if (password !== confirm_password) {
            setSignUpState(() => "??????????????????????????????");
        } else {
            setSignUpState(() => "?????????????????????????????????????????????");
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='lightsalmon' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>??????</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>??????????????? Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color={colors.text}
                            size={25}
                            style={{ paddingTop: 10, paddingRight: 10 }}
                        />
                        <TextInput
                            placeholder="Your Username"
                            placeholderTextColor='#AAAAAA'
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={25}
                                    style={{ paddingTop: 10, paddingLeft: 10 }}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {data.isValidUser ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>??????????????? Username ???????????? 4 ?????????</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>?????? Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color={colors.text}
                            size={25}
                            style={{ paddingTop: 10, paddingRight: 10 }}
                        />
                        <TextInput
                            placeholder="Your Password"
                            placeholderTextColor='#AAAAAA'
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={25}
                                    style={{ paddingTop: 10, paddingLeft: 10 }}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={25}
                                    style={{ paddingTop: 10, paddingLeft: 10 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>?????? Password ???????????? 8 ?????????</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>????????????????????? Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color={colors.text}
                            size={25}
                            style={{ paddingTop: 10, paddingRight: 10 }}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            placeholderTextColor='#AAAAAA'
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={25}
                                    style={{ paddingTop: 10, paddingLeft: 10 }}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={25}
                                    style={{ paddingTop: 10, paddingLeft: 10 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidConfirmPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>?????? Password ???????????? 8 ?????????</Text>
                        </Animatable.View>
                    }


                    {/* <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            By signing up you agree to our
                        </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                        <Text style={styles.color_textPrivate}>{" "}and</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                    </View> */}

                    {/* ?????????????????? */}
                    <Text style={styles.messageSuccess}>{signUpState}</Text>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { signupHandle(data.username, data.password, data.confirm_password) }} // ???????????? ?????????????????????????????????
                        >
                            <LinearGradient
                                colors={['lightsalmon', 'lightsalmon']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>??????</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: 'lightsalmon',
                                borderWidth: 3,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: 'lightsalmon'
                            }]}>???????????????</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightsalmon'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '300%'
    },
    text_footer: {
        color: '#000000',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    // textInput: {
    //     flex: 1,
    //     marginTop: Platform.OS === 'ios' ? 0 : -12,
    //     paddingLeft: 10,
    //     color: '#05375a',
    // },
    textInput: {
        // size
        width: '80%',
        padding: 10,
        marginBottom: 3,
        // style
        fontSize: '100%',
        borderBottomWidth: 2,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },
    errorMsg: {
        color: '#FF0000', // ??????
        fontSize: 14,
    },
    messageSuccess: {
        alignSelf: 'center',
        fontWeight: 'bold',
        paddingTop: 30,
    },
    messageError: {
        color: 'red',
        paddingTop: 3
    },
});