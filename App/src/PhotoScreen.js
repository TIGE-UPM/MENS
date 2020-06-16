import * as React from 'react';
import {View, TouchableOpacity, ImageBackground} from 'react-native';
import { Ionicons} from '@expo/vector-icons';



export default class PhotoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoB64: this.props.navigation.state.params.photoBackground,
            photoUrl: this.props.navigation.state.params.uriBackground,
            urlEnc: this.props.navigation.state.params.urlEn,
        }
    }
    render() {
        return (
            <View style={{ flex: 1}}>
                {/*Muestra la foto tomada con la camara (la pone de fondo)*/}
                <ImageBackground source={{uri: this.state.photoUrl}}
                                 style={{width: '100%', height: '100%'}}>
                    <View style={{flex:1, flexDirection:"row",justifyContent:"space-between"}}>
                        {/*Boton para volver a la camara de fotos por si hay que repetir la foto*/}
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-start',
                                alignItems: 'center',
                                margin: 30,
                                backgroundColor: 'transparent',
                            }}
                            onPress={()=> this.props.navigation.goBack()}
                        >
                            <Ionicons
                                name="md-close-circle-outline"
                                style={{ color: "crimson", fontSize: 40}}
                            />
                        </TouchableOpacity>
                        {/*Boton para ir a la pantalla del mapa, le pasa como parametros: foto en base64 y la url Encuesta*/}
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                margin: 20,
                                backgroundColor: 'transparent',
                            }}
                            onPress={()=> this.props.navigation.navigate('Map',
                                {photoBase64: this.state.photoB64, infoEn: this.state.urlEnc})}
                        >
                            <Ionicons
                                name="ios-arrow-dropright-circle"
                                style={{ color: "#50D4F2", fontSize: 50}}
                            />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

            </View>
        );
    }
}