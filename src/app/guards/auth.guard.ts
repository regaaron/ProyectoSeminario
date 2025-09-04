import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async (route, state) => {
 const router = inject(Router);
  const auth = inject(Auth);

  // 🔹 Esperamos a que Firebase diga si hay sesión
  const user = await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
