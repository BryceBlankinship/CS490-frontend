import { Link } from 'react-router'
import './App.css'
import { IconMovie, IconHome, IconUsers } from '@tabler/icons-react';

export default function App({ children }) {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <IconMovie size={32} className="brand-icon" />
            <h1>Film City</h1>
          </div>

          <nav className="nav-links">
            <Link to={'/'} className="nav-link">
              <IconHome size={20} />
              <span>Home</span>
            </Link>
            <Link to={'/films'} className="nav-link">
              <IconMovie size={20} />
              <span>Films</span>
            </Link>
            <Link to={'/customer'} className="nav-link">
              <IconUsers size={20} />
              <span>Customers</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}