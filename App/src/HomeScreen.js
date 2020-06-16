import * as React from 'react';
import { View, Text, TextInput, Alert, AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import i18n from './languages/i18n';


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
            textInput: '',
            data: '',
           isConnected: '',
        }
    }

    async componentDidMount() {
        //Permite saber si hay conexion, si esta offline u online, devuelve un booleano
        NetInfo.addEventListener( state => {
            this.setState({isConnected: state.isConnected});
        });
    }

    //Envia los datos almacenados en el AsyncStorage a la bbdd cuando hay conexion y permite navegar a la siguiente pantalla
    handleData= async ()=>{
        if(this.state.isConnected) {
            try {
                //Obtiene todas las keys de los datos almacenados en el AsyncStorage
                let keys = await AsyncStorage.getAllKeys();
                // con las keys obtiene los datos almacenados
                let items = await AsyncStorage.multiGet(keys);
                //obtiene cada sesion de captura de datos por separado y las va enviando a la bbdd de una en una
                items.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    //Se hace un fetch POST con los datos al servidor
                    fetch('http://192.xxx.y.zz:3210/data', { //IP del ordenador y el puerto que se ha indicado en el servidor
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: value,
                    }).then((response) => {
                        //Respuesta de la bbdd
                        console.log('response:',response.status);
                        //Si todo es correcto
                        if (response.status == 200){
                            //Salta el alert confirmando que se han guardado los datos en la bbdd
                            Alert.alert(
                                //title
                                i18n.t('HOME_alertOkTitle'),
                                //body
                                i18n.t('HOME_alertOkMessage'),
                                [
                                    { text: i18n.t('HOME_alertOkButton')},
                                ],
                            );
                            //Si los datos se han guardado correctamente en la bbdd se elimina del AsyncStorage
                            AsyncStorage.removeItem(key, (err) => {});
                        }
                    }).catch(() => { //Si no se pueden guardar los datos en la bbdd salta un error
                        Alert.alert(
                            //title
                            i18n.t('HOME_alertErrorTitle'),
                            //body
                            i18n.t('HOME_alertErrorMessage'),
                            [
                                { text: i18n.t('HOME_alertOkButton')},
                            ],
                        );
                    });
                });
            } catch (error) { //Si no se pueden guardar los datos en la bbdd salta un error
                console.log(error);
            }
        }
        //Navega a la siguiente pantalla
        this.props.navigation.navigate('Camera', {urlEncuesta: this.state.data})
    }

    getText(text) {
        //Guarda la URL escrita en el textInpput y llama a getData()
        this.setState({textInput: text});
        this.getData(text);
    }

    getData= async (text) => {
            try {
                //Primero asigna la promesa sin resolver y luego obtiene los datos mediante el metodo json
                const dataURL = await fetch(text);
                const dataEn = await dataURL.json();
                this.setState({data: dataEn});
            } catch(err) {
                console.log("Error fetching data-----------", err);
            }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#50D4F2' }}>
                <View style={{flexGrow: 0, width: 'auto', alignSelf: 'center', backgroundColor: 'white',
                    borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5, alignContent: 'center',
                    padding: 15, elevation: 2, marginBottom:20}}>
                    <View style={{ alignItems: 'center'}}>
                        <Text style={{color: 'black', fontSize: 20, marginBottom: 35, marginTop:10}}>
                            {i18n.t('HOME_title')}
                        </Text>
                    </View>
                    {/*Text Input para introducir la url de la encuesta*/}
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'rgba(204,204,204,1)', backgroundColor: 'white',
                            borderRadius: 10, padding: 10, textAlignVertical: 'top', marginLeft: 10,
                            marginRight: 10, marginBottom:20}}
                        placeholder={i18n.t('HOME_placeholder')}
                        onChangeText={(text) => this.getText(text)}
                        value={this.state.textInput}

                    />
                    <View style={{ alignItems: 'center'}}>
                        {/*Boton para comenzar la captura, va a la pantalla de la camara y le pasa el parametro url Encuesta */}
                        <Button
                            title={i18n.t('HOME_button')}
                            buttonStyle={{ backgroundColor: '#F28E13', padding:10, borderRadius:20}}
                            titleStyle={{ color: 'white', fontSize: 20 }}
                            disabled={this.state.data == ''}
                            onPress={() => this.handleData()}
                        />
                    </View>
                </View>

            </View>
        );
    }
}