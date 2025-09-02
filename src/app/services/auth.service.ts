import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup ,signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth ) { }

  //login con correo y contaseña
  loginEmail(email: string, password: string){
    return signInWithEmailAndPassword(this.auth,email,password);
  }

  loginGoogle(){
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth,provider);
  }

  logOut(){
    return this.auth.signOut();
  }


  registerEmail(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth,email,password);

  }


  isLoggedIn(): boolean{
    return this.auth.currentUser !== null;
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth,email);
  }
}
