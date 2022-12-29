import { IonButton, IonIcon, IonicSafeString, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { createOutline, trashOutline } from 'ionicons/icons';
import RegistrarCliente from "./RegistrarCliente";
import RegistrarServicio from "./RegistrarServicio";
import user from "../lib/user";

export default function Servicios() {
  const [present] = useIonToast();
  const [services, setServices] = useState<Servicio[]>()
  const [serviceEdited, setServiceEdited] = useState<Servicio>()

  const presentToast = (position: 'top' | 'middle' | 'bottom', message: string | IonicSafeString | undefined) => {
    present({
      message: message,
      duration: 1500,
      position: position
    });
  };

  const deleteClient = async (serviceId: number) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/delete/${serviceId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    presentToast('top', 'Servicio eliminado con éxito.')
    setServices(prev => prev?.filter((service) => service.id !== serviceId))
  }

  const fetchData = async () => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/findAll/${user.id}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    const response = await responseData.json() as Servicio[];
    setServices(response)
  }

  const editService = (index: number) => {
    return (editedClient?: Servicio) => {
      setServiceEdited(undefined)
      if (!editedClient) return
      setServices(prev => prev?.map(client => client.id === index ? editedClient : client))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="ion-padding">
      {
        services == null ? <IonSpinner></IonSpinner>
          :
          serviceEdited ? <RegistrarServicio service={serviceEdited} editService={editService(serviceEdited.id)} /> :
            <div>
              {services.map((service, index) =>
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f7f7f7',
                  color: 'black',
                  borderColor: '#dedede',
                  border: '1px solid',
                  borderRadius: '5px',
                  padding: '0 1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ maxWidth: '60%' }}>
                    <p>
                      Servicio: {service.id}
                    </p>
                    <p>
                      Descripción: {service.descripcion}
                    </p>
                  </div>
                  <div>
                    <IonButton onClick={() => setServiceEdited(service)} color='primary'>
                      <IonIcon icon={createOutline}></IonIcon>
                    </IonButton>
                    <IonButton onClick={() => deleteClient(service.id)} color='danger'>
                      <IonIcon icon={trashOutline}></IonIcon>
                    </IonButton>
                  </div>
                </div>)}
            </div>
      }
    </div>
  )
}

