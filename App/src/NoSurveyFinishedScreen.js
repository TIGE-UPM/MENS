/*MIT License

Copyright (c) 2019 Devlin Bentley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
import * as React from 'react';
import {View, Text, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import { SimpleSurvey } from './SimpleSurvey';
import i18n from './languages/i18n';


export default class NoSurveyFinishedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo64Data: this.props.navigation.state.params.pBas64,
            coordData: this.props.navigation.state.params.coord,
            answersSoFar: ''
        }
    }

    onSurveyFinished(answers) {

        const infoQuestionsRemoved = [...answers];

        // Convert from an array to a proper object. This won't work if you have duplicate questionIds
        const answersAsObj = {};
        for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }

        //Ir a la siguiente pantalla SurveyFinished, le pasa como parametros: foto en base64, el nombre de la PYME y coordenadas localizacion
        this.props.navigation.navigate('SurveyFinished', { surveyAnswers: answersAsObj, coordLL: this.state.coordData,
            photo64: this.state.photo64Data});
    }

    /**
     *  After each answer is submitted this function is called. Here you can take additional steps in response to the
     *  user's answers. From updating a 'correct answers' counter to exiting out of an onboarding flow if the user is
     *  is restricted (age, geo-fencing) from your app.
     */
    onAnswerSubmitted(answer) {
        this.setState({ answersSoFar: JSON.stringify(this.surveyRef.getAnswers(), 2) });
    }

    renderFinishedButton(onPress, enabled) {
        return (
            <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
                <Button
                    title={i18n.t('NOSURVEYFINISHED_finished')}
                    onPress={onPress}
                    disabled={!enabled}
                    buttonStyle={{ backgroundColor: '#F28E13', borderRadius:20}}
                    titleStyle={{ color: 'white'}}
                />
            </View>
        );
    }

    renderQuestionText(questionText) {
        return (
            <View style={{ marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                <Text numLines={1} style={{marginBottom: 20,fontSize: 20}}>{questionText}</Text>
            </View>
        );
    }

    renderTextBox(onChange, value, placeholder, onBlur) {
        return (
            <View>
                <TextInput
                    style={{ borderWidth: 1, borderColor: 'rgba(204,204,204,1)', backgroundColor: 'white',
                        borderRadius: 10, padding: 10, textAlignVertical: 'top', marginLeft: 10,
                        marginRight: 10 }}
                    onChangeText={text => onChange(text)}
                    numberOfLines={1}
                    underlineColorAndroid={'white'}
                    placeholder={placeholder}
                    placeholderTextColor={'rgba(184,184,184,1)'}
                    value={value}
                    multiline
                    onBlur={onBlur}
                    blurOnSubmit
                    returnKeyType='done'
                />
            </View>
        );
    }
    render() {
        const survey = [
            {
                questionType: 'TextInput',
                questionText: i18n.t('NOSURVEYFINISHED_questionText'),
                questionId: 'NombrePYME',
                placeholderText: i18n.t('NOSURVEYFINISHED_placeholder'),
            }
        ]
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#50D4F2'}}>
                <View style={{ flex: 1, minWidth: '70%', maxWidth: '90%', alignItems: 'stretch',
                    justifyContent: 'center', borderRadius: 10,}}>
                    <SimpleSurvey
                        ref={(s) => { this.surveyRef = s; }}
                        survey={survey}
                        containerStyle={{flexGrow: 0, width: 'auto', alignSelf: 'center', backgroundColor: 'white',
                            borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                            borderTopLeftRadius: 5, borderTopRightRadius: 5, alignContent: 'center',
                            padding: 5, elevation: 20,}}
                        selectionGroupContainerStyle={{flexDirection: 'column',backgroundColor: 'white',
                            alignContent: 'flex-end',}}
                        navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
                        renderFinished={this.renderFinishedButton.bind(this)}
                        renderQuestionText={this.renderQuestionText}
                        onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
                        onAnswerSubmitted={(answer) => this.onAnswerSubmitted(answer)}
                        renderTextInput={this.renderTextBox}
                    />

                </View>
            </View>
        );
    }
}