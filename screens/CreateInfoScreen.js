import axios from 'axios';
import React, { Component, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert,
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
    const msgError = '*必填';
    // Team
    const [team, onChangeTeam] = useState('');
    const [school, onChangeSchool] = useState('');
    const [coach, onChangeCoach] = useState('');
    // Game
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [date, onChangeDate] = useState("");
    // Player
    const [belongTeam, setBelongTeam] = useState("");
    const [position, setPosition] = useState("");
    const [name, onChangeName] = useState("");
    const [number, onChangeNumber] = useState("");

    const [teams, setTeams] = useState([]);

    const getTeamsList = (() => {
        // Get team data
        axios.get('http://localhost:7777/getTeams')
            .then((response) => {
                const teamList = response.data['data'];
                const teams_updated = teamList.map((e) => { return { label: e, value: e } });
                console.log(teams_updated);
                setTeams(teams_updated);
                console.log(teams);
                // some mysterious issues here...
            })
            .catch((error) => { console.error(error) })
    });

    const onSelect = (key) => {
        setTypeSelected(key);
        // refresh values
        setMsgSuccess('');
        onChangeTeam('');
        onChangeSchool('');
        onChangeCoach('');
        setHomeTeam('');
        setAwayTeam('');
        onChangeDate('');
        setBelongTeam('');
        setPosition('');
        onChangeName('');
        onChangeNumber('');
        getTeamsList();    // update teams
    }
    const onPress = () => {
        // Insert {team, school, ...} into database
        // TODO: Check if input data is in correct data type
        let suffix = '';
        if (typeSelected === '球隊') {
            if (team && school && coach) {
                axios
                    .post("http://localhost:7777/createTeam", {
                        name: team,
                        school: school,
                        coach: coach
                    })
                    .then((res) => {
                        console.log(res.data['message']);
                        if (res.data['message'] == 'Created team: ' + team) {
                            suffix = team;
                            setMsgSuccess(() => '成功新增' + typeSelected + ' ' + suffix);
                        }
                    })
                    .catch((e) => {
                        if (e.response.error) {
                            alert("Server Error: Check the console for details.");
                        }
                    });
            } else {
                alert('請確認所有資料皆已填寫完畢！');
            }
        } else if (typeSelected === '球賽') {
            if (homeTeam && awayTeam && date) {
                axios
                    .post("http://localhost:7777/createGame", {
                        host: homeTeam,
                        guest: awayTeam,
                        date: date
                    })
                    .then((res) => {
                        console.log(res.data['message']);
                        if (res.data['message'] == 'Created game') {
                            suffix = homeTeam + ' vs. ' + awayTeam;
                            setMsgSuccess(() => '成功新增' + typeSelected + ' ' + suffix);
                        }
                    })
                    .catch((e) => {
                        if (e.response.error) {
                            alert("Server Error: Check the console for details.");
                        }
                    });
            } else {
                alert('請確認所有資料皆已填寫完畢！');
            }
        } else if (typeSelected === '球員') {
            if (belongTeam && position && name && number) {
                axios
                    .post("http://localhost:7777/createPlayer", {
                        team: belongTeam,
                        name: name,
                        position: position,
                        number: number
                    })
                    .then((res) => {
                        console.log(res.data['message']);
                        if (res.data['message'] == 'Created player: ' + name) {
                            suffix = name;
                            setMsgSuccess(() => '成功新增' + typeSelected + ' ' + suffix);
                        }
                    })
                    .catch((e) => {
                        if (e.response.error) {
                            alert("Server Error: Check the console for details.");
                        }
                    });
            } else {
                alert('請確認所有資料皆已填寫完畢！');
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabbar}>
                <TouchableOpacity
                    style={styles.tab_team}
                    onPress={() => onSelect('球隊')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球隊</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab_game}
                    onPress={() => onSelect('球賽')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球賽</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab_player}
                    onPress={() => onSelect('球員')}
                >
                    <Text style={styles.tabtext}>新增{'\n'}球員</Text>
                </TouchableOpacity>
            </View>
            {
                (typeSelected == '球隊') ? (
                    <View style={styles.container}>
                        <Text style={styles.heading}>####  新增球隊  ####</Text>
                        <Text style={styles.subheading}>球隊名稱</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeTeam}
                                value={team}
                                style={styles.textInput}
                                placeholder="NTU Owls"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(team === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>所屬學校／團體</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeSchool}
                                value={school}
                                style={styles.textInput}
                                placeholder="國立臺灣大學"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(school === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>教練姓名</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeCoach}
                                value={coach}
                                style={styles.textInput}
                                placeholder="Terry"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(coach === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
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
                        <Text style={styles.heading}>####  新增球賽  ####</Text>
                        <Text style={styles.subheading}>主隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: "" }}
                                placeholderTextColor="#AAAAAA"
                                style={pickerSelectStyles}
                                onValueChange={(homeTeam) => setHomeTeam(homeTeam)}
                                items={teams}
                            />
                            {(homeTeam === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>客隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: "" }}
                                placeholderTextColor="#AAAAAA"
                                style={pickerSelectStyles}
                                onValueChange={(awayTeam) => setAwayTeam(awayTeam)}
                                items={teams}
                            />
                            {(awayTeam === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>比賽日期</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeDate}
                                value={date}
                                style={styles.textInput}
                                placeholder="2022-05-18"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(date === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
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
                        <Text style={styles.heading}>####  新增球員  ####</Text>
                        <Text style={styles.subheading}>球隊名稱</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇球隊", value: '' }}
                                placeholderTextColor="#AAAAAA"
                                style={pickerSelectStyles}
                                onValueChange={(belongTeam) => setBelongTeam(belongTeam)}
                                items={teams}
                            />
                            {(belongTeam === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>位置</Text>
                        <View style={styles.input}>
                            <RNPickerSelect
                                placeholder={{ label: "選擇位置", value: '' }}
                                placeholderTextColor="#AAAAAA"
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
                            {(position === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>球員名稱</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeName}
                                value={name}
                                style={styles.textInput}
                                placeholder="Adam Silver"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(name === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
                        </View>
                        <Text style={styles.subheading}>球員背號</Text>
                        <View style={styles.input}>
                            <TextInput
                                onChangeText={onChangeNumber}
                                value={number}
                                style={styles.textInput}
                                placeholder="23"
                                placeholderTextColor="#AAAAAA"
                            />
                            {(number === '') ? <Text style={styles.messageError}>{msgError}</Text> : <Text></Text>}
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
        fontWeight: 'bold'
    },
    subheading: {
        // size
        paddingTop: 8,
        paddingBottom: 8,
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
        backgroundColor: "lightsalmon",
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
        color: 'red',
        paddingTop: 3
    },
    tabbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20
    },
    tab_team: {
        display: 'flex',
        width: '27%',
        padding: 10,
        backgroundColor: "#6699CC",
        borderRadius: 12
    },
    tab_game: {
        display: 'flex',
        width: '27%',
        padding: 10,
        backgroundColor: "#FF6666",
        borderRadius: 12
    },
    tab_player: {
        display: 'flex',
        width: '27%',
        padding: 10,
        backgroundColor: "#FFAA33",
        borderRadius: 12
    },
    tabtext: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
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
        borderWidth: 1.8,
        borderRadius: 20,
        fontSize: '100%',
    },
});