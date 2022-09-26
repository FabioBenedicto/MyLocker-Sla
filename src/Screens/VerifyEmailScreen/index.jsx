import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Image, Keyboard, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createRef } from 'react/cjs/react.production.min';
import MyLockerLogo from '../../assets/MyLockerLogo.png';
import Button from '../../components/Button';
import gStyles from '../../components/gStyles';
import useUser from '../../hooks/useUser';
import styles from './styles';

export default function VerifyEmailScreen() {
    const navigation = useNavigation();
    const { user } = useUser();
    // cont
    const inputs = [createRef(), createRef(), createRef(), createRef(), createRef(), createRef()];

    const ALLOWED_CHARACTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 'r', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    const [inputValues, setInputValues] = useState([null, null, null, null, null, null]);
    // const [cCode, setCCode] = useState('');
    const [codeType, setCodeType] = useState('');
    const [email, setEmail] = useState();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [containerHeight, setContainerHeight] = useState(0);

    const handleCodeSubmit = () => {
        if (codeType == user.code) {
            // toast.success('Verificação realizada com sucesso');
            Alert.alert('Verificação realizada com sucesso');
            setTimeout(() => {
                // toast.dismiss();
                navigation.navigate('CreatePasswordScreen');
            }, 1500);
        } else {
            // toast.error('Código Incorreto');
            Alert.alert('Código Incorreto');
        }
    };

    const scrClear = () => {
        let empty = false;

        inputs.forEach((aux) => {
            if (aux == null) {
                empty = true;
            }
        });

        if (!empty) {
            inputs.forEach((aux) => {
                aux.current.clear();
            });
        }

        setInputValues(['', '', '', '', '', '']);
    };

    const verif = () => {
        let auxContagem = 0;

        inputValues.forEach((aux) => {
            if (aux == null || aux.trim() == '') {
                auxContagem++;
            }
        });

        if (auxContagem == 0) {
            return true;
        }

        return false;
    };

    /*   const textChange = (e, num) => {
    if (ALLOWED_CHARACTERS.includes(e.nativeEvent.toLowerCase())) {
      const auxArray = [];
      let i = 0;
      c.forEach((auxElement) => {
        auxArray[i] = auxElement;
        i += 1;
      });
      auxArray[num] = e.nativeEvent.key;
      setC([auxArray[0], auxArray[1], auxArray[2], auxArray[3], auxArray[4], auxArray[5]]);
      if (num != 5) {
        cont[++num].current.focus();
      }
    }
  }; */

    const handleKeyPress = (e, num) => {
        if (ALLOWED_CHARACTERS.includes(e.nativeEvent.key.toLowerCase())) {
            inputValueChange(false, e, num);
            if (num != 5) {
                inputs[++num].current.focus();
            }
        }
        if (e.nativeEvent.key == 'Backspace') {
            inputValueChange(true, e, num);
            if (num == 0) {
                return;
            }
            num--;
            inputs[num].current.clear();
            inputs[num].current.focus();
        }
    };

    const inputValueChange = (back, e, num) => {
        const auxArray = [];
        let i = 0;
        inputValues.forEach((auxElement) => {
            auxArray[i] = auxElement;
            i += 1;
        });
        if (back) {
            auxArray[num] = null;
        } else {
            auxArray[num] = e.nativeEvent.key;
        }
        setInputValues([auxArray[0], auxArray[1], auxArray[2], auxArray[3], auxArray[4], auxArray[5]]);
    };

    const backAction = () => {
        scrClear();
        navigation.goBack();
        return true;
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            },
        );
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, []);

    useEffect(() => {
        setCodeType(inputValues[0] + inputValues[1] + inputValues[2] + inputValues[3] + inputValues[4] + inputValues[5]);
    }, [inputValues]);

    return (
        <ScrollView
            bounces={false}
            onLayout={(event) => {
                if (!isKeyboardVisible) {
                    setContainerHeight(event.nativeEvent.layout.height);
                }
            }}
        >
            <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={40}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView bounces={false}>
                        <View style={[gStyles.container, { height: containerHeight }]}>

                            <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ alignSelf: 'flex-start', position: 'absolute', top: getStatusBarHeight() + 40 }}>
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    color="#0085FF"
                                    size={49}
                                />
                            </TouchableOpacity>

                            <View style={gStyles.imageContainer}>
                                <Image source={MyLockerLogo} />
                            </View>

                            <View style={gStyles.body}>
                                <View style={gStyles.textContainer}>
                                    <Text style={gStyles.title}>Verifique seu e-mail</Text>
                                    <Text style={gStyles.subtitle}>Digite o código enviado para o seu e-mail</Text>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[0]} maxLength={1} value={inputValues[0]} onKeyPress={(e) => handleKeyPress(e, 0)} />
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[1]} maxLength={1} value={inputValues[1]} onKeyPress={(e) => handleKeyPress(e, 1)} />
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[2]} maxLength={1} value={inputValues[2]} onKeyPress={(e) => handleKeyPress(e, 2)} />
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[3]} maxLength={1} value={inputValues[3]} onKeyPress={(e) => handleKeyPress(e, 3)} />
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[4]} maxLength={1} value={inputValues[4]} onKeyPress={(e) => handleKeyPress(e, 4)} />
                                    <TextInput style={[gStyles.input, styles.input]} ref={inputs[5]} maxLength={1} value={inputValues[5]} onKeyPress={(e) => handleKeyPress(e, 5)} />
                                </View>

                                <TouchableOpacity style={gStyles.linkContainer}>
                                    <Text style={gStyles.linkText}>Reenviar código</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={gStyles.buttonContainer}>
                                <Button text="Continuar" press={handleCodeSubmit}>
                                    <Text style={gStyles.textButton}>Continuar</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}
