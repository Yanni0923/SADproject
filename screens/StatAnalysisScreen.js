import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Picker, Switch, Button, Animated, ScrollView, TouchableHighlight, Dimensions, SafeAreaView } from 'react-native'
import { COLORS, SIZES } from "../constants";
import { SearchBar } from 'react-native-elements';
import { useTheme } from "@react-navigation/native";

import Swiper from 'react-native-swiper/src';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

// 滑動刪除
import { SwipeListView } from 'react-native-swipe-list-view';
import * as notifications from '../model/Notifications.json';

// 選擇框框
import RNPickerSelect from 'react-native-picker-select';

// 測試資料
import * as data from '../data/QuizData.json';
import { color, set } from "react-native-reanimated";

import { CSVLink } from "react-csv";


function modify(dict, result) {
    dict.times++;
    if(result != 'Pass' && result != 'foul'){
        dict.control++;
    }
    if(result == '2y' || result == '3y'){
        dict.FGM++;
    }
    if(result != 'Pass' && result != 'TO' && result != 'add'){
        dict['FGA']++;
    }
    if(result == '3y'){
        dict['3PM']++;
    }
    if(result == '3y' || result == '3x'){
        dict['3PA']++;
    }
    if(result == 'TO'){
        dict.miss++;
    }
    if(result == 'Pass'){
        dict.pass++;
    }
    if(result == 'foul' || result == 'free throw'){
        dict.fouled++;
    }
    
    return dict;
}

function final_modify(dict, ngame){
    dict.times /= ngame;
    dict.control /= ngame;
    dict.point = (dict['3PM']*3 + (dict['FGM'] - dict['3PM'])*2)/ngame;
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



const QueryModifyScreen = ({ navigation }) => {
/* */
    const [search1, setSearch1] = useState("");
    const [search2, setSearch2] = useState("");

    const updateSearch1 = (search1) => {
    setSearch1(search1);
    };

    const updateSearch2 = (search2) => {
    setSearch2(search2);
    };
 
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
    
    
        const data = [
            { team_id: 1, player_id: 1, game_id: 1, play_id: 1, type: 'Iso', finish: 'Exception', result: 'free throw' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'Catch & Shoot', finish: 'Set shot', result: '2x' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 3, type: 'Atk Close-out', finish: 'Set shot', result: '2y' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 4, type: 'Iso', finish: 'Right shoulder', result: 'foul' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 5, type: 'Cut', finish: 'Post Pin', result: '3y' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 5, type: 'Iso', finish: 'Face up', result: 'TO' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 6, type: 'others', finish: 'Right shoulder', result: 'Pass' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 7, type: 'Off screen', finish: 'Right shoulder', result: '2y' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 8, type: 'Transition', finish: 'Drive Left', result: '2y' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 9, type: 'Eat Cake', finish: 'Face up', result: 'Pass' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 10, type: 'Cut', finish: 'Pull-up Right', result: 'foul' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'Transition', finish: 'Drive Others', result: '2x' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'Put Back', finish: 'Drive Left', result: '3x' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'P&R BH', finish: 'Drive Right', result: 'foul' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'others', finish: 'Drive Left', result: '2x' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'Transition', finish: 'Pull-up Others', result: 'TO' },
            { team_id: 1, player_id: 1, game_id: 1, play_id: 11, type: 'Post up', finish: 'Pull-up Right', result: '2y' },
            ];
        
            var dict_lst = [{'name': 'Total'},{'name': 'Transition'},{'name': 'Catch & Shoot'},{'name': 'Atk Close-out'},{'name': 'P&R BH'},{'name': 'others'},{'name': 'Post up'},{'name': 'Iso'},{'name': 'Put Back'},{'name': 'Cut'},{'name': 'Eat Cake'},{'name': 'P&R Men'},{'name': 'Handoff'},{'name': 'Off screen'}];


            var tot_lst = [{'name': 'Total'},{'name': 'Set shot'},{'name': 'Drive'},{'name': 'Drive Right'},{'name': 'Drive Left'},{'name': 'Drive Others'},{'name': 'Pull-up'},{'name': 'Pull-up Right'},{'name': 'Pull-up Left'},{'name': 'Pull-up Others'},{'name': 'Exception'}]
            
            var hab_lst = [{'name':'Right'},{'name':'Left'},{'name':'Others'},{'name':'Exception'}]
            
            var pos_lst = [{'name':'Total'},{'name':'Right shoulder'},{'name':'Left shouder'},{'name':'Face up'},{'name':'Post Pin'},{'name':'Pass'},{'name':'Turnover'}]
            
            
            for(var i in dict_lst){
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
            
            for(var i in tot_lst){
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
            
            for(var i in hab_lst){
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
            
            for(var i in pos_lst){
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
            
            
            for(var i in data){
                var result = data[i].result;
                dict_lst[0] = modify(dict_lst[0], result);
                
                if(data[i].type == 'Transition'){
                    dict_lst[1] = modify(dict_lst[1], result);
                }
                else if(data[i].type == 'Catch & Shoot'){
                    dict_lst[2] = modify(dict_lst[2], result);
                }
                else if(data[i].type == 'Atk Close-out'){
                    dict_lst[3] = modify(dict_lst[3], result);
                }
                else if(data[i].type == 'P&R BH'){
                    dict_lst[4] = modify(dict_lst[4], result);
                }
                else if(data[i].type == 'others'){
                    dict_lst[5] = modify(dict_lst[5], result);
                }
                else if(data[i].type == 'Post up'){
                    dict_lst[6] = modify(dict_lst[6], result);
                }
                else if(data[i].type == 'Iso'){
                    dict_lst[7] = modify(dict_lst[7], result);
                }
                else if(data[i].type == 'Put Back'){
                    dict_lst[8] = modify(dict_lst[8], result);
                }
                else if(data[i].type == 'Cut'){
                    dict_lst[9] = modify(dict_lst[9], result);
                }
                else if(data[i].type == 'Eat Cake'){
                    dict_lst[10] = modify(dict_lst[10], result);
                }
                else if(data[i].type == 'P&R Men'){
                    dict_lst[11] = modify(dict_lst[11], result);
                }
                else if(data[i].type == 'Handoff'){
                    dict_lst[12] = modify(dict_lst[12], result);
                }
                else if(data[i].type == 'Off screen'){
                    dict_lst[13] = modify(dict_lst[13], result);
                }
                
                
                var finish = data[i].finish;
                
                if(finish == 'Set shot'){
                    tot_lst[1] = modify(tot_lst[1], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Drive Right'){
                    tot_lst[3] = modify(tot_lst[3], result);
                    tot_lst[2] = modify(tot_lst[2], result);
                    hab_lst[0] = modify(hab_lst[0], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Drive Left'){
                    tot_lst[4] = modify(tot_lst[4], result);
                    tot_lst[2] = modify(tot_lst[2], result);
                    hab_lst[1] = modify(hab_lst[1], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Drive Others'){
                    tot_lst[5] = modify(tot_lst[5], result);
                    tot_lst[2] = modify(tot_lst[2], result);
                    hab_lst[2] = modify(hab_lst[2], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Pull-up Right'){
                    tot_lst[7] = modify(tot_lst[7], result);
                    tot_lst[6] = modify(tot_lst[6], result);
                    hab_lst[0] = modify(hab_lst[0], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Pull-up Left'){
                    tot_lst[8] = modify(tot_lst[8], result);
                    tot_lst[6] = modify(tot_lst[6], result);
                    hab_lst[1] = modify(hab_lst[1], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Pull-up Others'){
                    tot_lst[9] = modify(tot_lst[9], result);
                    tot_lst[6] = modify(tot_lst[6], result);
                    hab_lst[2] = modify(hab_lst[2], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                else if(finish == 'Exception'){
                    tot_lst[10] = modify(tot_lst[10], result);
                    hab_lst[3] = modify(hab_lst[3], result);
                    tot_lst[0] = modify(tot_lst[0], result);
                }
                
                if(finish == 'Right shoulder'){
                    pos_lst[1] = modify(pos_lst[1], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
                else if(finish == 'Left shoulder'){
                    pos_lst[2] = modify(pos_lst[2], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
                else if(finish == 'Face up'){
                    pos_lst[3] = modify(pos_lst[3], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
                else if(finish == 'Post Pin'){
                    pos_lst[4] = modify(pos_lst[4], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
                else if(finish == 'Pass'){
                    pos_lst[5] = modify(pos_lst[5], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
                else if(finish == 'Turnover'){
                    pos_lst[6] = modify(pos_lst[6], result);
                    pos_lst[0] = modify(pos_lst[0], result);
                }
            }
            
            
            var ngame = [...new Set(data.map(item => item.team_id))].length;
            var ntimes = dict_lst[0]['times'];
            var ncontrol = dict_lst[0]['control'];
            
            
            for(var i in dict_lst){
                if(i != 0){
                    dict_lst[i]['control%'] = dict_lst[i]['control']/ncontrol;
                    dict_lst[i]['times%'] = dict_lst[i]['times']/ntimes
                    dict_lst[i] = final_modify(dict_lst[i], ngame);
                }
            }
            
            for(var i in tot_lst){
                if(i != 0){
                    tot_lst[i] = final_modify(tot_lst[i], ngame);
                }
            }
            
            for(var i in pos_lst){
                if(i != 0){
                    pos_lst[i] = final_modify(pos_lst[i], ngame);
                }
            }
            
            for(var i in hab_lst){
                hab_lst[i] = final_modify(hab_lst[i], ngame);
            }
            
            for(var i in tot_lst){
                if(i != 0){
                    tot_lst[i] = final_modify(tot_lst[i], ngame);
                }
            }
            
            
            dict_lst[0]['times%'] = 1;
            dict_lst[0]['control%'] = 1;
            dict_lst[0].point = (dict_lst[0]['3PM']*3 + (dict_lst[0]['FGM'] - dict_lst[0]['3PM'])*2)/ngame;
            dict_lst[0]['PPP'] = dict_lst[0]['point']/dict_lst[0]['control'];
            dict_lst[0]['FG%'] = dict_lst[0]['FGM']/dict_lst[0]['FGA'];
            dict_lst[0]['3P%'] = dict_lst[0]['3PM']/dict_lst[0]['3PA'];
            
            
            tot_lst[0].point = (tot_lst[0]['3PM']*3 + (tot_lst[0]['FGM'] - tot_lst[0]['3PM'])*2)/ngame;
            tot_lst[0]['PPP'] = tot_lst[0]['point']/tot_lst[0]['control'];
            tot_lst[0]['FG%'] = tot_lst[0]['FGM']/tot_lst[0]['FGA'];
            tot_lst[0]['3P%'] = tot_lst[0]['3PM']/tot_lst[0]['3PA'];
            
            
            pos_lst[0].point = (pos_lst[0]['3PM']*3 + (pos_lst[0]['FGM'] - pos_lst[0]['3PM'])*2)/ngame;
            pos_lst[0]['PPP'] = pos_lst[0]['point']/pos_lst[0]['control'];
            pos_lst[0]['FG%'] = pos_lst[0]['FGM']/pos_lst[0]['FGA'];
            pos_lst[0]['3P%'] = pos_lst[0]['3PM']/pos_lst[0]['3PA'];
            
    
const csvReport = {
    data: dict_lst,
    headers: headersAll,
    filename: 'Report.csv'
};
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.boldText}>情蒐報表</Text>
            </View>
            
            <View style={styles.cardsWrapper}>
                    <View style={{flexDirection: "row", padding: 20 }}>
                        <View style={styles.header}>
                                <Text style={styles.box}>球隊名稱</Text>
                        </View>
                        <SearchBar
                            round
                            searchIcon={{ size: 30 }}
                            onChangeText={updateSearch1}
                            placeholder="e.g. 台灣大學"
                            value={search1}
                            lightTheme={true}
                            containerStyle={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 30, height:60, width: 500, alignSelf:"center", alignContent: 'center'   }}
                            inputContainerStyle={{ backgroundColor: 'white' }}
                            inputStyle={{ backgroundColor: '#FFF8D7', textAlign: 'center', height:30, width: 500, alignSelf:"center", alignContent: 'center'  }}
                            placeholderTextColor={'gray'}
                        />
                        <View style={styles.export}>
                            {/* <Text style={{fontWeight: 'bold', fontSize: 24}}>匯出</Text> */}
                            <CSVLink {...csvReport}>匯出</CSVLink>
                        </View>
                        
                    </View>
            </View>



            <View style={styles.cardsWrapper}>
                    <View style={{flexDirection: "row", padding: 20 }}>
                        <View style={styles.header}>
                                <Text style={styles.box}>球員名稱</Text>
                        </View>
                        <SearchBar
                            round
                            searchIcon={{ size: 30 }}
                            placeholder="e.g. 資管 booker"
                            value={search2}
                            onChangeText={updateSearch2}
                            lightTheme={true}
                            containerStyle={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 30, height:60, width: 500, alignSelf:"center", alignContent: 'center'   }}
                            inputContainerStyle={{ backgroundColor: 'white' }}
                            inputStyle={{ backgroundColor: '#FFF8D7', textAlign: 'center', height:30, width: 500, alignSelf:"center", alignContent: 'center'  }}
                            placeholderTextColor={'gray'}
                        />
                        
                        <View style={styles.export}>
                            <CSVLink {...csvReport}>匯出</CSVLink>
                        </View>
                    </View>
            </View>
            <View style={{flex:1}}></View>


        <StatusBar style="auto" />
        </View>

        
    );
}




export default QueryModifyScreen;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  header: {
      marginTop: 20,
      // backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0.8
      //padding: 20,
  },
  body: {
    backgroundColor: 'yellow',
    padding: 20,
  },
  boldText: {
    //alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 48,
  },
  cardsWrapper: {
    //marginBottom: 50,
    //marginLeft: 100,
    width: '80%',
    alignSelf: 'center',
    flex: 1,
  },
  export: {
    marginTop: 20,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginLeft:50,
    borderRadius:10,
    height: 60
    //flex: 1,
  },
  box: {
    color: 'orange',
    fontWeight: 'bold',
    alignSelf: 'left',
    fontSize: 32,
},
});
