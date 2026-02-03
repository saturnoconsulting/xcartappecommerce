import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../views/Dashboard';
import Cart from '../views/Cart';
import Posts from '../views/Posts';
import User from '../views/User';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor, primaryColor } from '../constants/colors';
import { CardStyleInterpolators } from '@react-navigation/stack';
import PostsDetails from '../views/PostsDetails';
import ProductDetails from '../views/ProductDetails';
// Import condizionali tramite widgetLoader per escludere screen non utilizzate dal bundle
import { getWidgetScreen, isWidgetActive } from '../utils/widgetLoader';

const Stack = createStackNavigator();

export default function HomeStack() {
  // Carica le screen widget solo se attive (lazy loading)
  const MatchesVOD = getWidgetScreen('MatchesVOD');
  const VideoMatchLive = getWidgetScreen('VideoMatchLive');

  return (
    <Stack.Navigator screenOptions={{
      animationEnabled: true,
      animation: 'slide_from_right',
      presentation: 'card',
      detachPreviousScreen: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
     <Stack.Screen name="Posts" component={Posts} options={{ headerShown: false }} />
      <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
       <Stack.Screen name="PostsDetails" component={PostsDetails} options={{ headerShown: true, title: "", headerStyle: { backgroundColor: backgroundcolor }, headerLeft: () => <CustomBackButton targetScreen="Shop" /> }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({
          headerShown: true,
          title: "Dettaglio",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
        })}/>
      {MatchesVOD && (
        <Stack.Screen name="MatchesVOD" component={MatchesVOD} options={{ 
          headerShown: true, 
          title: "Eventi", 
          headerStyle: { backgroundColor: backgroundcolor }, 
          headerLeft: () => <CustomBackButton targetScreen="Dashboard" /> 
        }} />
      )}
      {VideoMatchLive && (
        <Stack.Screen name="VideoMatchLive" component={VideoMatchLive} options={{ 
          headerShown: true, 
          title: "Ora in Diretta", 
          headerStyle: { backgroundColor: backgroundcolor }, 
          headerLeft: () => <CustomBackButton targetScreen="Dashboard" /> 
        }} />
      )}
        </Stack.Navigator>
  );
}
