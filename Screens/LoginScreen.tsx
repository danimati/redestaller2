import React, { useState } from 'react';
import {
SafeAreaView,
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
KeyboardAvoidingView,
Platform,
ActivityIndicator,
} from 'react-native';
import {urlapi} from './config/consts';


type Props = {
navigation?: any;
setToken: React.Dispatch<React.SetStateAction<string | null>>;
setEstado: React.Dispatch<React.SetStateAction<number>>;
};


const LoginScreen: React.FC<Props> = ({ navigation, setToken, setEstado }) => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [secure, setSecure] = useState(true);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');



const handleLogin = async () => {
    setError('');
    if (!email || !password) {
        setError('Completa los campos.');
        return;
    }
    setLoading(true);
    try {
        fetch(urlapi+'/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            numero_telefono: email,
            contrasena: password,
        }),
    }).then((response) => response.json()
    ).then((data) => {
        if (data.token) {
            console.log('Token recibido:', data.token);
            setToken(data.token);
            setEstado(1);
        }
    }  )

// {
//     "numero_telefono":"3192075462",
//     "contrasena":"contrasena"
// }

    } catch (e) {
        setError('Error al iniciar sesión.');
    } finally {
        setLoading(false);
    }
};



return (
    <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar sesión</Text>

                <Text style={styles.label}>Celular</Text>
                <TextInput
                    style={styles.input}
                    placeholder="3000000000"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={[styles.label, { marginTop: 12 }]}>Contraseña</Text>
                <View >
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry={secure}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        onPress={() => setSecure((s) => !s)}
                        style={styles.showBtn}
                    >
                        <Text style={styles.showText}>{secure ? 'Mostrar' : 'Ocultar'}</Text>
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
);
};
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',  // Centrado horizontal y vertical
    paddingHorizontal: 20,  // Agrega un poco de espacio horizontal para evitar que toque los bordes
  },
  card: {
    width: '100%', // Asegura que ocupe todo el ancho posible
    maxWidth: 400,  // Limita el ancho máximo para que no se expanda demasiado en pantallas grandes
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',  // Asegura que el título esté centrado
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e3e6ee',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12, // Agrega un poco de espacio entre los campos
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showBtn: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  showText: { color: '#007aff', fontWeight: '600' },
  error: { color: '#d9534f', marginTop: 8, marginBottom: 4 },
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


export default LoginScreen;