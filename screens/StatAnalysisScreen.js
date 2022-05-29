import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Picker, Switch, Button, Animated, ScrollView, TouchableHighlight, Dimensions, SafeAreaView } from 'react-native'
import { COLORS, SIZES } from "../constants";
import { SearchBar } from 'react-native-elements';
import { useTheme } from "@react-navigation/native";


// 測試資料
// import * as data from '../data/QuizData.json';
import { color, set } from "react-native-reanimated";

import { CSVLink } from "react-csv";
import axios from 'axios';


function modify(dict, result, ft) {
    dict.times++;
    if (result != 'Pass' && result != 'Common Foul') {
        dict.control++;
    }
    if (result == '2y' || result == '3y') {
        dict.FGM++;
    }
    if (result != 'Pass' && result != 'TO') {
        dict['FGA']++;
    }
    if (result == '3y') {
        dict['3PM']++;
    }
    if (result == '3y' || result == '3x') {
        dict['3PA']++;
    }
    if (result == 'TO') {
        dict.miss++;
    }
    if (result == 'Pass') {
        dict.pass++;
    }
    if (result == 'Common Foul' || result == 'Shooting Foul') {
        dict.fouled++;
    }
    if (ft == '3y') {
        dict['point'] += 3;
    }
    if (ft == '2y') {
        dict['point'] += 2;
    }
    if (ft == '1y') {
        dict['point'] += 1;
    }

    return dict;
}

function final_modify(dict, ngame) {
    dict.times /= ngame;
    dict.control /= ngame;
    dict.point += (dict['3PM'] * 3 + (dict['FGM'] - dict['3PM']) * 2);
    dict.point /= ngame;
    dict.PPP = dict.point / dict.control;
    dict.FGM /= ngame;
    dict.FGA /= ngame;
    dict['FG%'] = dict.FGM / dict.FGA
    dict['3PA'] /= ngame;
    dict['3PM'] /= ngame;
    dict.miss /= ngame;
    dict['3P%'] = dict['3PM'] / dict['3PA'];

    return dict;
}

function filter(search1) {
    // Alert.alert('Simple Button pressed')
    if (search1 == '') {
        // alert("請輸入完整球隊或球員名稱");
        // setSearchState("請輸入完整球隊或球員名稱");
    }
    else {
        // alert("搜尋完成！可以選擇匯出報表類型了！")
        // setSearchState("搜尋完成！可以選擇匯出報表類型了！");
    }

}

function dataMaker(data, search) {

    //if(type == 1):
    // db.query('select * from ntubb.play', function (err, rows) {
    //     if (err) throw err;
    //     console.log('Response: ', rows);
    // });



    var dict_lst = [{ 'name': 'Total' }, { 'name': 'Transition' }, { 'name': 'Catch & Shoot' }, { 'name': 'Atk Close-out' }, { 'name': 'P&R BH' }, { 'name': 'Others' }, { 'name': 'Post up' }, { 'name': 'Iso' }, { 'name': 'Put Back' }, { 'name': 'Cut' }, { 'name': 'Eat Cake' }, { 'name': 'P&R Men' }, { 'name': 'Hand Off' }, { 'name': 'Off screen' }];


    var tot_lst = [{ 'name': 'Total' }, { 'name': 'Set shot' }, { 'name': 'Drive' }, { 'name': 'Drive right' }, { 'name': 'Drive left' }, { 'name': 'Drive others' }, { 'name': 'Pull-up' }, { 'name': 'Pull-up right' }, { 'name': 'Pull-up left' }, { 'name': 'Pull-up others' }, { 'name': 'Exception' }]

    var hab_lst = [{ 'name': 'Right' }, { 'name': 'Left' }, { 'name': 'Others' }, { 'name': 'Exception' }]

    var pos_lst = [{ 'name': 'Total' }, { 'name': 'Right shoulder' }, { 'name': 'Left shouder' }, { 'name': 'Face up' }, { 'name': 'Post Pin' }, { 'name': 'Pass' }, { 'name': 'Turnover' }]


    for (var i in dict_lst) {
        dict_lst[i]['times%'] = 0;
        dict_lst[i]['times'] = 0;
        dict_lst[i]['control'] = 0;
        dict_lst[i]['control%'] = 0;
        dict_lst[i]['point'] = 0;
        dict_lst[i]['PPP'] = 0;
        dict_lst[i]['FGM'] = 0;
        dict_lst[i]['FGA'] = 0;
        dict_lst[i]['FG%'] = 0;
        dict_lst[i]['3PA'] = 0;
        dict_lst[i]['3PM'] = 0;
        dict_lst[i]['miss'] = 0;
        dict_lst[i]['pass'] = 0;
        dict_lst[i]['fouled'] = 0;
    }

    for (var i in tot_lst) {
        tot_lst[i]['times'] = 0;
        tot_lst[i]['control'] = 0;
        tot_lst[i]['point'] = 0;
        tot_lst[i]['PPP'] = 0;
        tot_lst[i]['FGM'] = 0;
        tot_lst[i]['FGA'] = 0;
        tot_lst[i]['FG%'] = 0;
        tot_lst[i]['3PA'] = 0;
        tot_lst[i]['3PM'] = 0;
        tot_lst[i]['miss'] = 0;
        tot_lst[i]['pass'] = 0;
        tot_lst[i]['fouled'] = 0;
    }

    for (var i in hab_lst) {
        hab_lst[i]['times'] = 0;
        hab_lst[i]['control'] = 0;
        hab_lst[i]['point'] = 0;
        hab_lst[i]['PPP'] = 0;
        hab_lst[i]['FGM'] = 0;
        hab_lst[i]['FGA'] = 0;
        hab_lst[i]['FG%'] = 0;
        hab_lst[i]['3PA'] = 0;
        hab_lst[i]['3PM'] = 0;
        hab_lst[i]['miss'] = 0;
        hab_lst[i]['pass'] = 0;
        hab_lst[i]['fouled'] = 0;
    }

    for (var i in pos_lst) {
        pos_lst[i]['times'] = 0;
        pos_lst[i]['control'] = 0;
        pos_lst[i]['point'] = 0;
        pos_lst[i]['PPP'] = 0;
        pos_lst[i]['FGM'] = 0;
        pos_lst[i]['FGA'] = 0;
        pos_lst[i]['FG%'] = 0;
        pos_lst[i]['3PA'] = 0;
        pos_lst[i]['3PM'] = 0;
        pos_lst[i]['miss'] = 0;
        pos_lst[i]['pass'] = 0;
        pos_lst[i]['fouled'] = 0;
    }


    for (var i in data) {
        var result = data[i].result;
        var ft = data[i].free_throw;
        dict_lst[0] = modify(dict_lst[0], result, ft);

        if (data[i].type == 'Transition') {
            dict_lst[1] = modify(dict_lst[1], result, ft);
        }
        else if (data[i].type == 'Catch & Shoot') {
            dict_lst[2] = modify(dict_lst[2], result), ft;
        }
        else if (data[i].type == 'Atk Close-out') {
            dict_lst[3] = modify(dict_lst[3], result, ft);
        }
        else if (data[i].type == 'P&R BH') {
            dict_lst[4] = modify(dict_lst[4], result, ft);
        }
        else if (data[i].type == 'Others') {
            dict_lst[5] = modify(dict_lst[5], result, ft);
        }
        else if (data[i].type == 'Right Post (D)' || data[i].type == 'Left Post (D)') {
            dict_lst[6] = modify(dict_lst[6], result, ft);
        }
        else if (data[i].type == 'Iso') {
            dict_lst[7] = modify(dict_lst[7], result, ft);
        }
        else if (data[i].type == 'Put Back') {
            dict_lst[8] = modify(dict_lst[8], result, ft);
        }
        else if (data[i].type == 'Cut') {
            dict_lst[9] = modify(dict_lst[9], result, ft);
        }
        else if (data[i].type == 'Eat Cake') {
            dict_lst[10] = modify(dict_lst[10], result, ft);
        }
        else if (data[i].type == 'P&R Men') {
            dict_lst[11] = modify(dict_lst[11], result, ft);
        }
        else if (data[i].type == 'Hand Off') {
            dict_lst[12] = modify(dict_lst[12], result, ft);
        }
        else if (data[i].type == 'Off screen') {
            dict_lst[13] = modify(dict_lst[13], result, ft);
        }


        var finish = data[i].finish;

        if (finish == 'Set shot') {
            tot_lst[1] = modify(tot_lst[1], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Drive right') {
            tot_lst[3] = modify(tot_lst[3], result, ft);
            tot_lst[2] = modify(tot_lst[2], result, ft);
            hab_lst[0] = modify(hab_lst[0], result, ft);
            tot_lst[0] = modify(tot_lst[0], result), ft;
        }
        else if (finish == 'Drive left') {
            tot_lst[4] = modify(tot_lst[4], result, ft);
            tot_lst[2] = modify(tot_lst[2], result, ft);
            hab_lst[1] = modify(hab_lst[1], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Drive others') {
            tot_lst[5] = modify(tot_lst[5], result, ft);
            tot_lst[2] = modify(tot_lst[2], result, ft);
            hab_lst[2] = modify(hab_lst[2], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Pull-up right') {
            tot_lst[7] = modify(tot_lst[7], result, ft);
            tot_lst[6] = modify(tot_lst[6], result, ft);
            hab_lst[0] = modify(hab_lst[0], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Pull-up left') {
            tot_lst[8] = modify(tot_lst[8], result, ft);
            tot_lst[6] = modify(tot_lst[6], result, ft);
            hab_lst[1] = modify(hab_lst[1], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Pull-up others') {
            tot_lst[9] = modify(tot_lst[9], result, ft);
            tot_lst[6] = modify(tot_lst[6], result, ft);
            hab_lst[2] = modify(hab_lst[2], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }
        else if (finish == 'Exception') {
            tot_lst[10] = modify(tot_lst[10], result, ft);
            hab_lst[3] = modify(hab_lst[3], result, ft);
            tot_lst[0] = modify(tot_lst[0], result, ft);
        }

        if (finish == 'Right shoulder') {
            pos_lst[1] = modify(pos_lst[1], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
        else if (finish == 'Left shoulder') {
            pos_lst[2] = modify(pos_lst[2], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
        else if (finish == 'Face up') {
            pos_lst[3] = modify(pos_lst[3], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
        else if (finish == 'Post Pin') {
            pos_lst[4] = modify(pos_lst[4], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
        else if (finish == 'Pass') {
            pos_lst[5] = modify(pos_lst[5], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
        else if (finish == 'Turnover') {
            pos_lst[6] = modify(pos_lst[6], result, ft);
            pos_lst[0] = modify(pos_lst[0], result, ft);
        }
    }


    var ngame = [...new Set(data.map(item => item.game_id))].length;
    var ntimes = dict_lst[0]['times'];
    var ncontrol = dict_lst[0]['control'];


    for (var i in dict_lst) {
        if (i != 0) {
            dict_lst[i]['control%'] = dict_lst[i]['control'] / ncontrol;
            dict_lst[i]['times%'] = dict_lst[i]['times'] / ntimes
            dict_lst[i] = final_modify(dict_lst[i], ngame);
        }
    }

    for (var i in tot_lst) {
        if (i != 0) {
            tot_lst[i] = final_modify(tot_lst[i], ngame);
        }
    }

    for (var i in pos_lst) {
        if (i != 0) {
            pos_lst[i] = final_modify(pos_lst[i], ngame);
        }
    }

    for (var i in hab_lst) {
        hab_lst[i] = final_modify(hab_lst[i], ngame);
    }

    // for(var i in tot_lst){
    //     if(i != 0){
    //         tot_lst[i] = final_modify(tot_lst[i], ngame);
    //     }
    // }


    dict_lst[0]['times%'] = 1;
    dict_lst[0]['control%'] = 1;
    dict_lst[0].point += (dict_lst[0]['3PM'] * 3 + (dict_lst[0]['FGM'] - dict_lst[0]['3PM']) * 2);
    dict_lst[0].point /= ngame;
    dict_lst[0]['PPP'] = dict_lst[0]['point'] / dict_lst[0]['control'];
    dict_lst[0]['FG%'] = dict_lst[0]['FGM'] / dict_lst[0]['FGA'];
    dict_lst[0]['3P%'] = dict_lst[0]['3PM'] / dict_lst[0]['3PA'];


    tot_lst[0].point += (tot_lst[0]['3PM'] * 3 + (tot_lst[0]['FGM'] - tot_lst[0]['3PM']) * 2);
    tot_lst[0].point /= ngame;
    tot_lst[0]['PPP'] = tot_lst[0]['point'] / tot_lst[0]['control'];
    tot_lst[0]['FG%'] = tot_lst[0]['FGM'] / tot_lst[0]['FGA'];
    tot_lst[0]['3P%'] = tot_lst[0]['3PM'] / tot_lst[0]['3PA'];


    pos_lst[0].point += (pos_lst[0]['3PM'] * 3 + (pos_lst[0]['FGM'] - pos_lst[0]['3PM']) * 2);
    pos_lst[0].point /= ngame;
    pos_lst[0]['PPP'] = pos_lst[0]['point'] / pos_lst[0]['control'];
    pos_lst[0]['FG%'] = pos_lst[0]['FGM'] / pos_lst[0]['FGA'];
    pos_lst[0]['3P%'] = pos_lst[0]['3PM'] / pos_lst[0]['3PA'];

    var re = [];
    re.push(tot_lst);
    re.push(hab_lst);
    re.push(pos_lst);
    re.push(dict_lst);

    return re;
}



const QueryModifyScreen = ({ navigation }) => {
    /* */
    // console.log('Hello');
    const [teamData, setTeamData] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const [search1, setSearch1] = useState("");
    const [search2, setSearch2] = useState("");
    var data1 = [[], [], [], []];
    var data2 = [[], [], [], []];


    // // filter(search) 的搜尋結果成功與否之訊息
    // const [searchState, setSearchState] = useState('###########');


    const updateSearch1 = (search1) => {
        setSearch1(search1);
    };

    const updateSearch2 = (search2) => {
        setSearch2(search2);
    };

    const getTeamDataList = ((team_name) => {
        // Get team data
        console.log(team_name)
        var t = [];
        axios.post('http://localhost:7777/searchTeam', {
            team_name: team_name,
        })
            .then((response) => {
                const teamDataList = response.data['data'];
                //console.log(typeof(teamDataList));
                setTeamData(teamDataList);

            })
            .catch((error) => { console.error(error) })
        //console.log(teamData);
    });


    const getPlayerDataList = ((team_name, player_name) => {
        // Get team data
        // console.log(player_name)
        axios.post('http://localhost:7777/searchPlayer', {
            team_name: team_name,
            player_name: player_name,
        })
            .then((response) => {
                const playerDataList = response.data['data'];
                console.log(playerDataList);
                // const teams_updated = teamList.map((e) => {return { label: e, value: e }});
                setPlayerData(playerDataList);
            })
            .catch((error) => { console.error(error) })
    });



    const headersAll = [
        { label: "name", key: "name" },
        { label: "times", key: "times" },
        { label: "times%", key: "times%" },
        { label: "control", key: "control" },
        { label: "control%", key: "control%" },
        { label: "point", key: "point" },
        { label: "PPP", key: "PPP" },
        { label: "FGM", key: "FGM" },
        { label: "FGA", key: "FGA" },
        { label: "FG%", key: "FG%" },
        { label: "3PA", key: "3PA" },
        { label: "3PM", key: "3PM" },
        { label: "3P%", key: "3P%" },
        { label: "miss", key: "miss" },
        { label: "pass", key: "pass" },
        { label: "fouled", key: "fouled" },
    ];


    const headers = [
        { label: "name", key: "name" },
        { label: "times", key: "times" },
        { label: "control", key: "control" },
        { label: "point", key: "point" },
        { label: "PPP", key: "PPP" },
        { label: "FGM", key: "FGM" },
        { label: "FGA", key: "FGA" },
        { label: "FG%", key: "FG%" },
        { label: "3PA", key: "3PA" },
        { label: "3PM", key: "3PM" },
        { label: "3P%", key: "3P%" },
        { label: "miss", key: "miss" },
        { label: "pass", key: "pass" },
        { label: "fouled", key: "fouled" },
    ];

    // console.log(teamData);
    if (teamData.length != 0) {
        data1 = dataMaker(teamData);
    }
    if (playerData.length != 0) {
        data2 = dataMaker(playerData);
    }
    // console.log(data1);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>#### 情蒐報表 ####</Text>
            </View>

            <View style={{ padding: 20 }}></View>

            <View>
                <Text style={styles.box}>▶    搜尋球隊</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                <View style={styles.cardsWrapper}>
                    <SearchBar
                        round
                        searchIcon={{ size: 30 }}
                        onChangeText={updateSearch1}
                        // style={{ height: 50 }}
                        placeholder="請輸入完整球隊名稱"
                        value={search1}
                        lightTheme={true}
                        containerStyle={{ backgroundColor: 'gray', padding: 0, borderRadius: 15, }}
                        inputContainerStyle={{ backgroundColor: '#f4f4f4' }}
                        inputStyle={{ backgroundColor: 'white', textAlign: 'center' }}
                        placeholderTextColor={'gray'}
                    />
                </View>
                <View style={styles.export}>
                    <Button
                        title="搜尋"
                        color="#FF6666"
                        onPress={() => { filter(search1); getTeamDataList(search1); }} // 
                    />
                </View>
            </View>

            <View>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                        paddingTop: 20
                    }}>
                    選擇匯出報表類型
                </Text>
            </View>

            <View style={{ marginHorizontal: 25, flexDirection: "row", justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
                <TouchableOpacity style={styles.all}>

                    <CSVLink
                        data={data1[0]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search1 + "_Total_Result.csv"}
                    >
                        Total
                    </CSVLink>

                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data1[1]}
                        header={headersAll}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search1 + "_Habit_Result.csv"}
                    >
                        Habit
                    </CSVLink>

                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data1[2]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search1 + "_PostUp_Result.csv"}
                    >
                        Post Up
                    </CSVLink>
                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data1[3]}
                        header={headersAll}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search1 + "_Types_Result.csv"}
                    >
                        Types
                    </CSVLink>
                </TouchableOpacity>
            </View>

            {/* <View style={{ padding: 30 }}></View> */}
            <View>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                        paddingVertical: 20
                    }}>
                    --------------------------------------------
                </Text>
            </View>
            <View>
                <Text style={styles.box}>▶    搜尋球員</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                <View style={styles.cardsWrapper}>
                    <SearchBar
                        round
                        searchIcon={{ size: 30 }}
                        placeholder="請輸入完整球員名稱"
                        value={search2}
                        onChangeText={updateSearch2}
                        lightTheme={true}
                        containerStyle={{ backgroundColor: 'gray', padding: 0, borderRadius: 15, }}
                        inputContainerStyle={{ backgroundColor: '#f4f4f4' }}
                        inputStyle={{ backgroundColor: 'white', textAlign: 'center' }}
                        placeholderTextColor={'gray'}
                    />
                </View>
                <View style={styles.export}>
                    <Button
                        title="搜尋"
                        color="#FF6666"
                        onPress={() => { filter(search2); getPlayerDataList(search1, search2) }}
                    />
                </View>
            </View>

            <View>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                        paddingTop: 20
                    }}>
                    選擇匯出報表類型
                </Text>
            </View>

            <View style={{ marginHorizontal: 25, flexDirection: "row", justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
                <TouchableOpacity style={styles.all}>

                    <CSVLink
                        data={data2[0]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search2 + "_Total_Result.csv"}
                    >
                        Total
                    </CSVLink>

                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data2[1]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search2 + "_Habit_Result.csv"}
                    >
                        Habit
                    </CSVLink>

                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data2[2]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search2 + "_PostUp_Result.csv"}
                    >
                        Post Up
                    </CSVLink>
                </TouchableOpacity>
                <TouchableOpacity style={styles.all}>
                    <CSVLink
                        data={data2[3]}
                        header={headers}
                        style={{ fontWeight: 'bold', color: 'white', fontSize: '80%' }}
                        filename={search2 + "_Types_Result.csv"}
                    >
                        Types
                    </CSVLink>
                </TouchableOpacity>
            </View>

            {/* 搜尋成功與否 */}
            {/* <Text style={{
                alignSelf: 'center',
                fontSize: 18,
                fontWeight: 'bold',
                color: '#00008B', // 深藍色
                paddingTop: 20
            }}>{searchState}</Text> */}
            {/* <View style={{ flex: 1 }}></View> */}


            <StatusBar style="auto" />
        </View>


    );
}




export default QueryModifyScreen;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',

    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        // backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 0.8
        //padding: 20,
    },
    body: {
        backgroundColor: 'yellow',
        padding: 20,
    },
    heading: {
        // format
        alignSelf: 'center',
        justifyContent: 'center',
        // size
        paddingTop: 16,
        paddingBottom: 30,
        // style
        fontSize: '200%',
        fontWeight: 'bold'
    },
    //   boldText: {
    //     //alignItems: 'center',
    //     justifyContent: 'center',
    //     fontWeight: 'bold',
    //     fontSize: 48,
    //   },
    cardsWrapper: {
        // marginLeft: 10,
        marginLeft: 30,
        marginRight: 30,
        // width: '200%',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    export: {
        marginRight: 30,
        backgroundColor: '',
        width: '10%',
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // borderRadius: 10,
        height: 60,

        flex: 0.2,
    },
    all: {
        // marginTop: 20,
        backgroundColor: 'lightsalmon',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        margin: 10,
        // marginLeft: 20,
        borderRadius: 10,
        height: '30%',
        flex: 0.5,
    },
    box: {
        color: '#FF6666',
        fontWeight: 'bold',
        alignSelf: 'left',
        fontSize: '150%',
        marginLeft: 30,
        marginBottom: 10
    },
    searchWrapper: {
        marginTop: 10,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
});
// charlie brown's steakhouse95.txt