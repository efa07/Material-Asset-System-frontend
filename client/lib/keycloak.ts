import Keycloak from 'keycloak-js';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/useAppStore';

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'insa-material-management',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'asset-frontend',
});


 export async function logoutAndClear() {
  try {
    // Clear auth store
    useAuthStore.getState().clearAuth();

    // Clear app store (user, isAuthenticated, UI state where applicable)
    useAppStore.getState().logout();

    // Clear all localStorage entries to ensure persisted zustand or other data is removed
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }

    
    await keycloak.logout({ redirectUri: window.location.origin });
  } catch (err) {
    console.error('Error during logoutAndClear', err);
  }
}

export default keycloak;
