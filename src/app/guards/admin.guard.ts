import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { getIdTokenResult } from 'firebase/auth';

export const adminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // Espera a que Firebase confirme el usuario actual
  const user = auth.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const tokenResult = await getIdTokenResult(user);
    const isAdmin = tokenResult.claims['admin'] === true;

    if (isAdmin) {
      return true; // ✅ Tiene permiso
    } else {
      console.warn('Acceso denegado: no es administrador');
      router.navigate(['/main']); // O cualquier ruta de usuario normal
      return false;
    }
  } catch (error) {
    console.error('Error verificando rol:', error);
    router.navigate(['/login']);
    return false;
  }
};
