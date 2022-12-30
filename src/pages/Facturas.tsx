import { IonButton, IonIcon, IonicSafeString, IonItem, IonList, IonSelect, IonSelectOption, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { closeCircleOutline, createOutline, trashOutline } from 'ionicons/icons';
import user from "../lib/user";

export default function Facturas() {
  const [present] = useIonToast();
  const [facturas, setFacturas] = useState<Factura[]>()
  const [isShowingCanceled, setIsShowingCanceled] = useState(false)

  const presentToast = (position: 'top' | 'middle' | 'bottom', message: string | IonicSafeString | undefined) => {
    present({
      message: message,
      duration: 1500,
      position: position
    });
  };

  const cancelInvoice = async (invoiceId: number) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/cancel/${invoiceId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    presentToast('top', 'Factura anulada con éxito.')
    setFacturas(prev => prev?.filter((factura) => factura.id !== invoiceId))
  }

  const fetchIssuedInvoices = async () => {
    setFacturas(undefined)
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/findAll/issued/${user.id}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    const response = await responseData.json() as Factura[];
    setIsShowingCanceled(false)
    setFacturas(response)
  }

  const fetchCanceledInvoices = async () => {
    setFacturas(undefined)
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/findAll/cancel/${user.id}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast('top', response)
    }
    const response = await responseData.json() as Factura[];
    setIsShowingCanceled(true)
    setFacturas(response)
  }

  useEffect(() => {
    fetchIssuedInvoices()
  }, [])

  return (
    <div className="ion-padding">
      <IonList>
        <IonItem>
          <IonSelect onIonChange={(e) => {
            if (e.target.value === 'issued') fetchIssuedInvoices()
            else fetchCanceledInvoices()
          }
          } interface="popover" placeholder="Emitidas">
            <IonSelectOption value="issued">Emitidas</IonSelectOption>
            <IonSelectOption value="canceled">Canceladas</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
      {
        facturas == null ? <IonSpinner></IonSpinner>
          :
          <div>
            {facturas.map((factura, index) =>
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
                    Factura: {factura.id}
                  </p>
                  <p>
                    Total: ${factura.total}
                  </p>
                </div>
                <div>
                  {!isShowingCanceled &&
                    <IonButton onClick={() => cancelInvoice(factura.id)} color='danger'>
                      <IonIcon icon={closeCircleOutline}></IonIcon>
                      Anular
                    </IonButton>}
                </div>
              </div>)}
          </div>
      }
    </div>
  )
}

