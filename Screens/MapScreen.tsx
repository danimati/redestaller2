import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function MapScreen({
  setToken,
  setListaPuntos,
  listaPuntos,
}: {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setListaPuntos: React.Dispatch<React.SetStateAction<Array<{ latitud: number; longitud: number }>>>;
  listaPuntos: Array<{ latitud: number; longitud: number }>;
}) {
  const [location, setLocation] = useState<any>(null);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    // Solo suscribirnos si no tenemos una suscripción activa
    if (!subscription) {
      startTracking();
    }

    // Limpiar la suscripción cuando el componente se desmonte o el rastreo se detenga
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]); // Dependencia en `subscription`, se activa solo cuando cambia

  const startTracking = async () => {
    // Iniciar el rastreo si no hay una suscripción activa
    const newSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 }, // Intervalo de 1 segundo
      (newLocation) => {
        console.log("Nueva ubicación:", newLocation.coords);

        // Actualizamos la lista de puntos con la nueva ubicación
        setListaPuntos((prevPuntos) => [
          ...prevPuntos,
          { latitud: newLocation.coords.latitude, longitud: newLocation.coords.longitude },
        ]);

        // Actualizamos la ubicación en el estado
        setLocation(newLocation.coords);
      }
    );

    setSubscription(newSubscription); // Guardamos la suscripción
  };

  // Detener el rastreo continuo
  const stopTracking = () => {
    if (subscription) {
      subscription.remove(); // Remover la suscripción
      setSubscription(null); // Limpiar la suscripción
    }
  };

  return (
    <View style={styles.container}>
      {/* Mostrar la ubicación actual */}
      {location && (
        <Text>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </Text>
      )}
      {/* Botón para iniciar el rastreo */}
      <Button title="Iniciar rastreo" onPress={startTracking} />
      {/* Botón para detener el rastreo */}
      <Button title="Detener rastreo" onPress={stopTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    marginTop: 16,
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  small: { color: '#666' },
  link: { color: '#007aff', fontWeight: '600' },
});
