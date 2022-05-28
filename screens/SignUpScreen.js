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
                    alert("資料庫");
                    setSignUpState(res.data['message']);

                    if (res.data['message'] == 'REGISTER_SUCCESSFULLY') {
                        // alert("註冊成功!", username);
                        setSignUpState(() => username + ' ' + '註冊成功！');
                        // navigate("/home");
                    }
                    else if (res.data['message'] == 'ACCOUNT_ALREADY_EXISTS') {
                        // alert("帳密已存在!");
                        setSignUpState(() => username + ' ' + '註冊失敗：此使用者名稱與密碼已存在！');
                    }
                    else if (password !== confirm_password) {
                        setSignUpState(() => "兩次密碼輸入不一致！");
                    }
                })
                .catch((e) => {
                    alert(e.response.error);
                    if (e.response.error) {
                        alert("註冊失敗！此帳號已存在，請嘗試新的帳號！");
                    }
                });
        } // 會進來資料庫的話要確保以下幾點
        else if (username === "") {
            // alert("請輸入!");
            setSignUpState(() => '請輸入使用者名稱 Username！');
        }
        else if (password === "") {
            // alert("請輸入密碼 Password!");
            setSignUpState(() => "請輸入密碼 Password！");
        } else if (confirm_password === "") {
            // alert("請輸入第二次密碼 Confirm Password!");
            setSignUpState(() => "請輸入第二次密碼 Confirm Password！");
        } else if (password !== confirm_password) {
            setSignUpState(() => "兩次密碼輸入不一致！");
        } else {
            setSignUpState(() => "使用者名稱長度或密碼長度不足！");
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='lightsalmon' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>註冊</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>使用者名稱 Username</Text>
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
                            <Text style={styles.errorMsg}>使用者名稱 Username 需要至少 4 個字元</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>密碼 Password</Text>
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
                            <Text style={styles.errorMsg}>密碼 Password 需要至少 8 個字元</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>再輸入一次密碼 Confirm Password</Text>
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
                            <Text style={styles.errorMsg}>密碼 Password 需要至少 8 個字元</Text>
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

                    {/* 註冊成功與否 */}
                    <Text style={styles.messageSuccess}>{signUpState}</Text>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { signupHandle(data.username, data.password, data.confirm_password) }} // 要放東西 寫到資料庫和確定沒重複
                        >
                            <LinearGradient
                                colors={['lightsalmon', 'lightsalmon']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>註冊</Text>
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
                            }]}>切換至登入</Text>
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
        color: '#FF0000', // 紅色
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