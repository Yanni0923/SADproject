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

const QueryModifyScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const { colors } = useTheme();
    const theme = useTheme;

    // 貼上滑動刪除 swipe delete 的內容
    const oringin_datas = data.data;

    // 刪除過的資料
    const [listData, setListData] = useState(
        oringin_datas.map((NotificationItem, index) => ({
            key: `${index}`,
            question: NotificationItem.question,
            options: NotificationItem.options,
            correct_option: NotificationItem.correct_option,
            type: NotificationItem.type
        })),
    );
    // 用來裝篩選結果的資料
    const [filteredDataSource, setFilteredDataSource] = useState(listData);

    // 裝 toggleSwitch 開關
    const [isGameSelected, setIsGameSelected] = useState(false);
    // const toggleSwitch_Game = () => setIsGameSelected(previousState => !previousState);

    const [isTeamSelected, setIsTeamSelected] = useState(false);
    // const toggleSwitch_Team = () => setIsTeamSelected(previousState => !previousState);

    const [isPlayerSelected, setIsPlayerSelected] = useState(false);
    // const toggleSwitch_Player = () => setIsPlayerSelected(previousState => !previousState);

    // Pick select
    const [selectedValue, setSelectedValue] = useState("java");

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
        console.log("執行 closeRow()");
    };
    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
        setFilteredDataSource(newData);
        console.log("執行 deleteRow()");
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


    const VisibleItem = props => {
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
                                {data.item.question}
                                {/* 之後這裡要改 */}
                            </Text>
                            <Text numberOfLines={1}>
                                {data.item.options}
                                {/* 之後這裡要改 */}
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    };

    const renderItem = (data, rowMap) => {
        const rowHeightAnimatedValue = new Animated.Value(60);

        return (
            <VisibleItem
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.key)}
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
                            name="close-circle-outline"
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

    const renderHiddenItem = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);


        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.key)}
                onDelete={() => deleteRow(rowMap, data.item.key)}
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
        // 處理前的資料
        console.log("isGameSelected: ", isGameSelected);
        console.log("isTeamSelected: ", isTeamSelected);
        console.log("isPlayerSelected: ", isPlayerSelected);


        // if (!isGameSelected & !isTeamSelected & !isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "game" || item.type == "team" || item.type == "player") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (isGameSelected & !isTeamSelected & !isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "team" || item.type == "player") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (!isGameSelected & isTeamSelected & !isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "game" || item.type == "player") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (!isGameSelected & !isTeamSelected & isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "game" || item.type == "team") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (isGameSelected & isTeamSelected & !isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "player") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (isGameSelected & !isTeamSelected & isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "team") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (!isGameSelected & isTeamSelected & isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "game") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else if (isGameSelected & isTeamSelected & isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         return item
        //     });
        //     setFilteredDataSource(newData);
        // }

    }


    const togglePlayerSelected = () => {

        setIsPlayerSelected(isPlayerSelected => !isPlayerSelected);
        setIsGameSelected(false);
        setIsTeamSelected(false);

        // 我也不知道為什麼要用!才是對的
        // if (!isPlayerSelected) {
        //     const newData = listData.filter(function (item) {
        //         if (item.type == "player") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else {
        //     setFilteredDataSource(listData);
        // }
        threeToggleState();

    }

    const toggleGameSelected = () => {
        setIsGameSelected(isGameSelected => !isGameSelected);
        setIsPlayerSelected(false);
        setIsTeamSelected(false);
        // 我也不知道為什麼要用!才是對的
        // if (!isGameSelected) {
        //     const newData = filteredDataSource.filter(function (item) {
        //         if (item.type == "game") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else {
        //     setFilteredDataSource(listData);
        // }
        threeToggleState();
    }

    const toggleTeamSelected = () => {

        setIsTeamSelected(isTeamSelected => !isTeamSelected);
        setIsPlayerSelected(false);
        setIsGameSelected(false);
        // 我也不知道為什麼要用!才是對的
        // if (!isTeamSelected) {
        //     const newData = filteredDataSource.filter(function (item) {
        //         if (item.type == "team") {
        //             return item
        //         }
        //         else {
        //             return null
        //         }
        //     });
        //     setFilteredDataSource(newData);
        // }
        // else {
        //     setFilteredDataSource(listData);
        // }
        threeToggleState();
    }



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
        // console.log("isGameSelected: ", isGameSelected);
        // console.log("isPlayerSelected: ", isPlayerSelected);
        // console.log("isTeamSelected: ", isTeamSelected);


    };



    const getItem = (item) => {
        // Function for click on an item
        alert('Id : ' + item.id + ' Title : ' + item.title);
    };


    return (
        <View style={styles.container}>
            {/* <View style={styles.sliderContainer}>
                <Swiper
                    autoplay={true}
                    horizontal={false}
                    height={200}
                    activeDotColor="#FFCCCC">
                    <View style={styles.slide}>
                        <Image
                            source={require('../assets/logo.png')}
                            resizeMode='cover'
                            style={styles.sliderImage}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                            source={require('../assets/logo.jpg')}
                            resizeMode='cover'
                            style={styles.sliderImage}
                        />
                    </View>
                </Swiper>
            </View> */}
            <View style={styles.cardsWrapper}>
                <SearchBar
                    round
                    searchIcon={{ size: 30 }}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="Type Here..."
                    value={search}
                    lightTheme={true}
                    containerStyle={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 30 }}
                    inputContainerStyle={{ backgroundColor: 'white' }}
                    inputStyle={{ backgroundColor: '#FFF8D7', textAlign: 'center' }}
                    placeholderTextColor={'gray'}
                />
            </View>
            <View style={styles.categoryContainer}>
                <View>
                    <Text style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                    }}>Hello World!Hello World!Hello World!Hello World!</Text>
                </View>
            </View>

            {/* <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                    </View>
                </TouchableOpacity>
            </View> */}
            <View style={[styles.categoryContainer, { marginTop: 10 }]}>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                        <Button
                            onPress={toggleGameSelected}
                            title="找球賽"
                            style={{}}
                            color={isGameSelected ? "#FF0048" : "#f4f3f4"}
                            accessibilityLabel="Learn more about this purple button"
                        />
                        {/* <Switch
                            trackColor={{ false: "#767577", true: "#FF9494" }}
                            thumbColor={isGameSelected ? "#FF0048" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleGameSelected}
                            value={isGameSelected}
                        /> */}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                        <Button
                            onPress={toggleTeamSelected}
                            title="找球隊"
                            style={{}}
                            color={isTeamSelected ? "#FF0048" : "#f4f3f4"}
                            accessibilityLabel="Learn more about this purple button"
                        />
                        {/* <Switch
                            trackColor={{ false: "#767577", true: "#FF9494" }}
                            thumbColor={isTeamSelected ? "#FF0048" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleTeamSelected}
                            value={isTeamSelected}
                        /> */}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="expand-more" size={35} color="#FFCCCC" />
                        <Button
                            onPress={togglePlayerSelected}
                            title="找球員"
                            style={{}}
                            color={isPlayerSelected ? "#FF0048" : "#f4f3f4"}
                            accessibilityLabel="Learn more about this purple button"
                        />
                        {/* <Switch
                            trackColor={{ false: "#767577", true: "#FF9494" }}
                            thumbColor={isPlayerSelected ? "#FF0048" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={togglePlayerSelected}
                            value={isPlayerSelected}
                        /> */}

                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View>
                    <View >
                        <Text
                            style={{
                                alignSelf: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333',
                            }}>
                            Recently Viewed
                        </Text>
                        <View style={{ height: 1000 }}>
                            {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
                            <SwipeListView

                                data={filteredDataSource}
                                renderItem={renderItem}
                                renderHiddenItem={renderHiddenItem}
                                leftOpenValue={75}
                                rightOpenValue={-150}
                                // disableRightSwipe
                                onRowDidOpen={onRowDidOpen}
                                leftActivationValue={100}
                                // rightActivationValue={-300}     // 由右向左拉到 -300 就會 extend 刪除的紅色區域
                                leftActionValue={0}
                                rightActionValue={-500}
                                onLeftAction={onLeftAction}
                                onRightAction={onRightAction}
                                onLeftActionStatusChange={onLeftActionStatusChange}
                                onRightActionStatusChange={onRightActionStatusChange}
                                swipeRowStyle={{ height: 100 }} // 調這
                            />
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardImgWrapper}>
                                <Image
                                    source={require('../assets/logo.png')}
                                    resizeMode="cover"
                                    style={styles.cardImg}
                                />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>Amazing Food Place</Text>
                                <Text style={styles.cardDetails}>
                                    Amazing description for this amazing place
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: '#fdeae7' /* '#FF6347' */,
        borderRadius: 50,
    },
    categoryBtnTxt: {
        alignSelf: 'center',
        marginTop: 5,
        color: '#de4f35',
    },
    cardsWrapper: {
        marginTop: 50,
        marginBottom: 50,
        width: '90%',
        alignSelf: 'center',
    },
    searchBar: {

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