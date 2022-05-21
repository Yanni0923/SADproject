import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,
    StyleSheet, Animated, TouchableHighlight, StatusBar
} from 'react-native';
import RNPickerSelect from "react-native-picker-select";

import * as notifications from '../model/Notifications.json';

const CreateInfoScreen = ({ navigation }) => {

    const Notifications = notifications.Notifications;
    const [listData, setListData] = useState(
        Notifications.map((NotificationItem, index) => ({
            key: `${index}`,
            title: NotificationItem.title,
            details: NotificationItem.details,
        })),
    );

    const [typeSelected, setTypeSelected] = useState('');

    const [msgSuccess, setMsgSuccess] = useState('');
    const [msgError, setMsgError] = useState('');
    // Team
    const [team, onChangeTeam] = useState('');
    const [school, onChangeSchool] = useState('');
    const [coach, onChangeCoach] = useState('');
    // Game
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [date, setDate] = useState(new Date());
    // Player
    const [belongTeam, setBelongTeam] = useState("");
    const [position, setPosition] = useState("");
    const [name, onChangeName] = useState("");
    const [number, onChangeNumber] = useState("");

    const onSelect = (key) => {
        setTypeSelected(key);
        setMsgSuccess('');
    }
    const onPress = () => {
        // Insert {team, school, ...} into database

        // Error if text input field is blank.
        // if () {
        //     setMsgError(() => '*此欄位必填')
        // }
        let suffix = '';
        if (typeSelected === '球隊') {
            suffix = team;
        } else if (typeSelected === '球賽') {
            suffix = homeTeam + ' vs. ' + awayTeam;
        } else if (typeSelected === '球員') {
            suffix = name;
        }
        setMsgSuccess(() => '成功新增'+typeSelected+' '+suffix);
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabbar}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => onSelect('球隊')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球隊</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => onSelect('球賽')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球賽</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => onSelect('球員')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球員</Text>
                </TouchableOpacity>
            </View>
            {
                (typeSelected == '球隊') ? (
                    <View style={styles.container}>
                        <Text style={styles.heading}>--  新增球隊  --</Text>
                        <Text style={styles.subheading}>球隊名稱</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeTeam}
                                value={team}
                                style={styles.textInput}
                                placeholder="NTU Owls"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>所屬學校／團體</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeSchool}
                                value={school}
                                style={styles.textInput}
                                placeholder="國立臺灣大學"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>教練姓名</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeCoach}
                                value={coach}
                                style={styles.textInput}
                                placeholder="Terry"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onPress}    // alert.alert('Button pressed')
                        >
                            <Text style={styles.btntext}>新增球隊</Text>
                        </TouchableOpacity>
                        <Text style={styles.messageSuccess}>{msgSuccess}</Text>
                    </View>) : null
            }
            {
                (typeSelected == '球賽') ? (
                    <View style={styles.container}>
                        <Text style={styles.heading}>--  新增球賽  --</Text>
                        <Text style={styles.subheading}>主隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: null }}
                                style={pickerSelectStyles}
                                onValueChange={(homeTeam) => setHomeTeam(homeTeam)}
                                items={[
                                    { label: "JavaScript", value: "JavaScript" },
                                    { label: "TypeScript", value: "TypeScript" },
                                    { label: "Python", value: "Python" },
                                    { label: "Java", value: "Java" },
                                    { label: "C++", value: "C++" },
                                    { label: "C", value: "C" },
                                ]}
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>客隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: null }}
                                style={pickerSelectStyles}
                                onValueChange={(awayTeam) => setAwayTeam(awayTeam)}
                                items={[
                                    { label: "JavaScript", value: "JavaScript" },
                                    { label: "TypeScript", value: "TypeScript" },
                                    { label: "Python", value: "Python" },
                                    { label: "Java", value: "Java" },
                                    { label: "C++", value: "C++" },
                                    { label: "C", value: "C" },
                                ]}
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>比賽日期</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeCoach}
                                value={coach}
                                style={styles.textInput}
                                placeholder="2022-05-18"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onPress}    // alert.alert('Button pressed')
                        >
                            <Text style={styles.btntext}>新增球賽</Text>
                        </TouchableOpacity>
                        <Text style={styles.messageSuccess}>{msgSuccess}</Text>
                    </View>) : null
            }
            {
                (typeSelected == '球員') ? (
                    <View style={styles.container}>
                        <Text style={styles.heading}>--  新增球員  --</Text>
                        <Text style={styles.subheading}>球隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: null }}
                                style={pickerSelectStyles}
                                onValueChange={(belongTeam) => setBelongTeam(belongTeam)}
                                items={[
                                    { label: "NTU Owls", value: "NTU Owls" },
                                    { label: "TypeScript", value: "TypeScript" },
                                    { label: "Python", value: "Python" },
                                    { label: "Java", value: "Java" },
                                    { label: "C++", value: "C++" },
                                    { label: "C", value: "C" },
                                ]}
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>位置</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇位置", value: null }}
                                style={pickerSelectStyles}
                                onValueChange={(position) => setPosition(position)}
                                items={[
                                    { label: "控球後衛(PG)", value: "PG" },
                                    { label: "得分後衛(SG)", value: "SG" },
                                    { label: "小前鋒(SF)", value: "SF" },
                                    { label: "大前鋒(PF)", value: "PF" },
                                    { label: "中鋒(C)", value: "C" },
                                ]}
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>球員名稱</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeName}
                                value={name}
                                style={styles.textInput}
                                placeholder="Adam Silver"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <Text style={styles.subheading}>球員背號</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeNumber}
                                value={number}
                                style={styles.textInput}
                                placeholder="23"
                            />
                            <Text style={styles.messageError}>{msgError}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onPress}    // alert.alert('Button pressed')
                        >
                            <Text style={styles.btntext}>新增球員</Text>
                        </TouchableOpacity>
                        <Text style={styles.messageSuccess}>{msgSuccess}</Text>
                    </View>) : null
            }
        </View>
    );
};

export default CreateInfoScreen;


const styles = StyleSheet.create({
    container: {
        // format
        flex: 1,
        // size
        padding: '6%',
        // style
        backgroundColor: '#f4f4f4',
    },
    heading: {
        // format
        alignSelf: 'center',
        // size
        paddingTop: 16,
        paddingBottom: 30,
        // style
        fontSize: '200%',
        fontWeight: 500
    },
    subheading: {
        // size
        paddingBottom: 10,
        // style
        fontSize: '120%',
        fontWeight: 500
    },

    input: {
        // format
        alignSelf: 'center',
        // size
        width: '100%',
        height: 80,
    },
    textInput: {
        // size
        width: '100%',
        padding: 10,
        marginBottom: 3,
        // style
        fontSize: '100%',
        borderBottomWidth: 2,
    },
    button: {
        alignSelf: 'center',
        width: '64%',
        padding: 10,
        backgroundColor: "black",
        borderRadius: 25
    },
    btntext: {
        alignSelf: 'center',
        fontSize: '140%',
        color: 'white'
    },
    messageSuccess: {
        alignSelf: 'center',
        padding: 10,
    },
    messageError: {
        color: 'red'
    },
    tabbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20
    },
    tab: {
        display: 'flex',
        width: '24%',
        padding: 10,
        backgroundColor: "grey",
        borderRadius: 12
    },
    tabtext: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 500,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
    },
    inputAndroid: {
    },
    inputWeb: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 8,
        borderWidth: 1.8,
        borderRadius: 20,
        fontSize: '100%',
    },
});