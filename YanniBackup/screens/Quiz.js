import React, { useState } from "react";
import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, Animated } from 'react-native'
import { COLORS, SIZES } from "../../constants";
import * as data from '../../data/QuizData.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Quiz = () => {

    const allQuestions = data.data;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

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

    // 只要答案公布了(執行完 validateAnswer)，就會執行這個
    // 選項點下去的部分寫在 renderNextButton()
    // 所以 handleNext 和 renderNextButton() 是綁在一起的
    const handleNext = () => {
        if (currentQuestionIndex == allQuestions.length - 1) {
            // 已經跑完所有的題目了
            // Show Score Modal
            setShowScoreModal(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1); // 往後一題，題號 + 1
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

    const renderQuestion = () => {
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
                }}>{allQuestions[currentQuestionIndex]?.question}</Text>
            </View>
        )
    }

    const renderOptions = () => {
        return (
            <View>
                {
                    allQuestions[currentQuestionIndex]?.options.map(option => (
                        <TouchableOpacity
                            onPress={() => validateAnswer(option)}
                            disabled={isOptionDisabled}  // 這行加進去的話就不會讓你看到答案後再點第二次
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
                {/* Score Modal */}
            </View>
        </SafeAreaView>
    )
}


export default Quiz;