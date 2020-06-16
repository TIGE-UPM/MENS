import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default class CameraScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoBase64: null,
            photoUri: null,
            hasPermission: null,
            cameraType: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off,
            urlE: this.props.navigation.state.params.urlEncuesta,
        }
    }

    async componentDidMount() {
        this.getPermissionAsync()
    }

    getPermissionAsync = async () => {
        // Obtiene los permisos de la camara del dispositivo
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasPermission: status === 'granted' });
    }

    handleFlashMode=()=>{
        //Cambia el estado del flash de la camara (on o off)
        const { flashMode } = this.state
        this.setState({flashMode:
                flashMode === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
        })
    }

    handleCameraType=()=>{
        //Cambia el tipo de camara, delantera o trasera
        const { cameraType } = this.state
        this.setState({cameraType:
                cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
        })
    }

    takePicture = async () => {
        if (this.camera) {
            //Calidad de la foto y codificarla a base64
            const options = { quality: 0.5, base64: true };
            //Realiza la foto
            let photo = await this.camera.takePictureAsync(options);
            this.setState({ photoBase64: photo.base64 });
            this.setState({ photoUri: photo.uri });
            //Ir a la Pantalla de PhotoScreen cuando se haga la foto y le pasa los parametros: url Encuesta, uri de la foto y foto en base64
            this.props.navigation.navigate('Photo',
                {photoBackground: this.state.photoBase64, uriBackground:this.state.photoUri,urlEn: this.state.urlE})

        }
    }

    render() {
        //Comprueba si tiene permisos sobre la camara
        const { hasPermission } = this.state
        if (hasPermission === null) {
            return <View />;
        } else if (hasPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.cameraType}
                            ref={ref => {this.camera = ref}}
                            flashMode={this.state.flashMode}
                            autoFocus={Camera.Constants.AutoFocus.on}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:30}}>
                            {/*Boton para el flash (on o off)*/}
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent'
                                }}
                                onPress={()=>this.handleFlashMode()}>
                                <Ionicons
                                    name={this.state.flashMode == Camera.Constants.FlashMode.on ? "md-flash" : 'md-flash-off'}
                                    style={{ color: "#50D4F2", fontSize: 40}}
                                />
                            </TouchableOpacity>
                            {/*Boton para hacer la foto*/}
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                onPress={()=>this.takePicture()}
                            >
                                <FontAwesome
                                    name="camera"
                                    style={{ color: "#50D4F2", fontSize: 40}}
                                />
                            </TouchableOpacity>
                            {/*Boton para escoger el tipo de camara (trasera o delantera)*/}
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                onPress={()=>this.handleCameraType()}
                            >
                                <Ionicons
                                    name="md-reverse-camera"
                                    style={{ color: "#50D4F2", fontSize: 40}}
                                />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}