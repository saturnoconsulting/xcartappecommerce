import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import CustomText from '../components/atoms/CustomText';
import { backgroundcolor, primaryColor } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import useFetchAutomation from '../hooks/useFetchAutomation';
import { useNavigation } from '@react-navigation/native';

const Automation = () => {
    const { automation, loading: automationLoading, refetch } = useFetchAutomation({});
    const navigation = useNavigation();

    const handleRoomPress = (roomName, devices) => {
        navigation.navigate('RoomDevices', {
            roomName,
            devices: devices || [],
            sourceScreen: 'Automation'
        });
    };

    if (!automationLoading && (!automation || Object.keys(automation).length === 0)) {
        return (
            <View style={styles.container}>
                <CustomText style={styles.subtitle}>
                    Non ci sono dispositivi domotici configurati
                </CustomText>
            </View>
        );
    }

    const renderRoom = (roomName, devices) => {
        const deviceCount = devices ? devices.length : 0;

        return (
            <View key={roomName} style={styles.roomContainer}>
                <TouchableOpacity
                    style={styles.roomBox}
                    onPress={() => handleRoomPress(roomName, devices)}
                    activeOpacity={0.7}
                >
                    <View style={styles.roomHeader}>
                        <View style={styles.roomHeaderLeft}>
                            <Icon
                                name="home"
                                size={24}
                                color={primaryColor}
                                style={styles.roomIcon}
                            />
                            <View>
                                <CustomText style={styles.roomName}>{roomName}</CustomText>
                                <CustomText style={styles.roomDeviceCount}>
                                    {deviceCount} {deviceCount === 1 ? 'dispositivo' : 'dispositivi'}
                                </CustomText>
                            </View>
                        </View>
                        <Icon
                            name="chevron-forward"
                            size={24}
                            color="#666"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={automationLoading} onRefresh={refetch} />
                }
            >
                {/*<CustomText style={styles.title}>Domotica</CustomText>*/}

                {automationLoading && (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 20 }} />
                )}

                {!automationLoading && automation  && (
                    <View style={styles.roomsList}>
                        {Object.entries(automation).map(([roomName, devices]) =>
                            renderRoom(roomName, devices)
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        flex: 1,
        backgroundColor: backgroundcolor,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        marginTop: 20,
    },
    toggleBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    toggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toggleLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    sensorBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sensorLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    sensorValueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sensorValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: primaryColor,
    },
    sensorUnit: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666',
        marginTop: 8,
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 15,
    },
    roomsList: {
        marginTop: 10,
    },
    roomContainer: {
        marginBottom: 15,
    },
    roomBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    roomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    roomHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    roomIcon: {
        marginRight: 15,
    },
    roomName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    roomDeviceCount: {
        fontSize: 14,
        color: '#666',
    },
});

export default Automation;
