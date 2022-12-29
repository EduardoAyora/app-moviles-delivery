import './Home.css'
import user from '../lib/user'

export default function Home() {
  return (
    <body className="welcome">
      <span id="splash-overlay" className="splash"></span>
      <span id="welcome" className="z-depth-4"></span>

      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="fixed-action-btn">
        <p
          style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'black', textAlign: 'center', margin: '0.8rem 0'  }}>
          Bienvenido {user.name}!
        </p>
      </div>
    </body>
  )
}
