import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../views/Dashboard';
import Cart from '../views/Cart';
import Posts from '../views/Posts';
import VideoMatchLive from '../views/VideoMatchLive';
import User from '../views/User';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor, primaryColor } from '../constants/colors';
import MatchesVOD from '../views/MatchesVOD';
import VideoMatchVOD from '../views/VideoMatchVOD';
import { CardStyleInterpolators } from '@react-navigation/stack';
import PostsDetails from '../views/PostsDetails';
import WebViewPage from '../views/WebViewPage';
import ProductDetails from '../views/ProductDetails';

const Stack = createStackNavigator();

export default function HomeStack() {
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
      <Stack.Screen name="VideoMatchLive" component={VideoMatchLive} options={{ headerShown: true, title: "In diretta", headerTintColor: "white", headerStyle: { backgroundColor: "black" }, headerLeft: () => <CustomBackButton color="white" targetScreen="Dashboard" /> }} />
      <Stack.Screen name="MatchesVOD" component={MatchesVOD} options={{ headerShown: true, title: "Partite", headerTintColor: "black", headerStyle: { backgroundColor: backgroundcolor }, headerLeft: () => <CustomBackButton targetScreen="Dashboard" /> }} />
      <Stack.Screen name="VideoMatchVOD" component={VideoMatchVOD} options={{ headerShown: true, title: "Partita", headerTintColor: "white", headerStyle: { backgroundColor: "black" }, headerLeft: () => <CustomBackButton color="white" targetScreen="Dashboard" /> }} />
      <Stack.Screen name="Posts" component={Posts} options={{ headerShown: false }} />
      <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
       <Stack.Screen name="PostsDetails" component={PostsDetails} options={{ headerShown: true, title: "", headerStyle: { backgroundColor: backgroundcolor }, headerLeft: () => <CustomBackButton targetScreen="Shop" /> }} />
      <Stack.Screen name="WebViewPage" component={WebViewPage} options={{ headerShown: false}} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({
          headerShown: true,
          title: "Dettaglio",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
        })}/>
        </Stack.Navigator>
  );
}
