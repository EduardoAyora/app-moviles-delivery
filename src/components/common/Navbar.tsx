import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

export default function Navbar({ children }: { children: any }) {
  const menuRef = useRef<HTMLIonMenuElement>(null);

  return (
    <>
      <IonMenu ref={menuRef} contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle className='navbar-container' style={{
              color: 'white',
              borderColor: '#848c98',
              borderBottom: '1px solid'
            }}>Menú</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className='navbar-container'>
            <div className="ion-padding">
              <ul className='navbar'>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/home'>Home</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/clientes'>Clientes</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/servicios'>Servicios</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/crear-factura'>Emitir factura</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/facturas'>Facturas</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/'>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {children}
        </IonContent>
      </IonPage>
    </>
  )
}
