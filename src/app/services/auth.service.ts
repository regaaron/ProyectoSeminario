import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup ,signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, User, getIdToken, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


   currentUser: User | null = null; // 🔹 aquí guardamos el usuario actual

   private apiUrl = 'http://localhost:3000/auth'; // tu backend Node

   //injectamos Auth y HttpClient auth para firebase y http para llamadas a api
  constructor(private auth: Auth, private http: HttpClient) {
        // 🔹 Suscribirse al estado de autenticación
        onAuthStateChanged(this.auth, (user) => {
          this.currentUser = user;
        });
  }

  //login con correo y contaseña
  async loginEmail(email: string, password: string){
    //guardar en result el usuario autenticado
    const result = await signInWithEmailAndPassword(this.auth,email,password);
    const user = result.user;
    //console.log('User logged in:', user);
    await this.saveUserToBackend(user); //llamamos a la función para guardar en backend
    await this.updateUserStreak(user.uid, await getIdToken(user)); //inicializamos el streak en 0
    return user;
  }


   // 🔹 Login con Google
  async loginGoogle(){
    //Guardamos en resul el usuario autenticado
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth,provider);
    const user = result.user;
    //console.log('User logged in with Google:', user);
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims['admin'] ? 'admin' : 'user';
    await this.saveUserToBackend(user); //llamamos a la función para guardar en backend
    await this.updateUserStreak(user.uid, await getIdToken(user)); //inicializamos el streak en 0
    return {user,role};
  }


  logOut(){
    return this.auth.signOut();
  }


    // 🔹 Registro con correo
  async registerEmail(email: string, password: string,name: string){
    //guardar en result el usuario creado
    const result = await createUserWithEmailAndPassword(this.auth,email,password);
    const user = result.user;
    await updateProfile(user, { displayName: name });
     // Actualiza el nombre del usuario
    //console.log('Usuario registrado:', user);
    await this.saveUserToBackend(user); //llamamos a la función para guardar en backend
    await this.updateUserStreak(user.uid, await getIdToken(user)); //inicializamos el streak en 0

    return user;
  }


  isLoggedIn(): boolean{
    return this.auth.currentUser !== null;
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth,email);
  }

  
  // 🔹 Guardar usuario en backend
  private async saveUserToBackend(user: User) {
    // Obtener el token de ID del usuario y los detalles necesarios
    const token = await getIdToken(user);
    const nombre = user.displayName || 'Usuario';
    const correo = user.email || '';
    const uid = user.uid;

    console.log('Saving user to backend:', { token, nombre, correo, uid });

    //llamado a la api con el body necesario token, nombre, correo, uid
    return this.http.post(`${this.apiUrl}/saveUser`, {
      token, nombre, correo, uid
    }).toPromise();

  }

  private async updateUserStreak(uid: string,token: string){
    return this.http.post(`${this.apiUrl}/updateStreak`,{
      uid,
      token
    }).toPromise();
  }

}
