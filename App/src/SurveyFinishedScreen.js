import * as React from 'react';
import { View, Text, Alert, AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import i18n from './languages/i18n';


export default class SurveyFinishedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null
        this.state = {
            photoData: this.props.navigation.state.params.photo64,
            coordenadasData: this.props.navigation.state.params.coordLL,
            respuestasEncuesta: this.props.navigation.state.params.surveyAnswers,
            savedData: false,
            date: '',
            isConnected: '',
        };
    }

    async componentDidMount() {
        //Permite obtener el año, mes, dia, hora, minutos y segundos del dispositivo movil
        var date = new Date().getDate(); //Dia
        var month = new Date().getMonth() + 1; //Mes
        var year = new Date().getFullYear(); //Año
        var hours = new Date().getHours(); //Hora
        var min = new Date().getMinutes(); //Minutos
        var sec = new Date().getSeconds(); //Segundos
        this.setState({
            //Setting the value of the date time
            date:  date + '/' + month + '/' + year + '_' + hours + ':' + min + ':' + sec,
        });
        //Permite saber si hay conexion, si esta offline u online, devuelve un booleano
        this.unsubscribe = NetInfo.addEventListener(state => {
            this.setState({isConnected: state.isConnected});
        });
    }
    //Para desactivar el listener al pasar de pantalla y no gastar tanta memoria
    componentWillUnmount() {
        this.unsubscribe();
    }

    //Guarda los datos en el AsyncStorage
    saveInLocal = async () => {
        try {
            await AsyncStorage.setItem(this.state.date, JSON.stringify({
                fotoEnBase64: this.state.photoData,
                coordenadasGeolocalizacion: this.state.coordenadasData,
                repuestasEncuesta: this.state.respuestasEncuesta,
            }))
            //Si se guardan correctamente salta el alert confirmandolo
            Alert.alert(
                //title
                i18n.t('SURVEYFINISHED_alertOkTitle'),
                //body
                i18n.t('SURVEYFINISHED_alertOkMessageLocal'),
                [
                    { text: i18n.t('SURVEYFINISHED_alertOkButton')},
                ],
            );
            this.setState({savedData: true});
        } catch (e) {
            //Si hay un error salta un alert
            this.setState({savedData: false});
            Alert.alert(
                //title
                i18n.t('SURVEYFINISHED_alertErrorTitle'),
                //body
                i18n.t('SURVEYFINISHED_alertErrorMessage'),
                [
                    { text: i18n.t('SURVEYFINISHED_alertOkButton')},
                ],
            );
        }
    }

    //Envia todos los datos a la bbdd
    handleDataToBBDD=()=>{
        //Si ya se han enviado los datos a la bbdd la funcionalidad cambia y permite volver a la pantalla de inicio
        if(this.state.savedData){
            this.props.navigation.popToTop();
        } else {
            //Si NO se han guardado los datos todavia se hace un fetch POST con los datos al servidor
            this.setState({savedData: false});
            fetch('http://192.xxx.y.zz:3210/data', { //IP del ordenador y el puerto que se ha indicado en el servidor
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fotoEnBase64: this.state.photoData,
                    coordenadasGeolocalizacion: this.state.coordenadasData,
                    repuestasEncuesta: this.state.respuestasEncuesta,
                }),
            }).then((response) => {
                //Respuesta de la bbdd
                console.log('response:',response.status);
                //Si todo es correcto sale un mensaje indicandolo (se han guardado los datos)
                if (response.status == 200){
                    this.setState({savedData: true})
                    Alert.alert(
                        //title
                        i18n.t('SURVEYFINISHED_alertOkTitle'),
                        //body
                        i18n.t('SURVEYFINISHED_alertOkMessage'),
                        [
                            { text: i18n.t('SURVEYFINISHED_alertOkButton')},
                        ],
                    );
                }
            })
            .catch((error) => { //Si no se pueden guardar los datos en la bbdd hay dos casos
                //Si el dispositivo tiene conexion y no se han guardado da un error y sale por pantalla
                if(this.state.isConnected){
                    console.log(error);
                    this.setState({savedData: false})
                    Alert.alert(
                        //title
                        i18n.t('SURVEYFINISHED_alertErrorTitle'),
                        //body
                        i18n.t('SURVEYFINISHED_alertErrorMessage'),
                        [
                            { text: i18n.t('SURVEYFINISHED_alertOkButton')},
                        ],
                    );
                } else {
                    //Si el dispositivo NO tiene conexion los datos no se guardan en la bbdd, se guardan en el dispositivo
                    this.saveInLocal();
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#50D4F2' }}>
                <Text style={{color: 'black', fontSize: 23, marginBottom: 35}}>{i18n.t('SURVEYFINISHED_title')}</Text>
                <View style={{flex: 0, flexDirection:"row",justifyContent:"space-between", margin:30}}>
                    {/*Boton para guardar los datos en la bbdd, un vez guardados su funcionalidad cambia
                    y permite volver a la pantalla de inicio*/}
                    <Button
                        title= {this.state.savedData ? i18n.t('SURVEYFINISHED_homeButton') : i18n.t('SURVEYFINISHED_saveButton')}
                        type="outline"
                        raised
                        buttonStyle={{ backgroundColor: '#F28E13', paddingLeft: 30, paddingRight:30, borderRadius:20}}
                        titleStyle={{ color: 'white', fontSize: 20 }}
                        onPress={() => this.handleDataToBBDD()}
                    />
                </View>
            </View>
        );
    }
}