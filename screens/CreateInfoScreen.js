import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,
    StyleSheet, Animated, TouchableHighlight, StatusBar
} from 'react-native';

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

    let isInit = false;
    let typeSelected = 'Team';
    const selectType = (type) => {
        isInit = true;
        typeSelected = type
    }

    const [msgSuccess, setMsgSuccess] = useState('');
    const [msgError, setMsgError] = useState('');
    // Team
    
    const [team, onChangeTeam] = React.useState('');
    const [school, onChangeSchool] = React.useState('');
    const [coach, onChangeCoach] = React.useState('');
    
    const onPress = () => {
        // Insert {team, school, ...} into database

        // Error if text input field is blank.
        // if () {
        //     setMsgError(() => '*此欄位必填')
        // }
        setMsgSuccess(() => '成功新增球隊 ' + team);
    }

    if (typeSelected === 'Team'){
        return (
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
                    onPress={onPress}    // lert.alert('Button pressed')
                >
                    <Text style={styles.btntext}>新增球隊</Text>
                </TouchableOpacity>
                <Text style={styles.messageSuccess}>{msgSuccess}</Text>
            </View>
        );
    } else if (typeSelected === 'Game'){

    } else if (typeSelected === 'Player'){

    }
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
        backgroundColor: "grey",
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
    }
});