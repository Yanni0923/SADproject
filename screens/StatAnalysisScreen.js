import React, { useState } from "react";
import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, Animated } from 'react-native'
import { COLORS, SIZES } from "../constants";
import * as data from '../data/QuizData.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StatAnalysisScreen = ({ navigation }) => {

    const allQuestions = data.data;
    const allTeams = data.teams;
    const allGames = data.games;
    const allPlayers = data.players;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // Team, Game, Player
    const [targetTeam, setTargetTeam] = useState(null);
    const [targetGame, setTargetGame] = useState(null);
    const [targetPlayer, setTargetPlayer] = useState(null);

    // 只要有選項被點下去，就會執行這個
    // 選項點下去的部分寫在 renderQuestion()
    // 所以 validateAnswer 和 renderQuestion() 是綁在一起的
    const validateAnswer = (selectedOption) => {
        let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
        setCurrentOptionSelected(selectedOption);
        setCorrectOption(correct_option);
        setIsOptionDisabled(true);
        if (selectedOption == correct_option) {
            // Set Score
            setScore(score + 1);
        }

        // Show Next Button
        setShowNextButton(true);

    }


    // 我要把這裡改成「顯示」&「把 Team 紀錄到資料庫」
    const validateSelectedTeam = (selectedOption) => {
        console.log(selectedOption);
        setTargetTeam(selectedOption); // 儲存選到的球隊
        setCurrentOptionSelected(selectedOption);
        // Show Next Button
        setShowNextButton(true);

    }

    // 我要把這裡改成「顯示」&「把 Game 紀錄到資料庫」
    const validateSelectedGame = (selectedOption) => {
        console.log(selectedOption);
        setTargetGame(selectedOption); // 儲存選到的球隊
        setCurrentOptionSelected(selectedOption);
        // Show Next Button
        setShowNextButton(true);

    }

    // 我要把這裡改成「顯示」&「把 Player 紀錄到資料庫」
    const validateSelectedPlayer = (selectedOption) => {
        console.log(selectedOption);
        setTargetPlayer(selectedOption); // 儲存選到的球隊
        setCurrentOptionSelected(selectedOption);
        // Show Next Button
        setShowNextButton(true);

    }





    // 重新開始下一次測驗
    const restartQuiz = () => {
        setShowScoreModal(false);                          // 把 ScoreModal 那個彈出來的東西關掉

        setCurrentQuestionIndex(0);                        // 重置題號
        setScore(0);                                       // 重置分數

        setCurrentOptionSelected(null);                    // 把點選的選項都清掉
        setCorrectOption(null);                            // 把上一題的正確答案清掉
        setIsOptionDisabled(false);                        // 把選項都開放可以點選
        setShowNextButton(false);                          // 把 Next Button 關起來

        Animated.timing(progress, {                        // 把進度條歸 0
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }


    // 第一步，選球隊 (Team)
    const renderSelectTeam = () => {
        if (currentQuestionIndex == 0) {                // 第 currentQuestionIndex = 0 題是選球隊
            return (
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>{currentQuestionIndex + 1}</Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6 }}>/ {allQuestions.length} </Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>PPP紀錄</Text>
                    </View>

                    {/* Question */}
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 30
                    }}>{allTeams[0]?.question}</Text>
                    <View>
                        {
                            allTeams.map(option => (
                                <TouchableOpacity
                                    onPress={() => validateSelectedTeam(option)}
                                    key={option}
                                    style={{
                                        borderWidth: 3,
                                        borderColor: option == currentOptionSelected
                                            ? COLORS.success
                                            : COLORS.secondary + "40",
                                        backgroundColor: option == currentOptionSelected
                                            ? COLORS.success + "20"
                                            : COLORS.secondary + "20",
                                        height: 60, borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center', justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        marginVertical: 10
                                    }}
                                >
                                    <Text style={{ fontSize: 20, color: COLORS.white }}>{option}</Text>

                                    {/* Show Check Or Cross Icon based on correct answer*/}
                                    {
                                        option == currentOptionSelected ? (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.success,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="check" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        ) : (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.white,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="exclamationcircle" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        )
                                    }

                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            )
        }
    }

    // 第二步，選球賽 (Game)
    const renderSelectGame = () => {
        if (currentQuestionIndex == 1) {            // 第 currentQuestionIndex = 1 題是選球賽
            return (
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>{currentQuestionIndex + 1}</Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6 }}>/ {allQuestions.length} </Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>PPP紀錄</Text>
                    </View>

                    {/* Question */}
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 30
                    }}>{allTeams[0]?.question}</Text>
                    <View>
                        {
                            allGames[0]?.options[targetTeam].map(option => (
                                <TouchableOpacity
                                    onPress={() => validateSelectedGame(option)}
                                    key={option}
                                    style={{
                                        borderWidth: 3,
                                        borderColor: option == currentOptionSelected
                                            ? COLORS.success
                                            : COLORS.secondary + "40",
                                        backgroundColor: option == currentOptionSelected
                                            ? COLORS.success + "20"
                                            : COLORS.secondary + "20",
                                        height: 60, borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center', justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        marginVertical: 10
                                    }}
                                >
                                    <Text style={{ fontSize: 20, color: COLORS.white }}>{option}</Text>

                                    {/* Show Check Or Cross Icon based on correct answer*/}
                                    {
                                        option == currentOptionSelected ? (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.success,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="check" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        ) : (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.white,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="exclamationcircle" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        )
                                    }

                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            )
        } else {
            return null
        }

    }

    // 第三步，選球員 (Player)
    const renderSelectPlayer = () => {
        if (currentQuestionIndex == 2) {            // 第 currentQuestionIndex = 2 題是選球員
            return (
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>{currentQuestionIndex + 1}</Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6 }}>/ {allQuestions.length} </Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>PPP紀錄</Text>
                    </View>

                    {/* Question */}
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 30
                    }}>{allTeams[0]?.question}</Text>
                    <View>
                        {
                            allPlayers[0][targetTeam].map(option => (
                                <TouchableOpacity
                                    onPress={() => validateSelectedPlayer(option)}
                                    key={option}
                                    style={{
                                        borderWidth: 3,
                                        borderColor: option == currentOptionSelected
                                            ? COLORS.success
                                            : COLORS.secondary + "40",
                                        backgroundColor: option == currentOptionSelected
                                            ? COLORS.success + "20"
                                            : COLORS.secondary + "20",
                                        height: 60, borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center', justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        marginVertical: 10
                                    }}
                                >
                                    <Text style={{ fontSize: 20, color: COLORS.white }}>{option}</Text>

                                    {/* Show Check Or Cross Icon based on correct answer*/}
                                    {
                                        option == currentOptionSelected ? (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.success,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="check" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        ) : (
                                            <View style={{
                                                width: 30, height: 30, borderRadius: 30 / 2,
                                                backgroundColor: COLORS.white,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name="exclamationcircle" style={{
                                                    color: COLORS.white,
                                                    fontSize: 20
                                                }} />
                                            </View>
                                        )
                                    }

                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            )
        } else {
            return null
        }
    }

    // 只要答案公布了(執行完 validateAnswer)，就會執行這個
    // 選項點下去的部分寫在 renderNextButton()
    // 所以 handleNext 和 renderNextButton() 是綁在一起的
    const handleNext = () => {
        if (currentQuestionIndex == allQuestions.length - 1 + 3) {
            // 已經跑完所有的題目了
            // Show Score Modal
            setShowScoreModal(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1); // 往後一題，題號 + 1 // 設定前三頁為基本資訊
            setCurrentOptionSelected(null);                    // 把點選的選項都清掉
            setCorrectOption(null);                            // 把上一題的正確答案清掉
            setIsOptionDisabled(false);                        // 把選項都開放可以點選
            setShowNextButton(false);                          // 把 Next Button 關起來
        }

        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

    }

    const renderQuestion = () => {
        if (currentQuestionIndex > 2) {
            return (
                <View style={{
                    marginVertical: 40
                }}>
                    {/* Question Counter */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2 }}>{currentQuestionIndex + 1}</Text>
                        <Text style={{ color: COLORS.white, fontSize: 20, opacity: 0.6 }}>/ {allQuestions.length}</Text>
                    </View>

                    {/* Question */}
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 30
                    }}>{allQuestions[currentQuestionIndex - 3]?.question}</Text>
                </View>
            )
        }
    }

    const renderOptions = () => {
        if (currentQuestionIndex > 2) {
            return (
                <View>
                    {
                        allQuestions[currentQuestionIndex - 3]?.options.map(option => (
                            <TouchableOpacity
                                onPress={() => validateSelectedTeam(option)}
                                key={option}
                                style={{
                                    borderWidth: 3,
                                    borderColor: option == correctOption //把正確與錯誤答案框起來
                                        ? COLORS.success
                                        : option == currentOptionSelected
                                            ? COLORS.error
                                            : COLORS.secondary + "40",
                                    backgroundColor: option == correctOption //把正確與錯誤答案的背景顏色改掉
                                        ? COLORS.success + "20"
                                        : option == currentOptionSelected
                                            ? COLORS.error + "20"
                                            : COLORS.secondary + "20",
                                    height: 60, borderRadius: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center', justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    marginVertical: 10
                                }}
                            >
                                <Text style={{ fontSize: 20, color: COLORS.white }}>{option}</Text>

                                {/* Show Check Or Cross Icon based on correct answer*/}
                                {
                                    option == correctOption ? (
                                        <View style={{
                                            width: 30, height: 30, borderRadius: 30 / 2,
                                            backgroundColor: COLORS.success,
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <MaterialCommunityIcons name="check" style={{
                                                color: COLORS.white,
                                                fontSize: 20
                                            }} />
                                        </View>
                                    ) : option == currentOptionSelected ? (
                                        <View style={{
                                            width: 30, height: 30, borderRadius: 30 / 2,
                                            backgroundColor: COLORS.error,
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <MaterialCommunityIcons name="close" style={{
                                                color: COLORS.white,
                                                fontSize: 20
                                            }} />
                                        </View>
                                    ) : (
                                        <View style={{
                                            width: 30, height: 30, borderRadius: 30 / 2,
                                            backgroundColor: COLORS.white,
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <MaterialCommunityIcons name="exclamationcircle" style={{
                                                color: COLORS.white,
                                                fontSize: 20
                                            }} />
                                        </View>
                                    )
                                }

                            </TouchableOpacity>
                        ))
                    }
                </View>
            )
        }
    }

    const renderNextButton = () => {
        if (showNextButton) {
            return (
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        marginTop: 20, width: '100%', backgroundColor: COLORS.accent, padding: 20, borderRadius: 5
                    }}
                >
                    <Text style={{ fontSize: 20, color: COLORS.white, textAlign: 'center' }}>Next</Text>
                </TouchableOpacity>
            )
        } else {
            return null
        }
    }

    // 紀錄進行到第幾題的動態 ProgressBar
    const [progress, setProgress] = useState(new Animated.Value(0));
    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%', '100%']
    })

    const renderProgressBar = () => {
        return (
            <View style={{
                width: '100%',
                height: 20,
                borderRadius: 20,
                backgroundColor: '#00000020'
            }}>
                <Animated.View style={[{
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: COLORS.accent
                }, {
                    width: progressAnim
                }]}>

                </Animated.View>

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
                paddingVertical: 40,
                paddingHorizontal: 16,
                backgroundColor: COLORS.background,
                position: 'relative'
            }}>

                {/* ProgressBar */}
                {renderProgressBar()}

                {/* Select Team-Game-Player */}
                {renderSelectTeam()}
                {renderSelectGame()}
                {renderSelectPlayer()}

                {/* Question */}
                {renderQuestion()}

                {/* Options */}
                {renderOptions()}

                {/* Next Button */}
                {renderNextButton()}

                {/* Score Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showScoreModal}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            backgroundColor: COLORS.white,
                            width: '90%',
                            borderRadius: 20,
                            padding: 20,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 30,
                                fontWeight: 'bold'
                            }}>{score > (allQuestions.length / 2) ? 'Congratulation!' : 'Oops!'}</Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginVertical: 20
                            }}>
                                <Text style={{
                                    fontSize: 30,
                                    color: score > (allQuestions.length / 2) ? COLORS.success : COLORS.error
                                }}>{score}</Text>
                                <Text style={{
                                    fontSize: 30,
                                    color: COLORS.black
                                }}>/ {allQuestions.length}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={restartQuiz}
                                style={{
                                    backgroundColor: COLORS.accent,
                                    padding: 20, width: '100%', borderRadius: 20
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center', color: COLORS.white, fontSize: 20
                                }}>Retry Quiz</Text>
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

export default StatAnalysisScreen;
