# CADE Ejecutivos 2025 - Mobile App

Aplicación móvil para el evento CADE Ejecutivos 2025, desarrollada con React Native y Expo.

## 🚀 Tecnologías

- **React Native** con Expo SDK 53
- **Expo Router** para navegación
- **TypeScript** para tipado estático
- **NativeWind** (Tailwind CSS para React Native)
- **Axios** para llamadas HTTP
- **React Hook Form** + **Zod** para formularios
- **Expo Secure Store** para almacenamiento seguro
- **Socket.io** para chat en tiempo real
- **Lucide React Native** para iconos

## 📱 Funcionalidades

### ✅ Implementadas
- **Autenticación**: Login con JWT y refresh tokens
- **Navegación**: Tab navigation con 5 pantallas principales
- **Páginas principales**:
  - **Inicio**: Dashboard con sesiones destacadas
  - **Secciones**: Lista de todas las secciones del evento
  - **Speakers**: Directorio de ponentes
  - **Chat**: Asistente virtual con Watson
  - **Favoritos**: Sesiones marcadas como favoritas
- **Páginas de detalle**:
  - Detalle de sesión con speakers, documentos y resumen
  - Detalle de speaker (por implementar)
  - Detalle de sección (por implementar)
- **Recuperación de contraseña**: Flujo completo con OTP
- **Protección de rutas**: AuthGuard automático
- **UI/UX**: Diseño moderno con Tailwind CSS

### 🔄 Por implementar
- Conexión real con APIs del backend
- Notificaciones push
- Compartir contenido
- Descarga de documentos
- Chat en tiempo real funcional
- Páginas de detalle faltantes
- Funcionalidad de favoritos real

## ⚙️ Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://tu-backend-url:8080/api/v1

# Watson Assistant Configuration  
EXPO_PUBLIC_WATSON_ASSISTANT_ID=tu_assistant_id
EXPO_PUBLIC_WATSON_ASSISTANT_URL=tu_watson_url

# Environment
EXPO_PUBLIC_ENVIRONMENT=development
```

### 2. Instalación

```bash
# Instalar dependencias
npm install

# Para iOS, instalar pods (solo macOS)
cd ios && pod install && cd ..
```

### 3. Ejecutar la app

```bash
# Desarrollo
npm run start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Estructura del proyecto

```
cade-app-native/
├── app/                      # Rutas con Expo Router
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Página de inicio
│   │   ├── sections.tsx     # Lista de secciones
│   │   ├── speakers.tsx     # Lista de speakers
│   │   ├── chat.tsx         # Chat con Watson
│   │   └── favorites.tsx    # Sesiones favoritas
│   ├── session/[id].tsx     # Detalle de sesión
│   ├── speaker/[id].tsx     # Detalle de speaker
│   ├── section/[id].tsx     # Detalle de sección
│   ├── login.tsx            # Página de login
│   ├── change-password.tsx  # Recuperar contraseña
│   └── _layout.tsx          # Layout principal
├── components/              # Componentes reutilizables
│   ├── AuthGuard.tsx        # Guard de autenticación
│   └── ...
├── contexts/                # Contexts de React
│   └── AuthContext.tsx      # Context de autenticación
├── services/                # Servicios y APIs
│   ├── api/                 # Llamadas a APIs
│   └── config/              # Configuración de Axios
├── types/                   # Tipos TypeScript
├── constants/               # Constantes y configuración
└── assets/                  # Recursos estáticos
```

## 🔧 Integración con Backend

Para conectar con el backend:

1. **Actualizar URLs**: Modificar `EXPO_PUBLIC_API_URL` en `.env`
2. **Implementar APIs**: Completar los servicios en `services/api/`
3. **Manejar tokens**: Ya configurado con interceptors de Axios
4. **Error handling**: Implementar manejo de errores específicos

### APIs a implementar

```typescript
// services/api/sessions.ts
export const sessionsApi = {
  getAll: () => axiosClient.get('/sessions'),
  getById: (id: number) => axiosClient.get(`/sessions/${id}`),
  toggleFavorite: (id: number) => axiosClient.post(`/sessions/${id}/like`),
  // ...
};

// services/api/speakers.ts
export const speakersApi = {
  getAll: () => axiosClient.get('/speakers'),
  getById: (id: number) => axiosClient.get(`/speakers/${id}`),
  // ...
};
```

## 🎯 Siguientes pasos

1. **Conectar APIs reales** eliminando datos mock
2. **Implementar notificaciones push** con Expo Notifications
3. **Agregar funcionalidad de chat** con Socket.io
4. **Completar páginas de detalle faltantes**
5. **Añadir tests** unitarios y de integración
6. **Optimizar rendimiento** con lazy loading
7. **Configurar CI/CD** para builds automáticos

## 📚 Comandos útiles

```bash
# Limpiar cache
npx expo start --clear

# Build para producción
eas build --platform all

# Actualizar dependencias
npx expo install --fix

# Generar build local
npx expo run:ios --device
npx expo run:android --device
```

## 🐛 Troubleshooting

**Error de Metro bundler**: 
```bash
npx expo start --clear
```

**Problemas con NativeWind**:
```bash
npx tailwindcss -i ./global.css -o ./dist/output.css --watch
```

**Error de tipos TypeScript**:
```bash
npx tsc --noEmit
```

---

La app está lista para conectar con el backend y comenzar las pruebas. Todas las funcionalidades básicas están implementadas con datos mock que pueden ser fácilmente reemplazados por llamadas reales a la API.