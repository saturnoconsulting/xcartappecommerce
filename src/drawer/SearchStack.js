import { createStackNavigator } from '@react-navigation/stack';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';
import ProductDetails from '../views/ProductDetails';
import Search from '../views/Search';

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{
      animationEnabled: true,
      animation: 'slide_from_right',
      detachPreviousScreen: false,
    }}>

      <Stack.Screen name="Search" component={Search} options={() => ({
        headerShown: true,
        title: "Cerca",
        headerStyle: { backgroundColor: backgroundcolor },
        
      })} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({
        headerShown: true,
        title: "Dettaglio",
        headerStyle: { backgroundColor: backgroundcolor },
        headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
      })} />
    </Stack.Navigator>
  );
}
