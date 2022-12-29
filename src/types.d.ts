interface Usuario {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface Cliente {
  id: number;
  tipoIdentificacion: string;
  identificacionNumero: string;
  nombre: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
}