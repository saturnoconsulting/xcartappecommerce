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
     <Stack.Screen name="Posts" component={Posts} options={{ headerShown: false }} />
      <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
       <Stack.Screen name="PostsDetails" component={PostsDetails} options={{ headerShown: true, title: "", headerStyle: { backgroundColor: backgroundcolor }, headerLeft: () => <CustomBackButton targetScreen="Shop" /> }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({
          headerShown: true,
          title: "Dettaglio",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
        })}/>
        </Stack.Navigator>
  );
}
