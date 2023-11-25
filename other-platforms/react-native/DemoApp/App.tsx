/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState} from 'react';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import DropDownPicker from 'react-native-dropdown-picker';

// Import  MetaKeep React Native SDK
import MetaKeep from 'metakeep-react-native-sdk';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [appId, setAppId] = useState('');
  const [currentSdkOperation, setCurrentSdkOperation] = useState('signMessage');
  const [sdkOperations, _] = useState([
    {label: 'Sign Message', value: 'signMessage'},
    {label: 'Sign Transaction', value: 'signTransaction'},
    {label: 'Sign Typed Data', value: 'signTypedData'},
  ]);
  const [sdkOperationDropdownOpen, setDdkOperationDropdownOpen] =
    useState(false);

  const [sdkOperationData, setSdkOperationData] = useState('');
  const [sdkOperationReason, setSdkOperationReason] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  const initializeSdk = () => {
    MetaKeep.initialize(appId);
    Alert.alert('SDK Initialized');

    // You can also set the user for the SDK
    // if you already have a signed in user

    // MetaKeep.setUser({
    //   email: 'user@email.com',
    // });
  };

  const performSdkOperation = () => {
    let operationResult = null;

    if (currentSdkOperation === 'signMessage') {
      operationResult = MetaKeep.signMessage(
        sdkOperationData,
        sdkOperationReason,
      );
    }

    if (currentSdkOperation === 'signTransaction') {
      operationResult = MetaKeep.signTransaction(
        JSON.parse(sdkOperationData),
        sdkOperationReason,
      );
    }

    if (currentSdkOperation === 'signTypedData') {
      operationResult = MetaKeep.signTypedData(
        JSON.parse(sdkOperationData),
        sdkOperationReason,
      );
    }

    // You can get user's consent for operations that return a consentToken
    // await MetaKeep.getConsent(consentToken);

    operationResult
      ?.then((result: any) => {
        Alert.alert(
          'SDK Operation Successful',
          JSON.stringify(result, null, 2),
        );
        console.log(result);
      })
      .catch((error: any) => {
        Alert.alert('SDK Operation Failed', JSON.stringify(error, null, 2));
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Image
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'contain',
        }}
        source={require('./assets/metakeep.png')}
      />

      {/* A textbox for users to enter appId and and Initialize SDK button next to it */}
      <TextInput
        style={{
          height: 40,
          borderWidth: 1,
          margin: 12,
          padding: 5,
          borderRadius: 5,
        }}
        onChangeText={text => setAppId(text)}
        value={appId}
        placeholder="Enter appId"
      />
      <Button onPress={initializeSdk} title="Initialize SDK" />

      {/* Divider */}
      <View
        style={{
          height: 20,
        }}
      />

      {/* Dropdown that allows users to select the type of SDK operation */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          margin: 5,
          textAlign: 'center',
        }}>
        Select SDK Operation
      </Text>
      <View
        style={{
          margin: 5,
          padding: 5,
          zIndex: 10000,
        }}>
        <DropDownPicker
          open={sdkOperationDropdownOpen}
          setOpen={setDdkOperationDropdownOpen}
          items={sdkOperations}
          value={currentSdkOperation}
          setValue={setCurrentSdkOperation}
          zIndex={10000}
        />
      </View>

      {/* Textbox for users to enter data for the selected SDK operation */}
      <TextInput
        style={{
          height: 100,
          borderWidth: 1,
          margin: 12,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={text => setSdkOperationData(text)}
        placeholder={`Enter data for ${currentSdkOperation}`}
        multiline
      />

      <TextInput
        style={{
          borderWidth: 1,
          margin: 12,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={text => setSdkOperationReason(text)}
        placeholder={`Enter reason for ${currentSdkOperation}`}
      />

      <Button onPress={performSdkOperation} title="Submit" />
    </SafeAreaView>
  );
}

export default App;
