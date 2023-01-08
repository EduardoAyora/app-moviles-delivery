import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonicSafeString, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { addCircle, addCircleOutline, addOutline, createOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import user from '../lib/user';
import './EmitirFactura.css'

export default function EmitirFactura() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory()
  const [client, setClient] = useState<Cliente>()
  const [details, setDetails] = useState<DetalleFactura[]>([])
  const [services, setServices] = useState<Servicio[]>([])

  const inputClientRef = useRef<HTMLIonInputElement>(null)

  const [present] = useIonToast();

  const fetchServices = async () => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/findAll/${user.id}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Servicio[];
    setServices(response)
  }

  const presentToast = (
    message: string | IonicSafeString | undefined,
    success: boolean
  ) => {
    present({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: success ? 'success' : 'danger'
    });
  };

  const searchClient = async (ci: string | number) => {
    const usuarioResponse = await fetch(`${process.env.REACT_APP_API_URL}/cliente/findByCedula/${ci}`)
    if (!usuarioResponse.ok) {
      const response = await usuarioResponse.text();
      return presentToast(response, false)
    }
    const response = await usuarioResponse.json() as Cliente;
    setClient(response)
  }

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
    fetchServices()
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  const subtotal = details.reduce((prev, { total }) => prev + total, 0)
  const impuesto = subtotal * 0.12

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
          const subtotal = details.reduce(
            (prev, { total }) => prev + total, 0)
          const impuesto = subtotal * 0.12
          const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/create`, {
            body: JSON.stringify({
              ...data,
              usuarioId: user.id,
              fechaDeEmision: currentDateString,
              clienteId: client?.id,
              subtotal,
              impuesto,
              total: subtotal + impuesto,
              detalles: details
            }),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          if (!responseData.ok) {
            const response = await responseData.text();
            return presentToast(response, false)
          }
          const response = await responseData.json() as Servicio;
          presentToast(`Factura ${response.id} creada con éxito`, true)
          history.push("/facturas")
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
              <IonButton id="open-modal" color="primary" expand="block">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={addOutline}></IonIcon>
                  Agregar Servicio
                </div>
              </IonButton>
            </IonCol>
          </IonRow>

          {details.length > 0 && <IonGrid>
            <IonRow className='row header'>
              <IonCol className='col'>Id Servicio</IonCol>
              <IonCol className='col'>Cantidad</IonCol>
              <IonCol className='col'>Total</IonCol>
            </IonRow>
            {details.map(
              (detail) =>
                <IonRow className='row'>
                  <IonCol className='col'>{detail.servicioId}</IonCol>
                  <IonCol className='col'>{detail.cantidad}</IonCol>
                  <IonCol className='col'>${detail.total.toFixed(2)}</IonCol>
                </IonRow>)
            }
          </IonGrid>}

          <IonRow>
            <IonCol>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Iva: ${impuesto.toFixed(2)}</p>
              <p>Total: ${(subtotal + impuesto).toFixed(2)}</p>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton type="submit" color="success" expand="block">Crear Factura</IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>

      <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Seleccionar Servicio</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => dismiss()}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {services.map((service, i) =>
              <IonItem key={i} onClick={() => {
                setDetails(prev => [...prev, {
                  cantidad: 1,
                  precioUnitario: service.precioUnitario,
                  total: service.precioUnitario,
                  servicioId: service.id
                }])
                dismiss()
              }}>
                <IonLabel>
                  <h2>{service.descripcion}</h2>
                  <p>${service.precioUnitario}</p>
                </IonLabel>
              </IonItem>)}
          </IonList>
        </IonContent>
      </IonModal>

    </IonPage>
  )
}



