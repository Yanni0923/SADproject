import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');


export const COLORS = {
    primary: '#252c4a',


    // 橘色
    secondary: '#fcf3e1',           // 選項按鈕底色
    secondary_border: '#f7deab',       // 選項按鈕邊框顏色

    // 紅色
    success: '#F08080',             // 選中按鈕底色
    success_border: '#b81a14',       // 選項按鈕邊框顏色

    accent: '#3498db',              // add another
    button: '#6699CC',              // 上面的 progress 的顏色

    error: '#ff4444',
    result: 'coral',
    black: '#171717',
    white: '#FFFFFF',
    coffee: '#8a552f',
    background: "#f4f4f4"

}

export const SIZES = {
    base: 10,
    width,
    height
}