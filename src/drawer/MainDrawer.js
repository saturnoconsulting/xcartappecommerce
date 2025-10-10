import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { logout } from "../api/user";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { GET_USER } from "../store/selectors/userSelector";
import { primaryColor } from "../constants/colors";
import Tabs from "./Tabs";
import VideoMatchLive from "../views/VideoMatchLive";
import CustomBackButton from "../components/atoms/CustomBackHome";
import { GET_CART_LENGHT } from "../store/selectors/cartSelector";
import useNotifications from '../hooks/useNotifications';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, setLoading }) => {
    const user = useSelector(GET_USER);
    const [showPlayersSubmenu, setShowPlayersSubmenu] = useState(false);
    const [showRankingSubmenu, setShowRankingSubmenu] = useState(false);

    const toggleSubmenu = () => {
        setShowPlayersSubmenu((prev) => !prev);
    };

    return (
        <View style={styles.drawerContainer}>
            <View style={styles.profileSection}>
                <Text style={styles.profileName}>{user.name} {user.surname}</Text>
            </View>
            <View style={styles.menuSection}>
                 {/* News */}
                <TouchableOpacity style={styles.menuItem} onPress={() =>
                    navigation.navigate("Tabs", { screen: "Home", params: { screen: "Posts", params: { idCat: "1", nameCat: "News" } } })
                }>
                    <Icon name="newspaper-outline" size={22} color="white" />
                    <Text style={styles.menuText}>News</Text>
                </TouchableOpacity>

                  {/* La storia */}
                <TouchableOpacity style={styles.menuItem} onPress={() =>
                    navigation.navigate("Tabs", { screen: "Home", params: { screen: "WebViewPage", params: { slug: "storia" } } })
                }>
                    <Icon name="document-text-outline" size={22} color="white" />
                    <Text style={styles.menuText}>La Storia</Text>
                </TouchableOpacity>

                {/* Squadra con Sottomenu */}
                <TouchableOpacity style={styles.menuItem} onPress={toggleSubmenu}>
                    <Icon name="people-circle-outline" size={22} color="white" />
                    <Text style={styles.menuText}>La Squadra</Text>
                    <Icon
                        name={showPlayersSubmenu ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="white"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
                {showPlayersSubmenu && (
                    <View style={styles.subMenuContainer}>
                        <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "Posts",
                                    params: { idCat: "2", nameCat: "Serie A", type: "player" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Serie A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "Posts",
                                    params: { idCat: "3", nameCat: "Cadetta", type: "player" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Cadetta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.subMenuItem} onPress={() =>
                            navigation.navigate("Tabs", { screen: "Home", params: { screen: "Posts", params: { idCat: "6", nameCat: "Tutoraggio", type: "player" } } })
                        }>
                            <Text style={styles.subMenuText}>Tutoraggio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            options={{ headerShown: false, headerTintColor: "white", headerStyle: { backgroundColor: "black" }, headerLeft: () => <CustomBackButton color="white" targetScreen="Dashboard" /> }}
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "Posts",
                                    params: { idCat: "4", nameCat: "Staff", type: "staff" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Staff</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Classifiche con sottomenu */}
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowRankingSubmenu(prev => !prev)}>
                    <Icon name="trophy-outline" size={22} color="white" />
                    <Text style={styles.menuText}>Campionati</Text>
                    <Icon
                        name={showRankingSubmenu ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="white"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
                {showRankingSubmenu && (
                    <View style={styles.subMenuContainer}>
                         <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "WebViewPage",
                                    params: { slug: "risultati-serie-a" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Risultati Serie A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "WebViewPage",
                                    params: { slug: "classifica" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Classifica Serie A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "WebViewPage",
                                    params: { slug: "risultati-serie-c" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Risultati Serie C</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.subMenuItem}
                            onPress={() => navigation.navigate("Tabs", {
                                screen: "Home", params: {
                                    screen: "WebViewPage",
                                    params: { slug: "classifica-cadetta" }
                                }
                            })}
                        >
                            <Text style={styles.subMenuText}>Classifica Serie C</Text>
                        </TouchableOpacity>
                       
                    </View>
                )}

                {/* Lo stadio */}
                <TouchableOpacity style={styles.menuItem} onPress={() =>
                    navigation.navigate("Tabs", { screen: "Home", params: { screen: "WebViewPage", params: { slug: "stadio" } } })
                }>
                    <Icon name="football-outline" size={22} color="white" />
                    <Text style={styles.menuText}>Lo Stadio</Text>
                </TouchableOpacity>

                {/* Calendario */}
                {/*<TouchableOpacity style={styles.menuItem} onPress={() =>
                    navigation.navigate("Tabs", { screen: "Home", params: { screen: "WebViewPage", params: { slug: "calendario" } } })
                }>
                    <Icon name="document-text-outline" size={22} color="white" />
                    <Text style={styles.menuText}>Calendario</Text>
                </TouchableOpacity>*/}
               
                {/* Sponsor */}
                <TouchableOpacity style={styles.menuItem} onPress={() =>
                    navigation.navigate("Tabs", { screen: "Home", params: { screen: "Posts", params: { idCat: "5", nameCat: "Sponsor" } } })
                }>
                    <Icon name="business-outline" size={22} color="white" />
                    <Text style={styles.menuText}>Sponsor</Text>
                </TouchableOpacity>
             
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={async () => {
                        try {
                            setLoading(true);
                            await logout();
                            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                        } catch (err) {
                            console.error("Errore durante il logout:", err);
                            setLoading(false);
                        }
                    }}
                >
                    <Icon name="log-out-outline" size={22} color="white" />
                    <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const MainDrawer = () => {
    const [loading, setLoading] = useState(false);
    const cart_lenght = useSelector(GET_CART_LENGHT);
    useNotifications(); 

    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} setLoading={setLoading} />}
                screenOptions={({ navigation }) => ({
                    gestureEnabled: false,
                    swipeEnabled: false,
                    header: () => (
                        <View style={styles.customHeader}>
                            <View style={styles.headerSide}>
                                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                    <Icon name="menu" size={28} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerCenter}>
                                <TouchableOpacity onPress={() => navigation.navigate("Tabs", { screen: "Home", params: { screen: "Dashboard" } })}>
                                    <Image source={require('../assets/img/logo-nuovo-header.png')} style={styles.centeredLogo} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerSide}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Tabs", { screen: "Home", params: { screen: "Cart" } })}
                                    style={{ position: 'relative' }}
                                >
                                    <Icon name="bag-outline" size={28} color="white" />
                                    {cart_lenght > 0 && (
                                        <View style={styles.cartBadge}></View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
                    drawerStyle: { backgroundColor: "black", width: 250 },
                    drawerLabelStyle: { color: "white" },
                    drawerActiveTintColor: primaryColor,
                    drawerInactiveTintColor: "white",
                })}
            >
                <Drawer.Screen name="Tabs" component={Tabs} />
                <Drawer.Screen name="VideoMatchLive" component={VideoMatchLive} />
            </Drawer.Navigator>

            {loading && <Loading />}
        </>
    );
};

export default MainDrawer;

const styles = StyleSheet.create({
    cartBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 12,
        height: 12,
        borderRadius: 25,
        backgroundColor: primaryColor
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: primaryColor,
    },
    profileSection: {
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
    },
    profileName: {
        marginTop: Dimensions.get("window").height < 900 ? 40 : 20,
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    menuSection: {
        flex: 1,
        paddingTop: 10,
    },
    logoutSection: {
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: "#444",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuText: {
        color: "white",
        fontSize: 16,
        marginLeft: 15,
    },
    customHeader: {
        height: 120,
        backgroundColor: "black",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? '50' : '10',
    },
    headerSide: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    centeredLogo: {
        width: 100,
        height: 45,
        resizeMode: 'contain',
    },
    subMenuContainer: {
        paddingLeft: 70,
        backgroundColor: primaryColor,
    },

    subMenuItem: {
        paddingVertical: 10,
    },

    subMenuText: {
        color: 'white',
        fontSize: 16,
    },
});
