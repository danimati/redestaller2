import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LogginScreen from './Screens/LoginScreen';
import MapScreen from './Screens/MapScreen';
import SocketScreen from './Screens/SocketScreen';


export default function App() {
  var [token, setToken] = React.useState<string | null>(null);
  var [listaPuntos, setListaPuntos] = React.useState<Array<{latitud: number, longitud: number}>>([]);
  var [estado, setEstado] = React.useState<number>(0);
  var [options, setOptions] = React.useState<{ value: string; label: string }[]>([{value: 'option1', label: 'Option 1'}]); // Estado para las opciones
  


  return (
    <View style={styles.container}>
       {token!=null && estado===1 ? (
        
          <SocketScreen 
          listaPuntos={listaPuntos} 
          setListaPuntos={setListaPuntos} 
          token={token} 
          setToken={setToken}
          setEstado={setEstado}
          />
        
      ) : ( 
        <LogginScreen setToken={setToken} setEstado={setEstado} />
      )}
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
