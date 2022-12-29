import { IonButton, IonCol, IonContent, IonHeader, IonicSafeString, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import user from '../lib/user';

export default function EmitirFactura() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [client, setClient] = useState<Cliente>()

  const inputClientRef = useRef<HTMLIonInputElement>(null)

  const [present] = useIonToast();

  const presentToast = (position: 'top' | 'middle' | 'bottom', message: string | IonicSafeString | undefined) => {
    present({
      message: message,
      duration: 1500,
      position: position
    });
  };

  const searchClient = async (ci: string | number) => {
    const usuarioResponse = await fetch(`${process.env.REACT_APP_API_URL}/cliente/findByCedula/${ci}`)
    if (!usuarioResponse.ok) {
      const response = await usuarioResponse.text();
      return presentToast('top', response)
    }
    const response = await usuarioResponse.json() as Cliente;
    setClient(response)
  }

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Factura</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          const currentDate = new Date()
          const currentDateString = currentDate.toISOString().split('T')[0]
          const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/create`, {
            body: JSON.stringify({
              ...data,
              usuarioId: user.id,
              fechaDeEmision: currentDateString,
              clienteId: client?.id,
              subtotal: 29.63,
              impuesto: 4.04,
              total: 33.67,
              detalles: [
                {
                  cantidad: 1,
                  precioUnitario: 30.67,
                  total: 30.67,
                  servicioId: 3
                }
              ]
            }),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          if (!responseData.ok) {
            const response = await responseData.text();
            return presentToast('top', response)
          }
          const response = await responseData.json() as Servicio;
          presentToast('top', `Factura ${response.id} creada con éxito`)

        })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IonItem style={{ paddingRight: '1rem' }} lines="full">
              <IonLabel position="floating">Cliente</IonLabel>
              <IonInput ref={inputClientRef} type="text" required></IonInput>
            </IonItem>
            <IonButton style={{ alignSelf: 'end' }} size="default" onClick={() =>
              inputClientRef.current?.value && searchClient(inputClientRef.current.value)
            } color="primary">
              Buscar Cliente
            </IonButton>
          </div>
          <IonRow>
            {client && <p style={{ fontSize: '1.1rem', paddingLeft: '1rem' }}>El cliente es: {client.nombre}</p>}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="primary" expand="block">Crear</IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  )
}



