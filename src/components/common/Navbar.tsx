import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Navbar.css'

export default function Navbar({ children }: { children: any }) {
  return (
    <>
      <IonMenu contentId="main-content">
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
                  <Link to='/'>Home</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/registro-cliente'>Registrar Cliente</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/clientes'>Clientes</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/registro-servicio'>Registrar Servicio</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/servicios'>Servicios</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/crear-factura'>Emitir factura</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link to='/facturas'>Facturas</Link>
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
        <IonContent className="ion-padding">
          {children}
        </IonContent>
      </IonPage>
    </>
  )
}