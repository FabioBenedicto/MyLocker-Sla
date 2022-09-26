import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TextInput, BackHandler, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { setStatusBarHidden } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import gStyles from '../../components/gStyles';
import styles from './styles';
import LockerImage from '../../assets/LockerImage.png';
import Button from '../../components/Button';
import useLocker from '../../hooks/useLocker';
import useUser from '../../hooks/useUser';
import api from '../../services/api';

export default function PaymentScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useUser();
    const { locker } = useLocker();
    const [alertV, setAlertV] = useState(false);

    const backAction = () => {
        setAlertV(true);
        return true;
    };

    function handleLockerRent() {
        const requestBodyStudent = {
            ra: user.ra,
            lockerNumber: locker.number,
        };

        const requestBodyLocker = {
            lockerNumber: locker.number,
            isRented: 1,
        };

        setLoading(true);

        api.post('/lockers/set-is-rented', requestBodyLocker).catch((err) => {
            // toast.error(err.response.data.erro);
            console.log(err.response.data.erro);
        });

        api
            .post('/students/update-locker-number', requestBodyStudent, {
                withCredentials: true,
            })
            .then((response) => {
                setUser(response.data);
                // toast.success('Armário alugado com sucesso');
                setLoading(false);
                navigation.navigate('ProfilePage');
                /* setTimeout(() => {
                    toast.dismiss()
                    navigate('/')
                }, 1500) */
            })
            .catch((err) => {
                // toast.error(err.response.data.erro);
                console.log(err.response.data.erro);
            });
    }

    /* useEffect(() => {
        if (locker != null) {
            selectedLockerImgRef.current!.style.backgroundColor = locker.section.color

            colorSpanRef.current!.style.backgroundColor = locker.section.color
        }
    }, []) */

    const transformHexToPlainText = (hex) => {
        if (hex == '#FDFF97') {
            return 'Amarelo';
        } if (hex == '#FF7B7B') {
            return 'Vermelho';
        } if (hex == '#92B7FF') {
            return 'Azul';
        } if (hex == '#A6FFEA') {
            return 'Verde Água';
        }
        return '';
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    setStatusBarHidden(true);

    return (
        <ScrollView>
            <View style={gStyles.container}>

                <View style={[gStyles.textContainer, styles.textContainer]}>
                    <Text style={[gStyles.title, { fontFamily: 'Roboto-Medium' }]}>Alugue um Armário</Text>
                    <Text style={gStyles.subtitle}>Revise seu pedido e realize o pagamento</Text>
                </View>

                <View style={styles.lockerContainer}>
                    <View style={styles.lockerHeader}>

                        <Image source={LockerImage} style={{ backgroundColor: locker.section.color }} />

                        <View>
                            <Text style={styles.lockerNumber}>Armário {locker.number}</Text>
                            <Text style={styles.lockerPrice}>R$200,00</Text>
                        </View>

                    </View>

                    <View style={styles.lockerMain}>

                        {/* <View style={styles.lineInfo}>
                        <Text style={styles.infoText}>Andar:</Text>
                        <Text style={[styles.infoText, { color: '#535353' }]}>Segundo</Text>
                    </View>

                    <View style={styles.lineInfo}>
                        <Text style={styles.infoText}>Cor:</Text>
                        <View style={styles.colorContent}>
                            <Text style={[styles.infoText, { color: '#535353' }]}>{transformHexToPlainText(locker.section.color)}</Text>
                            <View style={[gStyles.color, { backgroundColor: locker.section.color }]} />
                        </View>
                    </View>

                    <View style={styles.lineInfo}>
                        <Text style={styles.infoText}>À esquerda:</Text>
                        <Text style={[styles.infoText, { color: '#535353' }]}>{locker.section.left_room}</Text>
                    </View>

                    <View style={styles.lineInfo}>
                        <Text style={styles.infoText}>À direita:</Text>
                        <Text style={[styles.infoText, { color: '#535353' }]}>{locker.section.right_room}</Text>
    </View> */}
                        <View style={gStyles.lockerInfo}>

                            <View>
                                <Text style={{ fontSize: 20 }}>Número:</Text>
                                <TextInput style={[gStyles.input, gStyles.disabled, { height: 40, fontSize: 20 }]} value={locker.number} editable={false} />
                            </View>

                            <View>
                                <Text style={{ fontSize: 20 }}>Andar:</Text>
                                <TextInput style={[gStyles.input, gStyles.disabled, { height: 40, fontSize: 20 }]} value="" editable={false} />
                            </View>

                            <View>
                                <Text style={{ fontSize: 20 }}>Cor: </Text>
                                <TextInput style={[gStyles.input, gStyles.disabled, { height: 40, fontSize: 20 }]} value={transformHexToPlainText(locker.section.color)} editable={false} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 20 }}>À Esquerda:</Text>
                                <TextInput style={[gStyles.input, gStyles.disabled, { height: 40, fontSize: 20 }]} value={locker.section.left_room} editable={false} />
                            </View>

                            <View>
                                <Text style={{ fontSize: 20 }}>À Direita:</Text>
                                <TextInput style={[styles.input, gStyles.disabled, { height: 40, fontSize: 20 }]} value="teste" editable={false} />
                            </View>
                        </View>

                    </View>

                </View>

                <View style={styles.priceContainer}>

                    <View style={styles.linePrice}>
                        <Text style={styles.titlePrice}>Subtotal</Text>
                        <Text style={styles.titlePrice}>R$200,00</Text>
                    </View>

                    <View style={styles.linePrice}>
                        <Text style={styles.subtitlePrice}>Desconto APM</Text>
                        <Text style={styles.subtitlePrice}>(50%) - R$100,00</Text>
                    </View>

                    <View style={[gStyles.line, { borderStyle: 'dashed', borderColor: '#B0B0B0' }]} />

                    <View style={styles.linePrice}>
                        <Text style={styles.titlePrice}>Total</Text>
                        <Text style={styles.titlePrice}>R$100,00</Text>
                    </View>

                </View>

                <View style={gStyles.buttonContainer}>
                    <Button press={() => {}} disabled={!!loading}>
                        <View style={{ height: 30 }}>
                            {loading
                                ? <ActivityIndicator size="large" color="white" />
                                : <Text style={gStyles.textButton}>Finalizar Compra</Text>}
                        </View>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}
