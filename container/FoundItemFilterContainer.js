import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebaseDb, { db } from '../firebaseDb';
import { Dropdown } from 'react-native-material-dropdown';
import { Constants } from 'expo-constants';

import SubmitItemButton from '../component/SubmitItemButton';

export default class FoundItemFilterContainer extends Component {

    state = {
            categorySelectedValue: 1,
            colorSelectedValue: 1,
            locationSelectedValue: 1,
            name: null,
            image_uri: null
    }

    setCategoryStateValue = (ddlValue) => {
        this.setState({
            categorySelectedValue: ddlValue
        });
    }

    setColorStateValue = (ddlValue) => {
        this.setState({
            colorSelectedValue: ddlValue
        });
    }

    setLocationStateValue = (ddlValue) => {
        this.setState({
            locationSelectedValue: ddlValue
        });
    }

    async componentDidMount() {

        const { status } = await ImagePicker.getCameraRollPermissionsAsync();
        if (status !== 'granted') {
            response = await ImagePicker.requestCameraRollPermissionsAsync({
                allowsEditing: true
            });
        }
    }

    onChooseImagePress = async () => {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
            this.setState({ image_uri: result.uri });
        }
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebaseDb.storage().ref().child("lost items/" + imageName)
        return ref.put(blob);
    }

    submitItem = async () => {
        this.uploadImage(this.state.image_uri, this.state.name)
            .then(() => {
                Alert.alert("Success");
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    }

    render() {

        const {
            name,
            image_uri,
            colorSelectedValue,
            categorySelectedValue,
            locationSelectedValue
        } = this.state;

        const categories = [
            {
                label: 'stationery',
                value: 1
            }, {
                label: 'valuables',
                value: 2
            }, {
                label: 'academic',
                value: 3
            }, {
                label: 'personal identification',
                value: 4
            }, {
                label: 'others',
                value: 5
            }
        ]

        const color = [
            {
                label: 'red',
                value: 1
            }, {
                label: 'blue',
                value: 2
            }, {
                label: 'brown',
                value: 3
            }, {
                label: 'pink',
                value: 4
            }, {
                label: 'purple',
                value: 5
            }, {
                label: 'turquoise',
                value: 6
            }, {
                label: 'green',
                value: 7
            }, {
                label: 'orange',
                value: 8
            }, {
                label: 'yellow',
                value: 9
            }, {
                label: 'gray',
                value: 10
            }, {
                label: 'white',
                value: 11
            }, {
                label: 'black',
                value: 12
            }
        ]

        const location = [
            {
                label: 'Faculty of Science',
                value: 1
            }, {
                label: 'Medicine',
                value: 2
            }, {
                label: 'Yusof Ishak House',
                value: 3
            }, {
                label: 'Central Library',
                value: 4
            }, {
                label: 'Faculty of Arts and Social Science',
                value: 5
            }, {
                label: 'School of Computing',
                value: 6
            }, {
                label: 'Business School',
                value: 7
            }, {
                label: 'School of Design and Environment',
                value: 8
            }, {
                label: 'Faculty of Engineering',
                value: 9
            }, {
                label: 'University Town',
                value: 10
            }, {
                label: 'NUS Museum',
                value: 11
            }
        ]

        return (
            <View style = {styles.container}>
                <View style = {styles.dropdownContainer}>
                    <Dropdown
                        containerStyle = {styles.dropdown}
                        data = {categories}
                        value = {this.state.categorySelectedValue}
                        label = 'Category'
                        itemColor = 'blue'
                        useNativeDriver = {true}
                        onChangeText = {(value, data, index) => {
                            this.setCategoryStateValue(value)
                        }}
                    />

                    <Dropdown
                        containerStyle = {styles.dropdown}
                        data = {color}
                        value = {this.state.colorSelectedValue}
                        label = 'Colour'
                        itemColor = 'blue'
                        useNativeDriver = {true}
                        onChangeText = {(value, data, index) => {
                            this.setColorStateValue(value)
                        }}
                    />

                    <Dropdown
                        containerStyle = {styles.dropdown}
                        data = {location}
                        value = {this.state.locationSelectedValue}
                        label = 'Where item was found'
                        itemColor = 'blue'
                        useNativeDriver = {true}
                        onChangeText = {(value, data, index) => {
                            this.setLocationStateValue(value)
                        }}
                    />
                </View>

                <View style = {styles.imageContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder = 'Name of item'
                        onChangeText = {text => {
                            this.setState({name: text});
                        }}
                        value = {this.state.name}
                    />

                    <Button
                        title = "Choose image..."
                        onPress = {this.onChooseImagePress}
                    />
                </View>

                <SubmitItemButton
                    onPress = {this.submitItem}
                />
            </View>
        )
    }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#b9d6eb',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownContainer: {
        height: height/3,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: height / 4,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dropdown: {
        width: width / 1.2,
        marginHorizontal: 20,
        marginBottom: 5
    },
    textInput: {
        height: 25,
        width: width / 2,
        borderColor: 'black',
        borderWidth: 1,
    }
})