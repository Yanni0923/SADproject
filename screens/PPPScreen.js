import React, { useState } from "react";
import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, Animated, ScrollView, StyleSheet } from 'react-native'
import { COLORS, SIZES } from "../constants";
import * as data from '../data/QuizData.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { textAlign } from "@mui/system";
const PPPScreen = ({ navigation }) => {
    const problem_length = 5;

    const [allTeams, setAllTeams] = useState(data.teams);

    const [team_id, setteam_id] = useState([]);
    const [game_id, setgame_id] = useState([]);
    const [player_id, setplayer_id] = useState([]);

    const [allGames, setAllGames] = useState(data.games);

    const allPlayers = data.players;
    const [players, setPlayers] = useState(allPlayers[0]['台灣大學']);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // Team, Game, Player
    const [targetTeam, setTargetTeam] = useState(null);
    const [targetGame, setTargetGame] = useState(null);
    const [targetPlayer, setTargetPlayer] = useState(null);
    const [targetGameId, setTargetGameId] = useState(null);
    const [targetPlayerId, setTargetPlayerId] = useState(null);
    const [targetPlayType, setTargetPlayType] = useState(null);
    const [targetFinish, setTargetFinish] = useState(null);
    const [targetResult, setTargetResult] = useState(null);
    const [targetFreeThrow, setTargetFreeThrow] = useState(null);
    const [isPickBH, setPickBH] = useState(null);
    const [foulPossible, setFoulPossible] = useState(null);
    const possibleFoulList = ['2y', '2x', '3y', '3x', 'Shooting Foul']
    var question = [allTeams, allGames, players, data.ppp_1, data.ppp_2[0][targetPlayType], data.ppp_3[0][isPickBH], data.ppp_4]
    var target = [targetTeam, targetGame, targetPlayer, targetPlayType, targetFinish, targetResult, targetFreeThrow]
    const question_name = ['隊伍', '敵方隊伍', '球員', 'Play Type', 'Finish', 'Result', 'Free Throw']
    // 只要有選項被點下去，就會執行這個
    // 選項點下去的部分寫在 renderQuestion()
    // 所以 validateAnswer 和 renderQuestion() 是綁在一起的
    const [start, setStart] = useState(true);
    const getTeamsList = (() => {
        if (start === true) {
            setStart(false)
            axios.get('http://localhost:7777/getTeams')
                .then((response) => {
                    const teamList = response.data['data'];
                    setteam_id(response.data['id']);
                    // console.log(teamList);
                    setAllTeams(teamList);
                    // console.log(allTeams);
                    // some mysterious issues here...
                })
                .catch((error) => { console.error(error) })

        }
    });

    const getGamesList = ((team) => {
        axios
            .post
            ('http://localhost:7777/getGamesByTeam', {
                teamName: team,
            })
            .then((response) => {
                
                setgame_id(response.data['id']);
                // console.log(gameList);
                const host = response.data['host'];
                const guest = response.data['guest'];
                // console.log(typeof host);
                const game_list = host.map((e, index) => allTeams[team_id.indexOf(e)]+'vs\n'+allTeams[team_id.indexOf(guest[index])]);
                setAllGames(game_list);

                // some mysterious issues here...
            })
            .catch((error) => { console.error(error) })
    });
    const getPlayersList = ((team) => {
        axios
            .post
            ('http://localhost:7777/getPlayersByTeam', {
                teamName: team,
            })
            .then((response) => {
                const playerList = response.data['players'];
                setplayer_id(response.data['id']);
                setPlayers(playerList);
                console.log(players);
                // some mysterious issues here...
            })
            .catch((error) => { console.error(error) })
    });
    const createPlay = ((target) => {
        axios
            .post
            ('http://localhost:7777/createPlay', {

                player_id: targetPlayerId ,
                game_id: targetGameId ,
                type: target[3],
                finish: target[4],
                result: target[5],
                free_throw: target[6],
            })
            .then((res) => {
                console.log(res.data['message']);

                // some mysterious issues here...
            })
            .catch((error) => { console.error(error) })
    });
    // 我要把這裡改成「顯示」&「把 Team 紀錄到資料庫」
    const validateSelected = (selectedOption, index) => {

        console.log(selectedOption);
        if (currentQuestionIndex == 0) {
            setTargetTeam(selectedOption);
            getPlayersList(selectedOption);
            getGamesList(team_id[index]);

        }
        if (currentQuestionIndex == 1) {
            setTargetGame(selectedOption);
            console.log(game_id[index]);
            setTargetGameId(game_id[index]);
        }
        if (currentQuestionIndex == 2) {
            setTargetPlayer(selectedOption);
            console.log(player_id[index]);
            setTargetPlayerId(player_id[index]);
        }

        if (currentQuestionIndex == 3) {
            setTargetPlayType(selectedOption);
            decideResult(selectedOption);
        }
        if (currentQuestionIndex == 4) { setTargetFinish(selectedOption); }
        if (currentQuestionIndex == 5) {
            setTargetResult(selectedOption);
            decideFoulPossible(selectedOption);
        }
        if (currentQuestionIndex == 6) { setTargetFreeThrow(selectedOption); }
        // setTargetTeam(selectedOption); // 儲存選到的球隊
        setCurrentOptionSelected(selectedOption);
        // Show Next Button
        setShowNextButton(true);

    }
    const decideResult = (selectedOption) => {
        if (selectedOption == 'P&R BH') {
            setPickBH('P&R BH');
        } else {
            setPickBH('Other');
        }
    }
    const decideFoulPossible = (selectedOption) => {
        if (possibleFoulList.indexOf(selectedOption) == -1) {
            setFoulPossible(0);
        } else {
            setFoulPossible(1);
        }
    }




    // 重新開始下一次測驗
    const addGame = () => {
        createPlay(target);
        setShowScoreModal(false);                          // 把 ScoreModal 那個彈出來的東西關掉
        setCurrentQuestionIndex(0);                        // 重置題號
        setFoulPossible(1);
        setCurrentOptionSelected(null);                    // 把點選的選項都清掉
        setShowNextButton(false);                          // 把 Next Button 關起來
    }
    const addPlay = () => {
        createPlay(target);
        setShowScoreModal(false);                          // 把 ScoreModal 那個彈出來的東西關掉
        setCurrentQuestionIndex(2);                        // 重置題號
        setFoulPossible(1);
        setCurrentOptionSelected(null);                    // 把點選的選項都清掉
        setShowNextButton(false);                          // 把 Next Button 關起來
    }

    // 第一步，選球隊 (Team)
    const renderSelectTeam = () => {
        if (currentQuestionIndex < 7) {                // 第 currentQuestionIndex = 0 題是選球隊
            return (
                <ScrollView>
                    <View style={{

                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        <View style={{
                            width: 400,
                            flexDirection: 'row',
                            // alignItems: 'flex-end',
                            alignSelf: 'center',
                            // justifyContent: 'space-between',
                            flexWrap: 'wrap'
                        }}>
                            {
                                question[currentQuestionIndex].map((option, index) => (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => validateSelected(option, index)}
                                            key={option}
                                            style={{
                                                borderWidth: 3,
                                                borderColor: option == currentOptionSelected
                                                    ? COLORS.success_border
                                                    : COLORS.secondary_border,
                                                backgroundColor: option == currentOptionSelected
                                                    ? COLORS.success
                                                    : COLORS.secondary,
                                                width: 180,
                                                height: 60, borderRadius: 20,
                                                flexDirection: 'row',
                                                alignItems: 'center', justifyContent: 'space-between',
                                                paddingHorizontal: 20,
                                                // textAlign: 'center',
                                                // alignSelf: 'center',
                                                justifyContent: 'center',
                                                marginVertical: 10,
                                                marginHorizontal: 10,
                                            }}
                                        >
                                            {/* 選項按鈕的顏色 */}
                                            <Text style={{
                                                fontSize: 18,
                                                color: option == currentOptionSelected
                                                    ? COLORS.white  // 被選中文字就變白色
                                                    : COLORS.coffee  // 原本文字是黑色
                                                , fontWeight: 'bold',
                                                // textAlign: 'center',
                                                // alignItems: 'center',
                                                // justifyContent: 'center'
                                            }}>{option}</Text>

                                            {/* Show Check Or Cross Icon based on correct answer*/}

                                        </TouchableOpacity>
                                    </View >
                                ))
                            }



                        </View>

                    </View>
                </ScrollView>

            )
        }
    }

    // 只要答案公布了(執行完 validateAnswer)，就會執行這個
    // 選項點下去的部分寫在 renderNextButton()
    // 所以 handleNext 和 renderNextButton() 是綁在一起的
    const handleNext = () => {
        if (currentQuestionIndex == 6 || foulPossible == 0) {
            // 已經跑完所有的題目了
            // Show Score Modal
            setShowScoreModal(true);
        } else {
            getTeamsList(false);
            // console.log('hi');
            setCurrentQuestionIndex(currentQuestionIndex + 1); // 往後一題，題號 + 1 // 設定前三頁為基本資訊
            setCurrentOptionSelected(null);                    // 把點選的選項都清掉
            setShowNextButton(false);                          // 把 Next Button 關起來
        }

        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

    }

    const renderNextButton = () => {
        if (showNextButton) {
            return (
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        marginBottom: 110,
                        marginTop: 20,
                        width: '100%',
                        backgroundColor: 'lightsalmon',
                        padding: 20,
                        borderRadius: 25
                    }}
                >
                    <Text style={{ fontSize: 25, color: COLORS.white, textAlign: 'center', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity >
            )
        } else {
            return null
        }
    }

    // 紀錄進行到第幾題的動態 ProgressBar
    const [progress, setProgress] = useState(new Animated.Value(0));

    const renderProgressBar = () => {
        return (
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                alignSelf: 'center',
                justifyContent: 'center',
            }}>
                {
                    target.slice(0, currentQuestionIndex).map((option, index) => (
                        <TouchableOpacity
                            onPress={() => setCurrentQuestionIndex(index)}
                            key={option}
                            style={{
                                borderWidth: 3,
                                borderColor: COLORS.button,
                                backgroundColor: COLORS.button + "20",
                                height: 50, borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center', justifyContent: 'space-between',
                                paddingHorizontal: 10,
                                marginHorizontal: 5,
                                marginVertical: 10
                            }}
                        >
                            <Text style={{ fontSize: 10, color: COLORS.button, fontWeight: 'bold' }}>{option}</Text>

                            {/* Show Check Or Cross Icon based on correct answer*/}

                        </TouchableOpacity>
                    ))
                }




            </View>
        )
    }

    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={{
                flex: 1,
                paddingVertical: 20,
                paddingHorizontal: 16,
                backgroundColor: COLORS.background,
                position: 'relative'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    alignSelf: 'center',
                    padding: 10,
                    backgroundColor: '#f4f4f4'
                    // paddingBottom: 80,
                    // marginTop: 40
                }}>
                    <Text style={{ color: COLORS.black, fontSize: 30, fontWeight: 'bold' }}>{question_name[currentQuestionIndex]} </Text>

                </View>
                {getTeamsList()}
                {/* ProgressBar */}
                {renderProgressBar()}
                {renderSelectTeam()}

                {renderNextButton()}

                {/* Score Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showScoreModal}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: '#f4f4f4',         // 最底層灰
                        alignItems: 'center',
                        justifyContent: 'center',
                        // alignSelf: 'center',         // 不能加

                    }}>
                        <View style={{
                            backgroundColor: '#f4f4f4',     // 倒數第二最底層灰
                            width: '90%',
                            borderRadius: 20,
                            padding: 20,
                            // alignItems: 'center', // 不能加
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}>
                            <Text style={{ color: COLORS.black, fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>新增成功</Text>
                            <View style={{
                                // flexDirection: 'row',
                                // alignItems: 'flex-end',
                                // alignSelf: 'center',

                            }}>
                                {
                                    target.map((option, index) => (
                                        <TouchableOpacity
                                            onPress={() => setCurrentQuestionIndex(index)}
                                            key={option}
                                            style={{
                                                borderWidth: 3,
                                                borderColor: COLORS.button,
                                                backgroundColor: COLORS.button + "20",
                                                height: 60, borderRadius: 20,
                                                width: "100%",
                                                // flexDirection: 'row',
                                                // alignItems: 'center',
                                                paddingHorizontal: 0,
                                                marginHorizontal: 0,
                                                marginVertical: 10,
                                                textAlign: 'center',
                                                justifyContent: 'center'

                                            }}
                                        >
                                            {/* 最後結果顯示 */}
                                            <Text style={{ fontSize: 20, color: COLORS.button, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }}>{option}</Text>

                                            {/* Show Check Or Cross Icon based on correct answer*/}

                                        </TouchableOpacity>
                                    ))
                                }




                            </View>

                            <TouchableOpacity
                                onPress={addGame}
                                style={{
                                    backgroundColor: 'lightsalmon',
                                    marginTop: 40,
                                    padding: 20, width: '100%', borderRadius: 20
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center', color: COLORS.white, fontSize: 20, fontWeight: 'bold'
                                }}>新增另一項 Game 紀錄</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={addPlay}
                                style={{
                                    backgroundColor: 'lightsalmon',
                                    marginTop: 20,
                                    marginBottom: 40,
                                    padding: 20, width: '100%', borderRadius: 20
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center', color: COLORS.white, fontSize: 20, fontWeight: 'bold'
                                }}>新增另一項 Play 紀錄</Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                </Modal>

                {/* Background Image */}
                <Image
                    source={require('../assets/images/DottedBG.png')}
                    style={{
                        width: SIZES.width,
                        height: 130,
                        zIndex: -1,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        opacity: 0.5
                    }}
                    resizeMode={'contain'}
                />

            </View>
        </SafeAreaView>
    )
}

export default PPPScreen;

const styles = StyleSheet.create({
    nextButton: {
        alignSelf: 'center',
        width: '64%',
        padding: 10,
        backgroundColor: "lightsalmon",
        borderRadius: 25
    }
});