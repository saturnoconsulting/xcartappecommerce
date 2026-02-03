import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Switch,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import CustomText from '../components/atoms/CustomText';
import { backgroundcolor, primaryColor } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { updateDevice } from '../api/automation';
import { showMessage } from 'react-native-flash-message';

const RoomDevices = () => {
    const route = useRoute();
    const { roomName, devices: initialDevices } = route.params || {};
    const [updatingRelays, setUpdatingRelays] = useState({});
    const [devices, setDevices] = useState(initialDevices || []);

    const updateDeviceValue = async (item, newValue) => {
        const deviceId = item.id;
        const idreader = item.idreader || item.id;
        const deviceType = item.type;

        // Aggiorna lo stato locale immediatamente per feedback visivo
        setUpdatingRelays(prev => ({ ...prev, [deviceId]: true }));

        try {
            await updateDevice(deviceType, idreader, newValue);
            
            // Aggiorna i dispositivi locali dopo il successo
            setDevices(prevDevices => 
                prevDevices.map(device => 
                    device.id === deviceId 
                        ? { ...device, value: newValue }
                        : device
                )
            );
            
            showMessage({
                message: 'Successo',
                description: `${item.name} aggiornato con successo`,
                type: 'success',
            });
        } catch (error) {
            showMessage({
                message: 'Errore',
                description: 'Non siamo riusciti ad aggiornare lo stato del dispositivo',
                type: 'danger',
            });
        } finally {
            setUpdatingRelays(prev => {
                const newState = { ...prev };
                delete newState[deviceId];
                return newState;
            });
        }
    };

    const toggleSwitch = async (item) => {
        const newValue = !item.value;
        await updateDeviceValue(item, newValue);
    };

    const adjustSensorValue = async (item, increment) => {
        const currentValue = parseFloat(item.value) || 0;
        const step = item.type === 'temperature' ? 0.5 : 1; // 0.5 per temperatura, 1 per umidità
        const newValue = increment ? currentValue + step : currentValue - step;
        
        // Limiti ragionevoli
        const minValue = item.type === 'temperature' ? -10 : 0;
        const maxValue = item.type === 'temperature' ? 50 : 100;
        const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
        
        await updateDeviceValue(item, clampedValue);
    };

    //TODO: Aggiungere icone e colori se aumentano i tipi di dispositivi 
    const getIconName = (type) => {
        switch (type) {
            case 'temperature':
                return 'thermometer';
            case 'humidity':
                return 'water';
            case 'relay':
                return 'flash';
            default:
                return 'hardware-chip';
        }
    };

    const getIconColor = (type, value) => {
        switch (type) {
            case 'temperature':
                return '#FF6B6B';
            case 'humidity':
                return '#4ECDC4';
            case 'relay':
                return value ? primaryColor : '#999';
            default:
                return primaryColor;
        }
    };

    const renderDevice = (device, index) => {
        // Normalizza i dati del dispositivo
        const normalizedDevice = {
            id: device.id || device.idreader || index,
            type: device.type,
            value: device.value,
            name: device.name || `${device.type} ${device.idreader || ''}`,
            unit: device.unit || (device.type === 'temperature' ? '°C' : device.type === 'humidity' ? '%' : ''),
            ...device
        };

        if (normalizedDevice.type === 'relay') {
            const isUpdating = updatingRelays[normalizedDevice.id];
            const iconColor = getIconColor(normalizedDevice.type, normalizedDevice.value);
            return (
                <View key={normalizedDevice.id} style={styles.deviceItem}>
                    <View style={[
                        styles.toggleBox,
                        normalizedDevice.value && styles.toggleBoxActive
                    ]}>
                        <View style={styles.toggleContent}>
                            <View style={[
                                styles.iconContainer,
                                { backgroundColor: `${iconColor}15` }
                            ]}>
                                {isUpdating ? (
                                    <ActivityIndicator size="small" color={iconColor} />
                                ) : (
                                    <Icon
                                        name={getIconName(normalizedDevice.type)}
                                        size={28}
                                        color={iconColor}
                                    />
                                )}
                            </View>
                            <View style={styles.deviceInfo}>
                                <CustomText style={styles.toggleLabel}>
                                    {normalizedDevice.name}
                                </CustomText>
                                <CustomText style={styles.deviceStatus}>
                                    {normalizedDevice.value ? 'Acceso' : 'Spento'}
                                </CustomText>
                            </View>
                        </View>
                        <Switch
                            value={normalizedDevice.value}
                            onValueChange={() => toggleSwitch(normalizedDevice)}
                            trackColor={{ false: '#E0E0E0', true: primaryColor }}
                            thumbColor="#fff"
                            disabled={isUpdating}
                            ios_backgroundColor="#E0E0E0"
                        />
                    </View>
                </View>
            );
        } else {
            // Temperature o Humidity
            const iconColor = getIconColor(normalizedDevice.type);
            const isUpdating = updatingRelays[normalizedDevice.id];
            return (
                <View key={normalizedDevice.id} style={styles.deviceItem}>
                    <View style={styles.sensorBox}>
                        <View style={styles.sensorHeader}>
                            <View style={[
                                styles.iconContainer,
                                styles.sensorIconContainer,
                                { backgroundColor: `${iconColor}15` }
                            ]}>
                                {isUpdating ? (
                                    <ActivityIndicator size="small" color={iconColor} />
                                ) : (
                                    <Icon
                                        name={getIconName(normalizedDevice.type)}
                                        size={28}
                                        color={iconColor}
                                    />
                                )}
                            </View>
                            <View style={styles.sensorInfo}>
                                <CustomText style={styles.sensorLabel}>{normalizedDevice.name}</CustomText>
                                <CustomText style={styles.sensorType}>
                                    {normalizedDevice.type === 'temperature' ? 'Temperatura' : 'Umidità'}
                                </CustomText>
                            </View>
                        </View>
                        <View style={styles.sensorValueContainer}>
                            <TouchableOpacity
                                style={styles.sensorButton}
                                onPress={() => adjustSensorValue(normalizedDevice, false)}
                                disabled={isUpdating}
                                activeOpacity={0.7}
                            >
                                <Icon name="remove" size={28} color={iconColor} />
                            </TouchableOpacity>
                            <View style={styles.sensorValueWrapper}>
                                <CustomText style={[styles.sensorValue, { color: iconColor }]}>
                                    {normalizedDevice.value} {normalizedDevice.unit}
                                </CustomText>
                            </View>
                            <TouchableOpacity
                                style={styles.sensorButton}
                                onPress={() => adjustSensorValue(normalizedDevice, true)}
                                disabled={isUpdating}
                                activeOpacity={0.7}
                            >
                                <Icon name="add" size={28} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.roomHeader}>
                    <View style={styles.roomHeaderIconContainer}>
                        <Icon
                            name="home"
                            size={36}
                            color="#fff"
                        />
                    </View>
                    <CustomText style={styles.roomTitle}>{roomName || 'Stanza'}</CustomText>
                    <View style={styles.roomDeviceBadge}>
                        <Icon name="hardware-chip" size={16} color={primaryColor} />
                        <CustomText style={styles.roomSubtitle}>
                            {devices.length} {devices.length === 1 ? 'dispositivo' : 'dispositivi'}
                        </CustomText>
                    </View>
                </View>

                {devices.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="hardware-chip-outline" size={48} color="#ccc" />
                        <CustomText style={styles.emptyText}>
                            Nessun dispositivo trovato in questa stanza
                        </CustomText>
                    </View>
                ) : (
                    <View style={styles.devicesList}>
                        {devices.map((device, index) => renderDevice(device, index))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundcolor,
    },
    content: {
        padding: 20,
        paddingTop: 10,
    },
    roomHeader: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 25,
    },
    roomHeaderIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: primaryColor,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 8,
    },
    roomTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    roomDeviceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${primaryColor}15`,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    roomSubtitle: {
        fontSize: 15,
        color: primaryColor,
        marginLeft: 6,
        fontWeight: '600',
    },
    devicesList: {
        marginTop: 10,
    },
    deviceItem: {
        marginBottom: 16,
    },
    toggleBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    toggleBoxActive: {
        borderColor: `${primaryColor}30`,
        backgroundColor: `${primaryColor}05`,
    },
    toggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    sensorIconContainer: {
        marginRight: 12,
    },
    deviceInfo: {
        flex: 1,
    },
    toggleLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    deviceStatus: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    sensorBox: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sensorInfo: {
        flex: 1,
    },
    sensorLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    sensorType: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    sensorValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    sensorButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 12,
        borderWidth: 2,
        borderColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    sensorValueWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    sensorValue: {
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    sensorUnit: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginTop: 10,
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
});

export default RoomDevices;
