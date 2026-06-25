import { Navbar } from 'booksphere-client';

// Navbar uses useApp + useProfile (provided by BooksphereProvider wrapper)
// and react-router-dom Link/NavLink.

export const Default = () => (
  <div style={{ background: '#0d0d0d', minHeight: '56px' }}>
    <Navbar />
  </div>
);
