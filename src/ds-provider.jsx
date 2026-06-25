// Design-sync provider wrapper — not used by the app.
// Gives every preview the router + auth + profile contexts it needs.
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';

export function BooksphereProvider({ children }) {
  return (
    <MemoryRouter>
      <AppProvider>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </AppProvider>
    </MemoryRouter>
  );
}
