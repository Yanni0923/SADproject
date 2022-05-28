import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Modal,
    Animated
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from "../constants";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import * as users from '../model/users.json';

const SignInScreen = ({ navigation }) => {
    /* 串接資料庫 */
    // const express = require('express');
    const db = require('../server/config/db');
    // const app = express();
    // 
    const [signInState, setSignInState] = React.useState('###########');
    const Users = users.Users;
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { colors } = useTheme();
    console.log(React.useContext(AuthContext));
    // const { signIn } = React.useContext(AuthContext);

    const [showSignInSuccessModal, setShowSignInSuccessModal] = useState(false);

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

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }


    // 點擊登入頁面的送出
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = (username, password) => {
        if (username.length >= 4 && password.length >= 8) {
            axios
                .post("http://localhost:7777/signin", {
                    username: username,
                    password: password,
                })
                .then((res) => {
                    if (res.data['message'] == 'LOGIN_SUCCESSFULLY') {
                        setSignInState(() => '歡迎使用者 ' + username + ' 登入成功！');
                    }
                    else if (res.data['message'] == 'ACCOUNT_NOT_EXIST') {
                        setSignInState(() => '此使用者名稱與密碼不存在！');
                    }
                })
                .catch((e) => {
                    if (e.response.error) {
                        alert("port 7777：伺服器連線錯誤！");
                    }
                });
        } // 會進來資料庫的話要確保以下幾點
        else if (username === "") {
            // alert("請輸入!");
            setSignInState(() => '請輸入使用者名稱 Username！');
        } else if (username.length < 4) {
            setSignInState(() => "使用者名稱 Username 長度不足！");
        } else if (password === "") {
            // alert("請輸入密碼 Password!");
            setSignInState(() => "請輸入密碼 Password！");
        } else if (password.length < 8) {
            setSignInState(() => "密碼 Password 長度不足！");
        }
    };
    const loginHandle = (userName, password) => {

        // signIn = React.useContext(AuthContext);
        console.log(userName);
        console.log(password);

        // db.query('select * from account', function (err, rows) {
        //     if (err) throw err;
        //     console.log('Response: ', rows);
        // });


        const foundUser = Users.filter(item => {
            return userName == item.username && password == item.password;
        });

        console.log(foundUser);

        // 帳密輸入皆不得為空值
        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }

        // 都沒有符合的帳密就跳 Invalid
        if (foundUser.length == 0) {
            Alert.alert('Invalid User!', 'Username or password is incorrect.', [
                { text: 'Okay' }
            ]);
            return;
        }
        // 過關，完成登入
        // signIn(foundUser); // 這裡還要再做，只要 length > 0 就可以跳轉到首頁
        setShowSignInSuccessModal(true);
    }

    const reEnter = () => {
        () => navigation.navigate('SignUp'); // 改成切到正常使用的頁面
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='lightsalmon' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>登入</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>使用者名稱 Username</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={25}
                        style={{ paddingTop: 10, paddingRight: 10 }}
                    />
                    <TextInput
                        placeholder="Your Username"
                        placeholderTextColor="#AAAAAA"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
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
                    color: colors.text,
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
                        placeholderTextColor="#AAAAAA"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
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


                <TouchableOpacity>
                    <Text style={{ color: 'lightsalmon', marginTop: 15 }}>忘記密碼？</Text>
                </TouchableOpacity>


                {/* 註冊成功與否 */}
                <Text style={styles.messageSuccess}>{signInState}</Text>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { login(data.username, data.password) }}
                    >
                        <LinearGradient
                            colors={['lightsalmon', 'lightsalmon']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>登入</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        style={[styles.signIn, {
                            borderColor: 'lightsalmon',
                            borderWidth: 3,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: 'lightsalmon'
                        }]}>切換至註冊</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSignInSuccessModal}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        backgroundColor: COLORS.white,
                        width: '90%',
                        borderRadius: 20,
                        padding: 20,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}>{(showSignInSuccessModal) ? 'Congratulation!' : 'Oops!'}</Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginVertical: 20
                        }}>
                            <Text style={{
                                fontSize: 30,
                                color: (showSignInSuccessModal) ? COLORS.success : COLORS.error
                            }}>登入成功</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Splash')}
                            style={{
                                backgroundColor: COLORS.accent,
                                padding: 20, width: '100%', borderRadius: 20
                            }}
                        >
                            <Text style={{
                                textAlign: 'center', color: COLORS.white, fontSize: 20
                            }}>開始使用</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

export default SignInScreen;

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
        flex: 3,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#ffffff',
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
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
    errorMsg: {
        color: '#FF0000', // 紅色
        fontSize: 14,
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