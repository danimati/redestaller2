import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';

export default function MyScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  // Función para mostrar el modal
  const showModal = () => {
    setModalVisible(true);
  };

  // Función para ocultar el modal
  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Pantalla principal */}
      <Text>Pantalla principal abierta</Text>
      <Button title="Abrir Modal" onPress={showModal} />

      {/* Modal */}
      <Modal
        animationType="slide" // Tipo de animación (puedes usar 'fade' o 'slide')
        transparent={true} // Hace el fondo transparente
        visible={isModalVisible} // Controla si el modal está visible
        onRequestClose={hideModal} // Cierra el modal cuando se presiona el botón "Atrás" (en Android)
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Este es un modal</Text>
            <Button title="Cerrar Modal" onPress={hideModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
