import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import LockerContainerBlue from '../../assets/LockerContainerBlue.png';
import LockerContainerGreen from '../../assets/LockerContainerGreen.png';
import LockerContainerRed from '../../assets/LockerContainerRed.png';
import LockerContainerYellow from '../../assets/LockerContainerYellow.png';
import LockerImage from '../../assets/LockerImage.png';
import Button from '../../components/Button';
import gStyles from '../../components/gStyles';
import useLocker from '../../hooks/useLocker';
import api from '../../services/api';
import styles from './styles';

export default function LockersMap() {
    const navigation = useNavigation();
    const [mapLocker, setMapLocker] = useState([
        [{ key: '1', type: true, data: 'Sala 10', flor: 2 },
            { key: '2', type: false, data: LockerContainerYellow, pressFunc: () => { setSectionChoosed(1); } },
            { key: '3', type: true, data: 'Sala 11', flor: 2 },
            { key: '4', type: false, data: LockerContainerYellow, pressFunc: () => { setSectionChoosed(2); } },
            { key: '5', type: true, data: 'Sala 12', flor: 2 },
            { key: '7', type: true, data: 'Saúde', flor: 2 },
            { key: '8', type: false, data: LockerContainerRed, pressFunc: () => { setSectionChoosed(3); } },
            { key: '9', type: true, data: 'Sala 13', flor: 2 },
            { key: '10', type: false, data: LockerContainerRed, pressFunc: () => { setSectionChoosed(4); } },
            { key: '11', type: true, data: 'Sala 14', flor: 2 },
            { key: '12', type: false, data: LockerContainerRed, pressFunc: () => { setSectionChoosed(5); } },
            { key: '13', type: true, data: 'Sala 15', flor: 2 }],
        [{ key: '15', type: true, data: 'Sala 2', flor: 1 },
            { key: '16', type: false, data: LockerContainerGreen, pressFunc: () => { setSectionChoosed(6); } },
            { key: '17', type: true, data: 'Sala 3', flor: 1 },
            { key: '19', type: true, data: 'Vestiário Masculino', flor: 1 },
            { key: '20', type: false, data: LockerContainerBlue, pressFunc: () => { setSectionChoosed(7); } },
            { key: '21', type: true, data: 'Sala 4', flor: 1 },
            { key: '22', type: false, data: LockerContainerBlue, pressFunc: () => { setSectionChoosed(8); } },
            { key: '23', type: true, data: 'Sala 5', flor: 1 }],
    ]);
    const [lockers, setLockers] = useState([]);
    const [sectionChoosed, setSectionChoosed] = useState(0);
    const [lockersSectionChoosed, setLockersSectionChoosed] = useState([]);
    const [lockersSectionChoosedOrdened, setLockersSectionChoosedOrdened] = useState([]);
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [navText, setNavText] = useState(['null', 'null']);
    const [lockersReady, setLockersReady] = useState(false);
    const [sizeLockersLine, setSizeLockersLine] = useState(0);
    const [arrowLeftEnabled, setArrowLeftEnabled] = useState(false);
    const [arrowRightEnabled, setArrowRightEnabled] = useState(false);
    const [endPages, setEndPages] = useState(0);
    const [page, setPage] = useState(0);
    const [lockersPage, setLockersPage] = useState([]);
    const [modV, setModV] = useState([false]);
    const [lockerModal, setLockerModal] = useState({});
    const { locker, setLocker } = useLocker();
    const [floor, setFloor] = useState(1);
    const [arrowLeftFloorEnabled, setArrowLeftFloorEnabled] = useState(false);
    const [arrowRightFloorEnabled, setArrowRightFloorEnabled] = useState(false);
    const { width, height } = Dimensions.get('window');
    const anV = useRef(new Animated.ValueXY({ x: 0, y: height })).current;

    const loadLockers = async () => {
        api
            .get('/lockers')
            .then((response) => {
                setLockers(response.data);
            })
            .catch((err) => {
                Alert.alert('', err.response.data.erro);
            });
    };

    const loadSection = () => {
        const lockersSection = [];
        lockers.forEach((element) => {
            if (element.FK_section_id == sectionChoosed) {
                lockersSection.push(element);
            }
        });
        setLockersSectionChoosed(lockersSection);
    };

    function sliceLockersInStepsOfTwo(start, end) {
        const response = [];
        console.log('chamou splice');
        if (end > lockersSectionChoosed.length) {
            return;
        }
        for (let i = start; i <= end; i += 2) {
            response.push(lockersSectionChoosed[i]);
        }
        // eslint-disable-next-line consistent-return
        return response;
    }

    function parseLockers() {
        const lockersSplited = [];
        let i = 0;
        let times = 0;
        let sum = 1;
        while (i < lockersSectionChoosed.length) {
            if (times > 0) {
                times = 0;
                sum = 7;
            } else {
                sum = 1;
                times++;
            }
            const sliced = sliceLockersInStepsOfTwo(i, i + 6);
            if (sliced == undefined) {
                break;
            }
            lockersSplited.push(sliced);
            i += sum;
        }
        setLockersSectionChoosedOrdened(lockersSplited);
    }

    const backAction = () => {
        console.log(sectionChoosed);
        if (sectionChoosed <= 0) {
            navigation.navigate('ProfileScreen');
        } else {
            console.log('Entrou');
            setSectionChoosed(0);
        }
        return true;
    };

    useEffect(() => {
        loadLockers();
        setLockersReady(true);
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    useEffect(() => {
        loadSection();
    }, [sectionChoosed]);

    useEffect(() => {
        setSizeLockersLine(lockersSectionChoosed.length / 4);
        parseLockers();
    }, [lockersSectionChoosed]);

    useEffect(() => {
        setEndPages(Math.ceil(sizeLockersLine / 4) - 1);
    }, [sizeLockersLine]);

    useEffect(() => {
        spliceIntoChunks(lockersSectionChoosedOrdened, page);
    }, [lockersSectionChoosedOrdened]);

    useEffect(() => {
        spliceIntoChunks(lockersSectionChoosedOrdened, page);
        if (page > 0) {
            setArrowLeftEnabled(true);
        } else {
            setArrowLeftEnabled(false);
        }
        if (page < endPages) {
            setArrowRightEnabled(true);
        } else {
            setArrowRightEnabled(false);
        }
    }, [page, endPages]);

    useEffect(() => {
        if (floor > 1) {
            setArrowLeftFloorEnabled(true);
        } else {
            setArrowLeftFloorEnabled(false);
        }
        if (floor < 2) {
            setArrowRightFloorEnabled(true);
        } else {
            setArrowRightFloorEnabled(false);
        }
    }, [floor]);

    useEffect(() => {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAA');
        console.log(sectionChoosed);
        console.log(arrowLeftEnabled);
        console.log(arrowRightEnabled);
    }, [arrowLeftEnabled, arrowRightEnabled]);

    let auxAvalible = { backgroundColor: '#4ECB71' };

    const modal = (item) => {
        setModV(true);
    };

    const anStart = () => {
        Animated.timing(
            anV,
            {
                toValue: { x: 0, y: height },
                duration: 2,
                useNativeDriver: false,
            },
        ).start();

        setTimeout(() => {
            if (lockerModal.available) {
                auxAvalible = { backgroundColor: '#4ECB71' };
            } else {
                auxAvalible = { backgroundColor: '#FF7B7B' };
            }
            setModV(true);

            Animated.timing(
                anV,
                {
                    toValue: { x: 0, y: height / 2 },
                    duration: 300,
                    useNativeDriver: false,
                },
            ).start();
        }, 2);
    };

    function spliceIntoChunks(array, pageFunction) {
        console.log('teste');
        // ta recebendo array certo
        console.log(array);
        let result = [];
        const inicio = pageFunction * 4;
        // page começa em 0 mas soma 1 na interface
        result = array.slice(inicio, inicio + 4);
        console.log('teste splice');
        console.log(result);
        setLockersPage(result);
    }

    const go = () => {
        console.log('go');
        console.log(page);
        console.log(endPages);
        if (page < endPages) { setPage(page + 1); }
    };

    const back = () => {
        console.log('back');
        if (page > 0) { setPage(page - 1); }
    };

    const goFloor = () => {
        if (floor < 2) { setFloor(floor + 1); }
    };

    const backFloor = () => {
        if (floor > 1) { setFloor(floor - 1); }
    };

    return (
        <View style={styles.container}>
            <Modal visible={modV} transparent animationType="none">

                <TouchableOpacity style={gStyles.background} onPress={() => setModV(false)} />

                <Animated.View style={[gStyles.modalContainer, anV.getLayout()]}>
                    <View>

                        <View>
                            <Text style={[gStyles.smallTitle, { textAlign: 'center' }]}>Armário {lockerModal.number}</Text>
                        </View>

                        <View style={gStyles.lockerInfo}>

                            <View style={[gStyles.lineInfo]}>
                                <Text style={gStyles.smallSubtitle}>Andar:</Text>
                                <Text style={[gStyles.smallSubtitle, { color: '#535353' }]}>Segundo</Text>
                            </View>

                            <View style={gStyles.lineInfo}>
                                <Text style={gStyles.smallSubtitle}>Cor:</Text>
                                <View style={styles.colorContent}>
                                    <Text style={[gStyles.smallSubtitle, { color: '#535353' }]}>sei la como faze a cor por ext</Text>
                                    <View style={[gStyles.color, { backgroundColor: lockerModal.color }]} />
                                </View>
                            </View>

                            <View style={gStyles.lineInfo}>
                                <Text style={gStyles.smallSubtitle}>À esquerda:</Text>
                                <Text style={[gStyles.smallSubtitle, { color: '#535353' }]}>Saúde</Text>
                            </View>

                            <View style={gStyles.lineInfo}>
                                <Text style={gStyles.smallSubtitle}>À direita:</Text>
                                <Text style={[gStyles.smallSubtitle, { color: '#535353' }]}>Sala 13</Text>
                            </View>

                            <View style={gStyles.lineInfo}>
                                <Text style={gStyles.smallSubtitle}>Situação:</Text>
                                <View style={styles.colorContent}>
                                    <Text style={[gStyles.smallSubtitle, { color: '#535353' }]}>Disponível</Text>
                                    <View style={[gStyles.color, auxAvalible]} />
                                </View>
                            </View>

                        </View>

                    </View>

                    <Button press={() => { setLocker(lockerModal); navigation.navigate('PaymentScreen'); }}>
                        {
                            !lockerModal.isRented
                                ? <Text>Alugar</Text>
                                : <Text>Armário já alugado</Text>
                        }
                    </Button>

                </Animated.View>

            </Modal>

            {
                !sectionChoosed
                    ? (
                        <>
                            <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ alignSelf: 'flex-start', position: 'absolute', top: getStatusBarHeight() + 40 }}>
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    color="#0085FF"
                                    size={49}
                                />
                            </TouchableOpacity>

                            <View style={{ marginTop: getStatusBarHeight() + 40 }}>
                                <View View style={[gStyles.textContainer]}>
                                    <Text style={gStyles.title}>Alugue um Armário</Text>
                                    <Text style={gStyles.subtitle}>Selecione o bloco que você deseja</Text>
                                </View>
                            </View>

                            {/* {
                                !lockersReady ?

                            } */}

                            <FlatList
                                style={styles.flatlist}
                                data={mapLocker[floor - 1]}
                                renderItem={({ item }) => {
                                    if (item.type) {
                                        return (<Text style={[gStyles.title, styles.flatData]}> {item.data} </Text>);
                                    }
                                    return (<TouchableOpacity onPress={item.pressFunc} style={styles.flatDataL}><Image source={item.data} style={styles.lockerImage} resizeMode="contain" /></TouchableOpacity>);
                                }}
                            />

                            <View style={styles.navLockers}>
                                <TouchableOpacity onPress={backFloor} disabled={!arrowLeftFloorEnabled}>
                                    <MaterialIcons
                                        name="keyboard-arrow-left"
                                        color="#000000"
                                        size={64}
                                    />
                                </TouchableOpacity>

                                <View style={{ justifyContent: 'center' }}><Text style={gStyles.title}> {floor}º Andar</Text></View>

                                <TouchableOpacity onPress={goFloor} disabled={!arrowRightFloorEnabled}>
                                    <MaterialIcons
                                        name="keyboard-arrow-right"
                                        color="#000000"
                                        size={64}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                    : (
                        <>
                            <View View style={styles.textContainer}>
                                <Text style={gStyles.title}>Alugue um Armário</Text>
                                <Text style={gStyles.subtitle}>Selecione o armário que você deseja.</Text>
                            </View>

                            <FlatList
                                style={styles.flatlist}
                                data={lockersPage}
                                columnWrapperStyle={styles.row}
                                key="_"
                                numColumns={4}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity onPress={() => { anStart(); setLockerModal(item[0]); console.log(arrowRightEnabled); }} style={styles.flatData}>
                                            <Image source={LockerImage} style={[styles.lockerImageL, { backgroundColor: item[0].section.color }]} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { anStart(); setLockerModal(item[1]); }} style={styles.flatData}>
                                            <Image source={LockerImage} style={[styles.lockerImageL, { backgroundColor: item[1].section.color }]} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { anStart(); setLockerModal(item[2]); }} style={styles.flatData}>
                                            <Image source={LockerImage} style={[styles.lockerImageL, { backgroundColor: item[2].section.color }]} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { anStart(); setLockerModal(item[3]); }} style={styles.flatData}>
                                            <Image source={LockerImage} style={[styles.lockerImageL, { backgroundColor: item[3].section.color }]} resizeMode="contain" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            <View style={styles.navLockers}>
                                <TouchableOpacity onPress={back} disabled={!arrowLeftEnabled}>
                                    <MaterialIcons
                                        name="keyboard-arrow-left"
                                        color="#000000"
                                        size={64}
                                    />
                                </TouchableOpacity>
                                <View style={{ justifyContent: 'center' }}><Text style={gStyles.title}> {page + 1} </Text></View>
                                <View style={{ justifyContent: 'center' }}><Text style={gStyles.title}> - </Text></View>
                                <View style={{ justifyContent: 'center' }}><Text style={gStyles.title}>{endPages + 1}</Text></View>

                                <TouchableOpacity onPress={go} disabled={!arrowRightEnabled}>
                                    <MaterialIcons
                                        name="keyboard-arrow-right"
                                        color="#000000"
                                        size={64}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )
            }

        </View>
    );
}
