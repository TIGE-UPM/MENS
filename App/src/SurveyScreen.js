import * as React from 'react';
import { View, Text } from 'react-native';
import {Button} from 'react-native-elements';
import i18n from './languages/i18n';


export default class SurveyScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pB64: this.props.navigation.state.params.photoBs64,
            urlEncuest: this.props.navigation.state.params.urlEncues,
            coordenadas: this.props.navigation.state.params.markerCoord,
        }
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#50D4F2' }}>
                {/*Texto con la pregunta*/}
                <Text style={{color: 'black', fontSize: 23, marginBottom: 35}}>{i18n.t('SURVEY_title')}</Text>
                <View style={{flex: 0, flexDirection:"row",justifyContent:"space-between", margin:30}}>
                    {/*Boton para realizar encuesta e ir a la pantalla de la encuesta, le pasa los parametros:
                    foto en base64, url Encuesta y coordenadas localizacion*/}
                    <Button
                        title={i18n.t('SURVEY_yes')}
                        type="outline"
                        raised
                        buttonStyle={{ backgroundColor: '#F28E13', paddingLeft: 30, paddingRight:30, borderRadius:10}}
                        containerStyle={{marginRight: 40}}
                        titleStyle={{ color: 'white', fontSize: 20 }}
                        onPress={() => this.props.navigation.navigate('SurveyQuestions',
                            {pBas64: this.state.pB64, coord: this.state.coordenadas, urlEncuesta: this.state.urlEncuest})}
                    />
                    {/*Boton para NO realizar encuesta e ir a la pantalla NoSurvey, le pasa como
                     parametros: foto en base64 y coordenadas localizacion */}
                    <Button
                        title={i18n.t('SURVEY_no')}
                        type="outline"
                        raised
                        buttonStyle={{ backgroundColor: 'crimson', paddingLeft: 30, paddingRight:30, borderRadius:10}}
                        containerStyle={{marginLeft: 40}}
                        titleStyle={{ color: 'white', fontSize: 20 }}
                        onPress={() => this.props.navigation.navigate('NoSurveyFinished',
                            {pBas64: this.state.pB64, coord: this.state.coordenadas})}
                    />
                </View>
            </View>
        );
    }
}