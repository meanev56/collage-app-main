import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CollageScreen from "../screens/CollageScreen";
import HomeScreen from "../screens/HomeScreen";
import TemplatePreviewScreen from "../screens/TemplatePreviewScreen";
import { Ionicons } from "@expo/vector-icons";
import {View,StyleSheet} from "react-native"
import CreateScreen from "../screens/CreateScreen";
import EditsScreen from "../screens/EditsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Collage"
      component={CollageScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="TemplatePreview"
      component={TemplatePreviewScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const TabBarIcon = ({
  name,
  focused,
  isPlus,
}: {
  name: string;
  focused: boolean;
  isPlus?: boolean;
}) => (
  <View style={[styles.iconContainer, isPlus && styles.plusIconContainer]}>
    <Ionicons
      name={name}
      size={isPlus ? 30 : 24}
      color={isPlus ? "#FFF" : focused ? "#FF5A5F" : "#8E8E93"}
    />
  </View>
);



export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{
        tabBarStyle:styles.tabBar,
        tabBarShowLabel:true,
        tabBarLabelStyle:styles.tabBarLabel
    }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home-outline" focused={focused} />
          ),
          tabBarLabel: "Home",
          headerShown: false,
        }}
      />
       <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="add" focused={focused} isPlus/>
          ),
          tabBarLabel: "",
        }}
      />
       <Tab.Screen
        name="My Works"
        component={EditsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="folder-outline" focused={focused} />
          ),
          tabBarLabel: "Home",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
    tabBar:{
        height:70,
        backgroundColor:"#FFF",
        borderTopWidth:0,
        elevation:8,
        shadowOpacity:0.1,
        shadowRadius:4,
        shadowOffset:{width:0,height:-2},
        paddingBottom:5
    },
    iconContainer:{
        alignItems:"center",
        justifyContent:"center"
    },
    plusIconContainer:{
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:"#FF5A5F",
        justifyContent:"center",
        alignItems:"center",
        marginTop:-20
    },
    tabBarLabel:{
        fontSize:12,
        marginBottom:5,
        color:"#8E8E93"
    }
})