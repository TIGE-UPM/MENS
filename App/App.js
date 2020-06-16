import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/HomeScreen';
import CameraScreen from './src/CameraScreen';
import PhotoScreen from './src/PhotoScreen';
import MapScreen from './src/MapScreen';
import SurveyScreen from './src/SurveyScreen';
import NoSurveyFinishedScreen from './src/NoSurveyFinishedScreen';
import SurveyQuestionsScreen from './src/SurveyQuestionsScreen';
import SurveyFinishedScreen from './src/SurveyFinishedScreen';

//Crea el mapa de navegacion de la app
const RootStack = createStackNavigator(
    {
        Home: HomeScreen,
        Camera: CameraScreen,
        Photo: PhotoScreen,
        Map: MapScreen,
        Survey: SurveyScreen,
        SurveyQuestions: SurveyQuestionsScreen,
        SurveyFinished: SurveyFinishedScreen,
        NoSurveyFinished: NoSurveyFinishedScreen,
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
        //Desactiva el gesto en iOS para volver a la pag anterior, en Android viene ya desactivado
        /*defaultNavigationOptions: {
            gestureEnabled: false
        }*/
    }
);

//Crea la estructura de la app con el mapa de navegacion creado
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}