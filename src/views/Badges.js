import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import CustomText from '../components/atoms/CustomText';
import { backgroundcolor, primaryColor } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import useFetchBadges from '../hooks/useFetchBadges';
import AppIcon from '../components/atoms/AppIcon';
import QRCodeModal from '../components/QRCodeModal';

const Badges = () => {
    const { badges, loading: badgesLoading, refetch } = useFetchBadges({});

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return dateString;
        }
    };

    const isRevoked = (revokedAt) => {
        if (!revokedAt) return false;
        const revoked = new Date(revokedAt);
        const now = new Date();
        return revoked <= now;
    };

    const getStatusColor = (revokedAt) => {
        return isRevoked(revokedAt) ? '#dc3545' : '#28a745';
    };

    const getStatusText = (revokedAt) => {
        return isRevoked(revokedAt) ? 'Revocato' : 'Attivo';
    };

    const openQRCode = (badge) => {
        setSelectedBadge(badge);
        setIsModalVisible(true);
    };

    const closeQRCode = () => {
        setIsModalVisible(false);
        setSelectedBadge(null);
    };


    const renderBadge = (badge) => {
        const statusColor = getStatusColor(badge.revoked_at);
        const statusText = getStatusText(badge.revoked_at);
        const badgeType = badge.type?.toUpperCase() || 'N/A';
        const badgeIcon = badge.type === 'nfc' ? 'radio' : 'qr-code';

        return (
            <View key={badge.idbadge} style={styles.badgeContainer}>
                <View style={styles.badgeBox}>
                    <View style={styles.badgeHeader}>
                        <View style={styles.badgeHeaderLeft}>
                            <Icon
                                name={badgeIcon}
                                size={24}
                                color={primaryColor}
                                style={styles.badgeIcon}
                            />
                            <View style={styles.badgeInfo}>
                                <View style={styles.badgeTypeRow}>
                                    <CustomText style={styles.badgeType}>{badgeType}</CustomText>
                                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                        <CustomText style={styles.statusText}>{statusText}</CustomText>
                                    </View>
                                </View>
                                {/*<CustomText style={styles.badgeUid}>UID: {badge.uid || 'N/A'}</CustomText>*/}
                                {badge.notes && (
                                    <CustomText style={styles.badgeNotes}>{badge.notes}</CustomText>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.badgeDetails}>
                        <View style={styles.detailRow}>
                            <Icon name="calendar-outline" size={16} color="#666" />
                            <CustomText style={styles.detailLabel}>Emesso: </CustomText>
                            <CustomText style={styles.detailValue}>
                                {formatDate(badge.issued_at)}
                            </CustomText>
                        </View>
                        {badge.revoked_at && (
                            <View style={styles.detailRow}>
                                <Icon name="close-circle-outline" size={16} color="#666" />
                                <CustomText style={styles.detailLabel}>Revocato: </CustomText>
                                <CustomText style={styles.detailValue}>
                                    {formatDate(badge.revoked_at)}
                                </CustomText>
                            </View>
                        )}
                    </View>
                    {badge.qr_code && (
                        <>
                            <TouchableOpacity style={styles.qrcodeContainer} onPress={() => openQRCode(badge)}>
                                <AppIcon name="qrcode" size={40} color="black" />
                            </TouchableOpacity>
                            <QRCodeModal visible={isModalVisible} onClose={closeQRCode} subscription={selectedBadge} />
                            {/*<View style={styles.qrCodeContainer}>
                            <CustomText style={styles.qrCodeLabel}>Codice QR:</CustomText>
                            <Image
                                source={{ uri: badge.qr_code }}
                                style={styles.qrCodeImage}
                                resizeMode="contain"
                            />
                        </View>*/}
                        </>
                    )}
                </View>
            </View>
        );
    };

    if (!badgesLoading && (!badges || badges.length === 0)) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.emptyContent}
                    refreshControl={
                        <RefreshControl refreshing={badgesLoading} onRefresh={refetch} />
                    }
                >
                    <Icon name="card-outline" size={64} color="#ccc" />
                    <CustomText style={styles.emptyText}>
                        Non hai badge associati
                    </CustomText>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={badgesLoading} onRefresh={refetch} />
                }
            >
                {/*<CustomText style={styles.title}>Badge</CustomText>}*/}

                {badgesLoading && (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 20 }} />
                )}

                {!badgesLoading && badges && badges.length > 0 && (
                    <View style={styles.badgesList}>
                        {badges.map((badge) => renderBadge(badge))}
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
    },
    emptyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 15,
    },
    badgesList: {
        marginTop: 10,
    },
    badgeContainer: {
        marginBottom: 15,
    },
    badgeBox: {
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
    badgeHeader: {
        marginBottom: 15,
    },
    badgeHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    badgeIcon: {
        marginRight: 15,
        marginTop: 2,
    },
    badgeInfo: {
        flex: 1,
    },
    badgeTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    badgeType: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    badgeUid: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    badgeNotes: {
        fontSize: 14,
        color: '#333',
        fontStyle: 'italic',
        marginTop: 0,
    },
    badgeDetails: {
        marginTop: 1,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    qrCodeContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    qrCodeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    qrCodeImage: {
        width: 200,
        height: 200,
    },
});

export default Badges;
