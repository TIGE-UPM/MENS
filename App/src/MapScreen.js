import * as React from 'react';
import MapView,  { Marker } from 'react-native-maps';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import i18n from './languages/i18n';



export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoBas64: this.props.navigation.state.params.photoBase64,
            urlEncue:this.props.navigation.state.params.infoEn,
            location: null,
            mapRegion: null,
            latLong: {latitude: 0, longitude: 0},
            hasLocationPermissions: null,
            mapType: "standard",
        }
    }
    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        //Obtiene los permisos para utilizar la localizacion del dispositivo
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                location: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }

        //Obtiene la localizacion en tiempo real del dispositivo movil
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });

        //Para centrar el mapa en la localizacion donde se encuentra el dispositivo movil
        this.setState({mapRegion: { latitude: location.coords.latitude,
                longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.006 }});

        this.setState({latLong: {latitude: this.state.mapRegion.latitude,
                longitude: this.state.mapRegion.longitude}});
    };

    handleFirstLocation=()=>{
        //Para volver a la localizacion incial del dispositivo
        const { latLong } = this.state
        this.setState({latLong: { latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude }})
    }

    switchMapTypeHybrid() {
        //Mapa en modo hibrido
        this.setState({mapType: "hybrid"})
    }

    switchMapTypeStandard() {
        //Mapa en modo estandar
        this.setState({mapType: "standard"})
    }

    render() {
        //Dependiendo de si se obtienen los permisos o la region es correcta asigna un mensaje u otro que aparecera en la app
        let text = i18n.t('MAP_loc');
        if (this.state.location === null) {
            text = i18n.t('MAP_findingLoc');
        } else if (!this.state.hasLocationPermissions) {
            text = i18n.t('MAP_noLocPermissions');
        } else if (this.state.mapRegion === null) {
            text = i18n.t('MAP_noMapRegion');
        }
        return (
            <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end',  alignItems: 'center' }}>
                {/*Renderizacion del mapa*/}
                <MapView style={{ ...StyleSheet.absoluteFillObject }}
                         initialRegion={this.state.mapRegion}
                         mapType={this.state.mapType}>
                    {/*Marcador con la posicion*/}
                    <Marker
                        coordinate={ this.state.latLong}
                        title={i18n.t('MAP_markerTitle')}
                        description= {JSON.stringify(this.state.latLong)}
                        pinColor= 'red'
                        draggable
                        onDragEnd={(e) => this.setState({ latLong: e.nativeEvent.coordinate })}
                    />
                </MapView>
                <View style={{flexDirection: 'row', marginBottom: 40, backgroundColor: 'transparent' }}>
                    {/*Boton donde se muestran los mensajes de error o el texto para volver a la localizacion inicial*/}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(39, 122, 140,0.9)',
                            paddingHorizontal: 12,
                            paddingVertical: 12,
                            borderRadius: 20,
                            alignItems: 'center',
                        }}
                        onPress={()=> this.handleFirstLocation()}
                    >
                        <Text style={{fontSize: 15, color:'white'}}>{text}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginStart:260, marginBottom:455, backgroundColor: 'transparent' }}>
                    {/*Boton para cambiar el tipo de mapa a hibrido*/}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(39, 122, 140,0.9)',
                            paddingHorizontal: 7,
                            paddingVertical: 7,
                            alignItems: 'center',
                            borderColor: '#0E3740',
                            borderWidth: 1,
                        }}
                        onPress={()=> this.switchMapTypeHybrid()}
                    >
                        <Text style={{fontSize: 11, color:'white'}}>{i18n.t('MAP_hybrid')}</Text>
                    </TouchableOpacity>
                    {/*Boton para cambiar el tipo de mapa a estandar*/}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(39, 122, 140,0.9)',
                            paddingHorizontal: 7,
                            paddingVertical: 7,
                            alignItems: 'center',
                            borderColor: '#0E3740',
                            borderWidth: 1,
                        }}
                        onPress={()=> this.switchMapTypeStandard()}
                    >
                        <Text style={{fontSize: 11, color:'white'}}>{i18n.t('MAP_standard')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 20, backgroundColor: 'transparent' }}>
                    {/*Boton para guardar datos localizacion e ir a la pantalla de encuesta, le pasa los
                    parametros: foto en base64, url Encuesta y coordenadas localizacion*/}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(242, 142, 19,0.9)',
                            paddingHorizontal: 12,
                            paddingVertical: 12,
                            borderRadius: 20,
                        }}
                        onPress={()=> this.props.navigation.navigate('Survey',
                            {photoBs64: this.state.photoBas64, markerCoord: this.state.latLong, urlEncues: this.state.urlEncue})}
                    >
                        <Text style={{fontSize: 20, color: 'white'}}>{i18n.t('MAP_buttonSaveData')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


