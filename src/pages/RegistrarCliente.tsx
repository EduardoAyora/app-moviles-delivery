import { IonButton, IonCol, IonContent, IonHeader, IonicSafeString, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';

export default function RegistrarCliente() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [present] = useIonToast();

  const presentToast = (position: 'top' | 'middle' | 'bottom', message: string | IonicSafeString | undefined) => {
    present({
      message: message,
      duration: 1500,
      position: position
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Registro de Cliente</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/create`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          if (!responseData.ok) {
            const response = await responseData.text();
            return presentToast('top', response)
          }
          const response = await responseData.json() as Cliente;
          presentToast('top', `Cliente ${response.nombre} creado con éxito`)
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Tipo de identificación</IonLabel>
            <IonSelect {...register('tipoIdentificacion')} placeholder="Tipo de identificación">
              <IonSelectOption value="CEDULA">Cédula</IonSelectOption>
              <IonSelectOption value="RUC">RUC</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Número de identificación</IonLabel>
            <IonInput {...register('identificacionNumero')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput {...register('nombre')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Dirección</IonLabel>
            <IonInput {...register('direccion')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Teléfono</IonLabel>
            <IonInput {...register('telefono')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Correo</IonLabel>
            <IonInput {...register('correoElectronico')} type="email" required></IonInput>
          </IonItem>
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
