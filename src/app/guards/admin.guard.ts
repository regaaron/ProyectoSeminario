import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { getIdTokenResult } from 'firebase/auth';

export const adminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // Espera a que Firebase restaure el usuario actual (evita que te saque al login al recargar)
  const user = await new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const tokenResult = await getIdTokenResult(user);
    const isAdmin = tokenResult.claims['admin'] === true;

    if (isAdmin) {
      return true; // ✅ Usuario con rol admin
    } else {
      console.warn('Acceso denegado: no es administrador');
      router.navigate(['/main']);
      return false;
    }
  } catch (error) {
    console.error('Error verificando rol:', error);
    router.navigate(['/login']);
    return false;
  }
};
