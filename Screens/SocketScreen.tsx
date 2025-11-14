import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import { urlapi, urlsocket } from './config/consts';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker'; // Importamos el Picker
import DropDownPicker from 'react-native-dropdown-picker';

export default function SocketScreen({
  listaPuntos,
  setListaPuntos,
  token,
  setToken,
  setEstado,
}: {
  listaPuntos: Array<{ latitud: number; longitud: number }>;
  setListaPuntos: React.Dispatch<React.SetStateAction<Array<{ latitud: number; longitud: number }>>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setEstado: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [location, setLocation] = useState<any>(null);
  const [watching, setWatching] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('option1');
  var [options, setOptions] = useState<{ value: string; label: string }[]>([{value: 'option1', label: 'Option 1'}]); // Estado para las opciones

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket(urlsocket + '/ws');

    ws.onopen = () => {
      console.log('Conectado al WebSocket');
      setConnected(true);
    };

    ws.onmessage = async (event) => {
      console.log('Mensaje recibido:', event.data);

      // Si el mensaje recibido es ".", empezar el rastreo
      if (event.data === '.') {
        await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 1000 },
          async (newLocation) => {
            console.log('Nueva ubicación:', newLocation.coords);

            // Actualizamos la lista de puntos con la nueva ubicación
            setListaPuntos((prevPuntos) => [
              ...prevPuntos,
              { latitud: newLocation.coords.latitude, longitud: newLocation.coords.longitude },
            ]);

            // Actualizamos la ubicación en el estado
            setLocation(newLocation.coords);

            fetch(urlapi + '/guardar_posicion', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuario_token: token,
                latitud: newLocation.coords.latitude,
                longitud: newLocation.coords.longitude,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log('Posición guardada:', data);
              });
          }
        );
      }
      setMessage(event.data); // Almacena el mensaje recibido en el estado
    };

    ws.onerror = (error) => {
      console.log('Error en WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
      setConnected(false);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
        console.log('WebSocket cerrado');
      }
      if (subscription) {
        subscription.remove(); // Limpiar la suscripción cuando el componente se desmonte
      }
    };
  }, [watching, subscription]);

  const [region, setRegion] = useState({
    latitude: 4.60971, // Latitud inicial (Bogotá)
    longitude: -74.08175, // Longitud inicial (Bogotá)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Cuando la ubicación cambia, actualiza el mapa
  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  const showModal = () => {
    consultarUsuarios();  // Llamamos a la función que consulta los usuarios antes de mostrar el modal
    setModalVisible(true); // Mostramos el modal
  };

  // Función para ocultar el modal
  const hideModal = () => {
    setModalVisible(false);  // Ocultamos el modal
  };

  const consultarUsuarios = () => {
    var aux: any[] = [];
    fetch(urlapi + '/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Usuarios recibidos:', data);
        aux = data;

        // Crear las opciones para el picker basadas en la respuesta
        setOptions(  // Actualizamos el estado de las opciones
          data.map((user: { id: string; nombre: string }) => ({
            value: user.id,
            label: user.nombre,
          }))
        );
        aux = options;
      })
      .catch((error) => {
        console.error('Error al consultar usuarios:', error);
      });
      return aux;
  };
  useEffect(() => {
    consultarUsuarios();
  }, [options]);


  function selectt() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'}
    ]);

    return (<DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />)
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // Actualiza la región del mapa cuando el usuario hace un cambio
      >
        {/* Usamos la ubicación actual para el marcador */}
        {location && (
          <Marker coordinate={location} title="Mi Ubicación" description="Este es el punto actual" />
        )}

        {/* Iterar sobre listaPuntos y agregar un marcador para cada punto */}
        {listaPuntos.map((point, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: point.latitud, longitude: point.longitud }}
            title="Punto"
            description="Este es un punto"
          />
        ))}
      </MapView>

      <Button title="Cerrar sesión" onPress={() => { setToken(null); setEstado(0); }} />
      <Button title="Abrir filtros" onPress={() => { showModal(); }} />
      <Text>{message}</Text>

      {/* Modal */}
      <Modal
        animationType="slide" // Tipo de animación (puedes usar 'fade' o 'slide')
        transparent={true} // Hace el fondo transparente
        visible={isModalVisible} // Controla si el modal está visible
        onRequestClose={hideModal} // Cierra el modal cuando se presiona el botón "Atrás" (en Android)
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Selecciona un Usuario</Text>
            {/* <textarea
                id="myInput"
                value={selectedOption}
                onChange={e => setSelectedOption(e.target.value)}
                placeholder="Type here..."
            /> */}
            <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue) => setSelectedOption(itemValue)}
            >
              {options.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>

            <Button title="Cerrar Modal" onPress={hideModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});
