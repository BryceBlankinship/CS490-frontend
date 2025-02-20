import { Link } from 'react-router'
import './App.css'

export default function App({ children }) {

  return (
    <div className="app-container">
      <header>
        <div className="header-row">
          <h1>Film City</h1>

          <Link to={'/'}>Home</Link>
          <Link to={'/films'}>Films</Link>
          <Link to={'/customer'}>Customer</Link>
        </div>
      </header>

      {children}
    </div>
  )
}