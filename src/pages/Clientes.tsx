import { IonButton, IonIcon, IonicSafeString, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { createOutline, trashOutline } from 'ionicons/icons';

export default function Clientes() {
  const [present] = useIonToast();
  const [clients, setClients] = useState<Cliente[]>()

  const presentToast = (position: 'top' | 'middle' | 'bottom', message: string | IonicSafeString | undefined) => {
    present({
      message: message,
      duration: 1500,
      position: position
    });
  };

  const deleteClient = async (clientId: number) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/delete/${clientId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    presentToast('top', 'Cliente eliminado con éxito.')
    setClients(prev => prev?.filter((cliente) => cliente.id !== clientId))
  }

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/findAll`)
      if (!responseData.ok) {
        const response = await responseData.text();
        return presentToast('top', response)
      }
      const response = await responseData.json() as Cliente[];
      setClients(response)
    }
    fetchData()
  }, [])

  return (
    <div>
      {
        clients == null ? <IonSpinner></IonSpinner>
          :
          <div>
            {clients.map(({ nombre, identificacionNumero, id }, index) =>
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f7f7f7',
                color: 'black',
                borderColor: '#dedede',
                border: '1px solid',
                borderRadius: '5px',
                padding: '0 1rem'
              }}>
                <div>
                  <p>
                    Cliente: {identificacionNumero}
                  </p>
                  <p>
                    Nombre: {nombre}
                  </p>
                </div>
                <div>
                  <IonButton color='primary'>
                    <IonIcon icon={createOutline}></IonIcon>
                  </IonButton>
                  <IonButton onClick={() => deleteClient(id)} color='danger'>
                    <IonIcon icon={trashOutline}></IonIcon>
                  </IonButton>
                </div>
              </div>)}
          </div>
      }
    </div>
  )
}
