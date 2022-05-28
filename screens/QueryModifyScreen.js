import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Picker, Switch, Button, Animated, ScrollView, TouchableHighlight, Dimensions, SafeAreaView } from 'react-native'
import { COLORS, SIZES } from "../constants";
import { SearchBar } from 'react-native-elements';
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';

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

// 讀取資料庫
import axios from 'axios';
import { render } from "react-dom";

const QueryModifyScreen = ({ navigation }) => {

    const [search, setSearch] = useState('');
    const { colors } = useTheme();
    const theme = useTheme;

    // const [orinData, setOrinData] = useState(data.teams);
    const [allTeams, setAllTeams] = useState(data.players);

    // 讀入的初始化的次數只能夠有一次
    const [importTeam, setImportTeam] = useState(false);
    const [importGame, setImportGame] = useState(false);
    const [importPlayer, setImportPlayer] = useState(false);

    // 從資料庫讀取資料
    const getTeamsJson = (() => {
        // Get team data
        console.log("importTeam", importTeam);
        if (importTeam == false) {
            axios.get('http://localhost:7777/getTeamsQuery')
                .then((response) => {
                    const teamData = response.data['data'];
                    // setListData(response.data);
                    console.log("getTeamsJson");
                    console.log(teamData);
                    // setImportTeam(true); // 紀錄 team 初始化的次數只能一次
                    setAllTeams(teamData);
                    setListData(teamData);
                    setFilteredDataSource(teamData);
                    setSearchData(teamData);
                    setDisplayDataSource(teamData);
                })
                .catch((error) => { console.error(error) })
        }
    });

    const getGamesJson = (() => {
        // Get team data
        console.log("importGame", importGame);
        if (importGame == false) {
            axios.get('http://localhost:7777/getGamesQuery')
                .then((response) => {
                    const gameData = response.data['data'];
                    // setListData(response.data);
                    console.log("getGamesJson");
                    console.log(gameData);
                    // setImportGame(true); // 紀錄 team 初始化的次數只能一次
                    setAllTeams(gameData);
                    setListData(gameData);
                    setFilteredDataSource(gameData);
                    setSearchData(gameData);
                    setDisplayDataSource(gameData);
                })
                .catch((error) => { console.error(error) })
        }
    });

    const getPlayersJson = (() => {
        // Get team data
        console.log("importPlayer", importPlayer);
        if (importPlayer == false) {
            axios.get('http://localhost:7777/getPlayersQuery')
                .then((response) => {
                    const playerData = response.data['data'];
                    // setListData(response.data);
                    console.log("getPlayersJson");
                    console.log(playerData);
                    // setImportPlayer(true); // 紀錄 team 初始化的次數只能一次
                    setAllTeams(playerData);
                    setListData(playerData);
                    setFilteredDataSource(playerData);
                    setSearchData(playerData);
                    setDisplayDataSource(playerData);
                })
                .catch((error) => { console.error(error) })
        }
    });

    // useFocusEffect(React.useCallback(() => {
    //     getTeamsJson();
    //     console.log('当前页面被激活啦!');
    // }, []));

    // 最原始的資料(會顯示修改、刪除結果)
    const [listData, setListData] = useState(
        data.data.map((dataItem, index) => ({
            key: `${index}`,
            question: dataItem.question,
            options: dataItem.options,
            correct_option: dataItem.correct_option,
            type: dataItem.type,
            // question: dataItem.question,
            // options: dataItem.options,
            // correct_option: dataItem.correct_option,
            // type: dataItem.type
        })),
    );

    // 用來裝篩選結果的資料(game, team, player)
    const [filteredDataSource, setFilteredDataSource] = useState(listData);

    // 用來裝 search text 結果的資料
    const [searchData, setSearchData] = useState(listData);

    // 真正會 render 出來的資料
    const [displayDataSource, setDisplayDataSource] = useState(listData);

    // 裝 toggleSwitch 開關
    const [isGameSelected, setIsGameSelected] = useState(false);
    // const toggleSwitch_Game = () => setIsGameSelected(previousState => !previousState);

    const [isTeamSelected, setIsTeamSelected] = useState(false);
    // const toggleSwitch_Team = () => setIsTeamSelected(previousState => !previousState);

    const [isPlayerSelected, setIsPlayerSelected] = useState(false);
    // const toggleSwitch_Player = () => setIsPlayerSelected(previousState => !previousState);




    const closeRow = (rowMap, rowKey) => {
        console.log("rowMap:", rowMap);
        console.log("rowKey:", rowKey);
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
        console.log("執行 closeRow()");
    };
    const deleteRow = (rowMap, rowKey) => {

        if (isTeamSelected) {
            closeRow(rowMap, rowKey);
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.team_id === rowKey);
            newData.splice(prevIndex, 1);
            setListData(newData);

            const newData_data = [...displayDataSource];
            const prevIndex_data = listData.findIndex(item => item.team_id === rowKey);
            newData_data.splice(prevIndex_data, 1);
            setDisplayDataSource(newData_data);
            // setFilteredDataSource(newData);
            // setSearch
            console.log("執行 deleteRow()");
        } else if (isPlayerSelected) {
            closeRow(rowMap, rowKey);
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.player_id === rowKey);
            newData.splice(prevIndex, 1);
            setListData(newData);

            const newData_data = [...displayDataSource];
            const prevIndex_data = listData.findIndex(item => item.player_id === rowKey);
            newData_data.splice(prevIndex_data, 1);
            setDisplayDataSource(newData_data);
            // setFilteredDataSource(newData);
            // setSearch
            console.log("執行 deleteRow()");
        }
        else if (isGameSelected) {
            closeRow(rowMap, rowKey);
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.game_id === rowKey);
            newData.splice(prevIndex, 1);
            setListData(newData);

            const newData_data = [...displayDataSource];
            const prevIndex_data = listData.findIndex(item => item.game_id === rowKey);
            newData_data.splice(prevIndex_data, 1);
            setDisplayDataSource(newData_data);
            // setFilteredDataSource(newData);
            // setSearch
            console.log("執行 deleteRow()");
        }
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const onLeftActionStatusChange = rowKey => {
        console.log('onLeftActionStatusChange', rowKey);
    };

    const onRightActionStatusChange = rowKey => {
        console.log('onRightActionStatusChange', rowKey);
    };

    const onRightAction = rowKey => {
        console.log('onRightAction', rowKey);
    };

    const onLeftAction = rowKey => {
        console.log('onLeftAction', rowKey);
    };


    const VisibleItem_team = props => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,
        } = props;

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        return (
            <Animated.View
                style={[styles.front, { height: rowHeightAnimatedValue }]}>
                <TouchableHighlight
                    style={styles.rowFrontVisible}
                    onPress={() => console.log('Element touched')}
                    underlayColor={'#aaa'}>

                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <Image
                                source={require('../assets/logo.png')}
                                resizeMode="cover"
                                style={styles.cardImg}
                            />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 球隊名稱：</Text>
                                {data.item.name}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 所屬學校／團體：</Text>
                                {data.item.school}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 教練姓名：</Text>
                                {data.item.coach}
                                {/* 之後這裡要改 */}
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    };
    const VisibleItem_game = props => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,
        } = props;

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        return (
            <Animated.View
                style={[styles.front, { height: rowHeightAnimatedValue }]}>
                <TouchableHighlight
                    style={styles.rowFrontVisible}
                    onPress={() => console.log('Element touched')}
                    underlayColor={'#aaa'}>

                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <Image
                                source={require('../assets/logo.png')}
                                resizeMode="cover"
                                style={styles.cardImg}
                            />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 主隊名稱：</Text>
                                {data.item.host}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 客隊名稱：</Text>
                                {data.item.guest}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 比賽日期時間：</Text>
                            <Text numberOfLines={1}>
                                {data.item.date}
                                {/* 之後這裡要改 */}
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    };

    const VisibleItem_player = props => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,
        } = props;

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        return (
            <Animated.View
                style={[styles.front, { height: rowHeightAnimatedValue }]}>
                <TouchableHighlight
                    style={styles.rowFrontVisible}
                    onPress={() => console.log('Element touched')}
                    underlayColor={'#aaa'}>

                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <Image
                                source={require('../assets/logo.png')}
                                resizeMode="cover"
                                style={styles.cardImg}
                            />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 球隊名稱：</Text>
                                {data.item.team}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 球員名稱：</Text>
                                {data.item.name}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 位置：</Text>
                                {data.item.position}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                <Text style={{ fontWeight: "bold", color: '#003377' }}>◆ 球員背號：</Text>
                                {data.item.number}
                                {/* 之後這裡要改 */}
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    };


    const renderItem_team = (data, rowMap) => {

        const rowHeightAnimatedValue = new Animated.Value(100); // 修改和刪除的高度
        return (
            <VisibleItem_team
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.team_id)}
            />

        );
    };

    const renderItem_player = (data, rowMap) => {

        const rowHeightAnimatedValue = new Animated.Value(100); // 修改和刪除的高度
        return (
            <VisibleItem_player
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.player_id)}
            />

        );
    };

    const renderItem_game = (data, rowMap) => {

        const rowHeightAnimatedValue = new Animated.Value(100); // 修改和刪除的高度
        return (
            <VisibleItem_game
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.game_id)}
            />

        );
    };


    const HiddenItemWithActions = props => {
        const {
            swipeAnimatedValue,
            leftActionActivated,
            rightActionActivated,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            onClose,
            onDelete,
        } = props;

        if (rightActionActivated) { // 由右向左拉到一個程度，達到某個數字
            Animated.spring(rowActionAnimatedValue, {
                toValue: 500,       // 填滿
                useNativeDriver: false
            }).start();
        } else {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,        // 恢復原樣
                useNativeDriver: false
            }).start();
        }

        return (
            <Animated.View style={[styles.rowBack, { height: rowHeightAnimatedValue }]}>
                <Text>Left</Text>
                {!leftActionActivated && (
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={onClose}>
                        <MaterialCommunityIcons
                            name="border-color"
                            size={25}
                            style={styles.trash}
                            color="#fff"
                        />
                    </TouchableOpacity>
                )}
                {!leftActionActivated && (
                    <Animated.View
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                            {
                                flex: 1,
                                width: rowActionAnimatedValue,
                            },
                        ]}>
                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backRightBtnRight]}
                            onPress={onDelete}>
                            <Animated.View
                                style={[
                                    styles.trash,
                                    {
                                        transform: [
                                            {
                                                scale: swipeAnimatedValue.interpolate({
                                                    inputRange: [-90, -45],
                                                    outputRange: [1, 0],
                                                    extrapolate: 'clamp',
                                                }),
                                            },
                                        ],
                                    },
                                ]}>
                                <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    size={25}
                                    color="#fff"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        );
    };

    const renderHiddenItem_team = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);


        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.team_id)}
                onDelete={() => deleteRow(rowMap, data.item.team_id)}
            />
        );
    };

    const renderHiddenItem_player = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);


        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.player_id)}
                onDelete={() => deleteRow(rowMap, data.item.player_id)}
            />
        );
    };

    const renderHiddenItem_game = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);


        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.game_id)}
                onDelete={() => deleteRow(rowMap, data.item.game_id)}
            />
        );
    };

    // useEffect(() => {
    //     fetch('https://jsonplaceholder.typicode.com/posts')
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             setFilteredDataSource(responseJson);
    //             setMasterDataSource(responseJson);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);


    // 三個toggle的狀態

    const threeToggleState = () => {
        // // 處理前的資料
        // getTeamsJson();

        console.log("displayDataSource: ", displayDataSource);
        console.log("listData: ", listData);
        console.log("isGameSelected: ", isGameSelected);
        console.log("isTeamSelected: ", isTeamSelected);
        console.log("isPlayerSelected: ", isPlayerSelected);

    }


    const togglePlayerSelected = () => {

        setIsPlayerSelected(isPlayerSelected => !isPlayerSelected);
        setIsGameSelected(false);
        setIsTeamSelected(false);
        getPlayersJson();


        // 我也不知道為什麼要用!才是對的
        if (!isPlayerSelected & search == '') {                     // 點擊開 & 沒有 search text
            const newData = listData.filter(function (item) {
                if (item.type == "player") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else if (!isPlayerSelected & search != '') {                // 點擊開 & 有 search text
            const newData = searchData.filter(function (item) {
                if (item.type == "player") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else {                                                      // 點擊關
            // setFilteredDataSource(listData);
            searchGlobalFilterFunction(search);
            // setDisplayDataSource(listData);
        }
        threeToggleState();

    }

    const toggleGameSelected = () => {
        setIsGameSelected(isGameSelected => !isGameSelected);
        setIsPlayerSelected(false);
        setIsTeamSelected(false);
        getGamesJson();

        // // 每次點 toggle 都會將資料重置為 listData
        // setFilteredDataSource(listData);


        // 我也不知道為什麼要用!才是對的
        if (!isGameSelected & search == '') {                     // 點擊開 & 沒有 search text
            const newData = searchData.filter(function (item) {
                if (item.type == "game") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else if (!isGameSelected & search != '') {                     // 點擊開 & 有 search text
            const newData = listData.filter(function (item) {
                if (item.type == "game") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else {
            // setFilteredDataSource(listData);
            searchGlobalFilterFunction(search);
            // setDisplayDataSource(listData);
        }
        threeToggleState();
    }

    const toggleTeamSelected = () => {

        setIsTeamSelected(isTeamSelected => !isTeamSelected);
        setIsPlayerSelected(false);
        setIsGameSelected(false);
        getTeamsJson();

        // 我也不知道為什麼要用!才是對的
        if (!isTeamSelected & search == '') {                     // 點擊開 & 沒有 search text
            const newData = listData.filter(function (item) {
                if (item.type == "team") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else if (!isTeamSelected & search != '') {                     // 點擊開 & 有 search text
            const newData = searchData.filter(function (item) {
                if (item.type == "team") {
                    return item
                }
                else {
                    return null
                }
            });
            setFilteredDataSource(newData);
            setDisplayDataSource(newData);
            // searchFilterFunction(search);
        }
        else {
            // setFilteredDataSource(listData);
            searchGlobalFilterFunction(search);
            // setDisplayDataSource(listData);
        }
        threeToggleState();
    }



    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        console.log("text:", text);

        // const beforeSearchData = filteredDataSource; // 篩選過後的結果
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = filteredDataSource.filter(function (item) {
                const itemData = item.name            // 原資料有的內容
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();

                const textData = text.toUpperCase();   // 搜尋框打的內容

                return itemData.indexOf(textData) > -1;
            });
            setDisplayDataSource(newData); // 只會更動到display的結果，filtered的結果依舊
            setSearchData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource

            setSearchData(filteredDataSource);
            setDisplayDataSource(filteredDataSource);
            setSearch(text);
            console.log("searchFilterFunction empty");

        }
        // console.log("isGameSelected: ", isGameSelected);
        // console.log("isPlayerSelected: ", isPlayerSelected);
        // console.log("isTeamSelected: ", isTeamSelected);


    };

    const searchGlobalFilterFunction = (text) => {
        // Check if searched text is not blank
        console.log("text:", text);

        // const beforeSearchData = filteredDataSource; // 篩選過後的結果
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = listData.filter(function (item) {
                const itemData = item.name            // 原資料有的內容
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();

                const textData = text.toUpperCase();   // 搜尋框打的內容
                return itemData.indexOf(textData) > -1;
            });
            setDisplayDataSource(newData); // 只會更動到display的結果，filtered的結果依舊
            setSearchData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setSearchData(listData);
            setDisplayDataSource(listData);
            setSearch(text);
            console.log("searchGlobalFilterFunction empty");

        }
        // console.log("isGameSelected: ", isGameSelected);
        // console.log("isPlayerSelected: ", isPlayerSelected);
        // console.log("isTeamSelected: ", isTeamSelected);


    };


    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                            paddingTop: 20
                        }}>
                        篩選條件
                    </Text>

                </View>
            </View>
            <View style={[styles.categoryContainer, { marginTop: 10 }]}>
                <TouchableOpacity
                    style={styles.categoryBtn}
                    onPress={toggleGameSelected}>
                    <View style={[styles.categoryIcon, { backgroundColor: isGameSelected ? 'coral' : 'peachpuff' }]}>
                        <Image
                            style={{
                                width: '50%',
                                height: '50%',
                            }}
                            resizeMode='contain'
                            source={isGameSelected ? require('../assets/icons/court-white.png') : require('../assets/icons/court.png')}
                        />
                        <View style={{ marginTop: 10 }}>
                            <Text style={{
                                alignSelf: 'center',
                                fontSize: '150%',
                                fontWeight: 'bold',
                                color: isGameSelected ? '#FFFFFF' : '#000000',
                            }}>找球賽</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.categoryBtn}
                    onPress={toggleTeamSelected}>
                    <View style={[styles.categoryIcon, { backgroundColor: isTeamSelected ? 'coral' : 'peachpuff' }]}>
                        <Image
                            style={{
                                width: '50%',
                                height: '50%',
                            }}
                            resizeMode='contain'
                            source={isTeamSelected ? require('../assets/icons/team-white.png') : require('../assets/icons/team.png')}
                        />
                        <View style={{ marginTop: 10 }}>
                            <Text style={{
                                alignSelf: 'center',
                                fontSize: '150%',
                                fontWeight: 'bold',
                                color: isTeamSelected ? '#FFFFFF' : '#000000',
                            }}>找球隊</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.categoryBtn}
                    onPress={togglePlayerSelected}>
                    <View style={[styles.categoryIcon, { backgroundColor: isPlayerSelected ? 'coral' : 'peachpuff' }]}>
                        <Image
                            style={{
                                width: '50%',
                                height: '50%',
                            }}
                            resizeMode='contain'
                            source={isPlayerSelected ? require('../assets/icons/basketball-player-white.png') : require('../assets/icons/basketball-player.png')}
                        />
                        <View style={{ marginTop: 10 }}>
                            <Text style={{
                                alignSelf: 'center',
                                fontSize: '150%',
                                fontWeight: 'bold',
                                color: isPlayerSelected ? '#FFFFFF' : '#000000',
                            }}>找球員</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <View>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                            paddingTop: 20
                        }}>
                        搜尋名稱
                    </Text>

                </View>
            </View>
            <View style={styles.cardsWrapper}>
                <SearchBar
                    round
                    searchIcon={{ size: 30 }}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="搜尋 球員名稱／球隊名稱"
                    value={search}
                    lightTheme={true}
                    containerStyle={{ backgroundColor: 'gray', padding: 0, borderRadius: 15, }}
                    inputContainerStyle={{ backgroundColor: '#f4f4f4' }}
                    inputStyle={{ backgroundColor: 'white', textAlign: 'center' }}
                    placeholderTextColor={'gray'}
                />
            </View>
            <View>
                <View>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                            paddingBottom: 20
                        }}>
                        搜尋結果
                    </Text>

                </View>
            </View>
            <ScrollView>
                <View>
                    <View>
                        <View style={{ height: 1000 }}>
                            {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
                            <SwipeListView

                                data={displayDataSource}
                                keyExtractor={item => item.team_id}
                                renderItem={
                                    isTeamSelected
                                        ? renderItem_team
                                        : isPlayerSelected
                                            ? renderItem_player
                                            : isGameSelected
                                                ? renderItem_game
                                                : renderItem_team}
                                renderHiddenItem={
                                    isTeamSelected
                                        ? renderHiddenItem_team
                                        : isPlayerSelected
                                            ? renderHiddenItem_player
                                            : renderHiddenItem_game
                                                ? renderHiddenItem_game
                                                : renderHiddenItem_team}
                                leftOpenValue={75}
                                rightOpenValue={-150} // 向左拉可以拉到那裡停下來 -150 是看到修改
                                // disableRightSwipe
                                onRowDidOpen={onRowDidOpen}
                                leftActivationValue={100}
                                // rightActivationValue={-75}     // 由右向左拉到 -300 就會 extend 刪除的紅色區域
                                leftActionValue={0}
                                rightActionValue={-500}
                                onLeftAction={onLeftAction}
                                onRightAction={onRightAction}
                                onLeftActionStatusChange={onLeftActionStatusChange}
                                onRightActionStatusChange={onRightActionStatusChange}
                                swipeRowStyle={{ height: 100 }} // 調這
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.categoryContainer, { marginTop: 120 }]}>
                <View>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'pink',
        marginHorizontal: 100,
    },
    text: {
        fontSize: 42,
    },
    itemStyle: {
        padding: 10,
    },
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },

    pickerSelectContainer: {
        height: 40,
        width: '50%',
        marginTop: 10,
        paddingTop: 40,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        margin: 30,
    },

    wrapper: {},

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
    categoryContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    categoryBtn: {
        // backgroundColor: '透明',
        flex: 1,
        width: '30%',
        marginHorizontal: 0,
        alignSelf: 'center',
    },
    categoryIcon: {
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: "80%",
        height: 150,
        // backgroundColor: '#000000', // 找球賽、找球隊、找球員的顏色
        borderRadius: 50,
    },
    categoryBtnTxt: {
        alignSelf: 'center',
        marginTop: 5,
        color: '#de4f35',
    },
    cardsWrapper: {
        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
    },
    card: {
        height: "100%",
        // marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ffffff',
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    },
    cardImgWrapper: {
        flex: 1,
    },
    cardImg: {
        height: '100%',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    },
    cardInfo: {
        flex: 2,
        padding: 10,
        height: '100%',
        width: '80%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 12,
        color: '#444',
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        height: 100,
        margin: 25,
        // marginBottom: 5,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    rowFrontVisible: {
        backgroundColor: '#',
        borderRadius: 5,
        height: 90,
        padding: 2,
        // marginBottom: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 5,
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        paddingRight: 17,
    },
    backRightBtnLeft: {
        backgroundColor: '#1f65ff',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    trash: {
        height: 25,
        width: 25,
        marginRight: 7,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#666',
    },
    details: {
        fontSize: 12,
        color: '#999',
    },

});


export default QueryModifyScreen;