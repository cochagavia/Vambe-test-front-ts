import { auth } from './configFirebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';

// Función para registrar un nuevo usuario
export const signUpWithEmailPassword = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este correo electrónico ya está registrado';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Correo electrónico inválido';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Operación no permitida';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es demasiado débil';
                break;
            default:
                errorMessage = 'Ocurrió un error durante el registro';
        }
        throw new Error(errorMessage);
    }
};

// Función para iniciar sesión
export const signInWithEmailPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        let errorMessage;
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Correo electrónico inválido';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este correo electrónico';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta';
                break;
            default:
                errorMessage = 'Error al iniciar sesión';
        }
        throw new Error(errorMessage);
    }
};

// Función para cerrar sesión
export const signOutAuth = async () => {
    try {
        await signOut(auth);
        // Aquí podrías agregar lógica adicional después del logout exitoso
    } catch (error) {
        throw new Error('Error al cerrar sesión');
    }
}; 