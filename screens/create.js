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




const QueryModifyScreen = ({ navigation }) => {
/* */

 
    const headers = [
    { label: "Team ID", key: "team_id" },
    { label: "Player ID", key: "player_id" },
    { label: "Game ID", key: "game_id" },
    { label: "Play ID", key: "play_id" },
    { label: "Type", key: "type" },
    { label: "Finish", key: "finish" },
    { label: "Result", key: "result" },
    ];
    

    const data = [
        { team_id: 1, player_id: 1, game_id: 1, play_id: 1, type: 'Iso', finish: 'Shot', result: '2y' },
        { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'Iso', finish: 'Shot', result: '2x' },
        { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'Is', finish: 'Shot', result: '2y' },
        { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'so', finish: 'Shot', result: '2x' },
        { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'Iso', finish: 'Shot', result: '3y' },
        { team_id: 1, player_id: 1, game_id: 1, play_id: 2, type: 'Iso', finish: 'Shot', result: 'Pass' },
        ];

    tot = data.length;

    ngame = [...new Set(data.map(item => item.team_id))].length;




    
    const csvReport = {
    data: data,
    headers: headers,
    filename: 'Report.csv'
    };

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        console.log("text:", text);
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = listData.filter(function (item) {
                const itemData = item.question            // 原資料有的內容
                    ? item.question.toUpperCase()
                    : ''.toUpperCase();

                const textData = text.toUpperCase();   // 搜尋框打的內容
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource

            setFilteredDataSource(listData);
            setSearch(text);

        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.boldText}>情蒐報表</Text>
            </View>
            
            <View style={styles.cardsWrapper}>
                    {/* <View style={styles.header}>
                            <Text style={styles.box}>球員名稱</Text>
                    </View> */}
                    <View style={{flexDirection: "row", padding: 20 }}>
                        <View style={styles.header}>
                                <Text style={styles.box}>球隊名稱</Text>
                        </View>
                        <SearchBar
                            round
                            searchIcon={{ size: 50 }}
                            onChangeText={(text) => searchFilterFunction(text)}
                            onClear={(text) => searchFilterFunction('')}
                            placeholder="    Type Here..."
                            // value={search}
                            lightTheme={true}
                            containerStyle={{ backgroundColor: '#FFCCCC', borderWidth: 1, borderRadius: 30, height:60, width: 500, alignSelf:"center", alignContent: 'center'  }}
                            inputStyle={{ backgroundColor: 'white', borderRadius: 30, height:30, width: 500, alignSelf:"center", alignContent: 'center' }}
                            placeholderTextColor={'black'}
                        />
                        <View style={styles.export}>
                            {/* <Text style={{fontWeight: 'bold', fontSize: 24}}>匯出</Text> */}
                            <CSVLink {...csvReport}>匯出</CSVLink>
                        </View>
                    </View>
            </View>



            <View style={styles.cardsWrapper}>
                    {/* <View style={styles.header}>
                            <Text style={styles.box}>球員名稱</Text>
                    </View> */}
                    <View style={{flexDirection: "row", padding: 20 }}>
                        <View style={styles.header}>
                                <Text style={styles.box}>球員名稱</Text>
                        </View>
                        <SearchBar
                            round
                            searchIcon={{ size: 50 }}
                            onChangeText={(text) => searchFilterFunction(text)}
                            onClear={(text) => searchFilterFunction('')}
                            placeholder="    Type Here..."
                            // value={search}
                            lightTheme={true}
                            containerStyle={{ backgroundColor: '#FFCCCC', borderWidth: 1, borderRadius: 30, height:60, width: 500, alignSelf:"center", alignContent: 'center'  }}
                            inputStyle={{ backgroundColor: 'white', borderRadius: 30, height:30, width: 500, alignSelf:"center", alignContent: 'center' }}
                            placeholderTextColor={'black'}
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
    fontWeight: 'bold',
    fontSize: 48,
  },
  cardsWrapper: {
    //marginBottom: 50,
    marginLeft: 100,
    width: '80%',
    alignSelf: 'left',
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


