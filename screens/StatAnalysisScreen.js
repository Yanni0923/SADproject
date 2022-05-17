import React, { useState } from "react";
import { View, Text, StatusBar, Image, StyleSheet, TouchableOpacity, Modal, Animated, ScrollView, TouchableHighlight } from 'react-native'
import { COLORS, SIZES } from "../constants";
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

// import { TouchableOpacity} from 'react-native-gesture-handler'

const StatAnalysisScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const theme = useTheme;

    // 貼上滑動刪除 swipe delete 的內容
    const Notifications = notifications.Notifications;
    const [listData, setListData] = useState(
        Notifications.map((NotificationItem, index) => ({
            key: `${index}`,
            title: NotificationItem.title,
            details: NotificationItem.details,
        })),
    );

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
                style={[styles.rowFront, { height: rowHeightAnimatedValue }]}>
                <TouchableHighlight
                    style={styles.rowFrontVisible}
                    onPress={() => console.log('Element touched')}
                    underlayColor={'#aaa'}>
                    <View>
                        <Text style={styles.title} numberOfLines={1}>
                            {data.item.title}
                        </Text>
                        <Text style={styles.details} numberOfLines={1}>
                            {data.item.details}
                        </Text>
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <View style={styles.sliderContainer}>
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
            <View style={styles.pickerSelectContainer}>
                <View>
                    <RNPickerSelect
                        placeholder={{
                            label: '------------請選擇球隊--------------', // 預設空字串，才不會跳錯
                            value: '', // 預設空字串，才不會跳錯
                        }}
                        items={[
                            { label: "JavaScript", value: "JavaScript" },
                            { label: "TypeScript", value: "TypeScript" },
                            { label: "Python", value: "Python" },
                            { label: "Java", value: "Java" },
                            { label: "C++", value: "C++" },
                            { label: "C", value: "C" },
                        ]}
                        onValueChange={(value) => { console.log(value); }}
                    />
                </View>
            </View>
            <View style={styles.pickerSelectContainer}>
                <View>
                    <RNPickerSelect
                        placeholder={{
                            label: '------------請選擇球隊--------------', // 預設空字串，才不會跳錯
                            value: '', // 預設空字串，才不會跳錯
                        }}
                        items={[
                            { label: "JavaScript", value: "JavaScript" },
                            { label: "TypeScript", value: "TypeScript" },
                            { label: "Python", value: "Python" },
                            { label: "Java", value: "Java" },
                            { label: "C++", value: "C++" },
                            { label: "C", value: "C" },
                        ]}
                        onValueChange={(value) => { console.log(value); }}
                    />
                </View>
            </View>
            <View style={styles.categoryContainer}>
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
            </View>
            <View style={[styles.categoryContainer, { marginTop: 10 }]}>
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
            </View>
            <ScrollView>
                <View style={styles.cardsWrapper}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                        Recently Viewed
                    </Text>
                    <View style={styles.container}>
                        {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
                        <SwipeListView
                            data={listData}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={75}
                            rightOpenValue={-150}
                            // disableRightSwipe
                            onRowDidOpen={onRowDidOpen}
                            leftActivationValue={100}
                            rightActivationValue={-200}     // 由右向左拉到 -200 就會 extend 刪除的紅色區域
                            leftActionValue={0}
                            rightActionValue={-500}
                            onLeftAction={onLeftAction}
                            onRightAction={onRightAction}
                            onLeftActionStatusChange={onLeftActionStatusChange}
                            onRightActionStatusChange={onRightActionStatusChange}
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
            </ScrollView>
        </View>
    );

}

export default StatAnalysisScreen;

const styles = StyleSheet.create({

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
        width: 70,
        height: 70,
        backgroundColor: '#fdeae7' /* '#FF6347' */,
        borderRadius: 50,
    },
    categoryBtnTxt: {
        alignSelf: 'center',
        marginTop: 5,
        color: '#de4f35',
    },
    cardsWrapper: {
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
    },
    card: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    cardImgWrapper: {
        flex: 1,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    cardInfo: {
        flex: 2,
        padding: 10,
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
        backgroundColor: '#f4f4f4',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        margin: 5,
        marginBottom: 5,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    rowFrontVisible: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        padding: 10,
        marginBottom: 15,
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
