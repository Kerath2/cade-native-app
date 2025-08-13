# Resumen de Pantallas - CADE 2025 App

## Estructura General de Navegación

La aplicación CADE 2025 utiliza **Expo Router** con navegación basada en archivos. La estructura principal es:

```
app/
├── _layout.tsx          # Root layout con AuthProvider y AuthGuard
├── login.tsx            # Pantalla de inicio de sesión
├── change-password.tsx  # Recuperación de contraseña (3 pasos)
├── (tabs)/              # Navegación por tabs (requiere autenticación)
│   ├── _layout.tsx      # Tab layout
│   ├── index.tsx        # Home/Inicio
│   ├── sections.tsx     # Agenda/Secciones
│   ├── speakers.tsx     # Expositores
│   ├── chat.tsx         # Chat con IA
│   └── favorites.tsx    # Más opciones
├── section/[id].tsx     # Detalle de sección
├── session/[id].tsx     # Detalle de sesión
└── speaker/[id].tsx     # Detalle de speaker
```

---

## Pantallas Principales

### 1. **Login** (`app/login.tsx`)

**Propósito**: Autenticación de usuarios

**Características**:
- Formulario con email y contraseña
- Validación de campos obligatorios
- Toggle para mostrar/ocultar contraseña (Eye/EyeOff icons)
- Botón "¿Olvidaste tu contraseña?" → navega a `/change-password`
- Loading state durante autenticación
- Logos de CADE en header y footer

**Flujo de navegación**:
- **Éxito** → `router.replace("/(tabs)")`
- **Recuperar contraseña** → `router.push("/change-password")`

**Llamadas a servicios**:
- `useAuth().login(email, password)` → `authApi.login()`

---

### 2. **Cambio de Contraseña** (`app/change-password.tsx`)

**Propósito**: Proceso de recuperación de contraseña en 3 pasos

**Características**:
- **Paso 1**: Ingreso de email para recibir código
- **Paso 2**: Verificación de código OTP de 4 dígitos
- **Paso 3**: Establecer nueva contraseña con confirmación
- Indicador visual de progreso (1, 2, 3 steps)
- Navegación hacia atrás entre pasos
- Validación de contraseñas coincidentes

**Flujo de navegación**:
- **Volver** → `router.back()` o paso anterior
- **Éxito** → `router.replace("/login")`

**API Calls** (TODO):
- Envío de OTP por email
- Verificación de código OTP
- Actualización de contraseña

---

## Tabs Principales (Requieren autenticación)

### 3. **Home/Inicio** (`app/(tabs)/index.tsx`)

**Propósito**: Dashboard principal con vista de carrusel de contenido

**Características**:
- Logo de CADE en header
- Carrusel de **primeras 5 secciones** con información de horarios
- Carrusel de **primeros 10 speakers** con fotos y datos
- Cards de "Ver todas" para navegar a listas completas
- Refresh control para actualizar datos
- Formateo de fechas y horas en español

**Flujo de navegación**:
- Cards de sección → `router.push(\`/section/\${item.id}\`)`
- Cards de speaker → `router.push(\`/speaker/\${item.id}\`)`
- "Ver todas" secciones → `router.push("/(tabs)/sections")`
- "Ver todos" speakers → `router.push("/(tabs)/speakers")`

**API Calls**:
- `sectionsApi.getSections()` (primeras 5)
- `speakersApi.getSpeakers()` (primeros 10)

---

### 4. **Agenda/Secciones** (`app/(tabs)/sections.tsx`)

**Propósito**: Lista completa de secciones del evento con búsqueda

**Características**:
- Barra de búsqueda en tiempo real
- Lista completa de secciones
- Filtrado por título y descripción
- Información de horarios y número de sesiones
- Estado vacío cuando no hay resultados
- Botón "Limpiar búsqueda"

**Flujo de navegación**:
- Card de sección → `router.push(\`/section/\${section.id}\`)`

**API Calls**:
- `sectionsApi.getSections()` (todas)

---

### 5. **Expositores** (`app/(tabs)/speakers.tsx`)

**Propósito**: Lista completa de speakers con búsqueda

**Características**:
- Barra de búsqueda por nombre, apellido, posición o país
- Avatares de speakers (imagen o placeholder)
- Filtrado en tiempo real
- Información de biografía
- Estado vacío cuando no hay resultados

**Flujo de navegación**:
- Card de speaker → `router.push(\`/speaker/\${speaker.id}\`)`

**API Calls**:
- `speakersApi.getSpeakers()` (todos)

---

### 6. **Chat** (`app/(tabs)/chat.tsx`)

**Propósito**: Chat con asistente virtual de CADE

**Características**:
- Interfaz de chat con mensajes del usuario y bot
- Mensaje de bienvenida personalizado con nombre del usuario
- Indicador de "Escribiendo..." durante respuestas
- Input multilinea con límite de 500 caracteres
- Timestamps en mensajes
- UI diferenciada para usuario (azul) y bot (gris)

**Estado actual**: 
- Implementación mock con respuestas simuladas
- TODO: Integración con Watson Assistant

**API Calls** (TODO):
- Integración con Watson Assistant para respuestas del chatbot

---

### 7. **Más** (`app/(tabs)/favorites.tsx`)

**Propósito**: Opciones adicionales y configuración

**Características**:
- Menú de opciones:
  - **Perfil** (próximamente)
  - **Favoritos** (próximamente) 
  - **Cerrar sesión** con confirmación
- Diseño tipo settings con iconos y descripciones
- Confirmación antes del logout

**Flujo de navegación**:
- **Logout** → `useAuth().logout()` → redirige a login

---

## Pantallas de Detalle

### 8. **Detalle de Sección** (`app/section/[id].tsx`)

**Propósito**: Información completa de una sección específica

**Características**:
- Header con título, fecha, hora y duración
- Descripción completa de la sección
- Lista de sesiones dentro de la sección
- Para cada sesión: título, descripción, horario, speakers
- Indicador "EN VIVO" para sesiones activas
- Tags de speakers clickeables

**Flujo de navegación**:
- **Volver** → `router.back()`
- **Sesión** → `router.push(\`/session/\${session.id}\`)`
- **Speaker** → `router.push(\`/speaker/\${speaker.id}\`)`
- **Ver todas las secciones** → `router.push("/(tabs)/sections")`

**Estado actual**: Datos mock, TODO API integration

---

### 9. **Detalle de Sesión** (`app/session/[id].tsx`)

**Propósito**: Información completa de una sesión específica

**Características**:
- Header con título, fecha, hora
- Indicador "EN VIVO" para sesiones activas
- Botones de acción: Favorito y Compartir
- Descripción completa
- Lista de speakers con enlaces a sus perfiles
- Documentos descargables (si disponibles)
- Resumen post-sesión (si disponible)
- Botón "Hacer una pregunta" (si está habilitado)

**Flujo de navegación**:
- **Speaker** → `router.push(\`/speaker/\${speaker.id}\`)`
- **Sección** → `router.push(\`/section/\${session.section.id}\`)`

**API Calls** (TODO):
- Toggle favorito
- Compartir funcionalidad

---

### 10. **Detalle de Speaker** (`app/speaker/[id].tsx`)

**Propósito**: Perfil completo del expositor

**Características**:
- Foto de perfil (o avatar placeholder)
- Nombre completo, posición, país
- Badge de tipo: Speaker/Anfitrión/Comité
- Biografía completa
- Lista de sesiones donde participa
- Navegación a sesiones específicas

**Flujo de navegación**:
- **Volver** → `router.back()`
- **Sesión** → `router.push(\`/session/\${session.id}\`)`
- **Ver todos los speakers** → `router.push("/(tabs)/speakers")`

**API Calls**:
- `speakersApi.getSpeakerById(id)` (real API call)

---

## Componentes y Servicios Clave

### AuthContext (`contexts/AuthContext.tsx`)

**Propósito**: Manejo centralizado de autenticación

**Funcionalidades**:
- Estado de usuario y loading
- Login/logout con gestión de tokens
- Almacenamiento seguro con `expo-secure-store`
- Refresh token automático
- Verificación de estado al iniciar la app

**Tokens manejados**:
- `accessToken` - para autenticación de API
- `refreshToken` - para renovación automática

### AuthGuard (`components/AuthGuard.tsx`)

**Propósito**: Control de acceso a rutas protegidas

**Lógica**:
- Rutas que requieren auth: `(tabs)/*`, `session/*`, `speaker/*`, `section/*`
- Redirige a `/login` si no autenticado en ruta protegida
- Redirige a `/(tabs)` si autenticado en ruta pública
- Muestra loading durante verificación de estado

### APIs (`services/api/`)

**Estructura**:
- `auth.ts` - Login, logout, refresh token
- `sections.ts` - CRUD de secciones
- `sessions.ts` - CRUD de sesiones  
- `speakers.ts` - CRUD de speakers
- `favorites.ts` - Manejo de favoritos

---

## Flujo de Navegación Completo

```
┌─ INICIO ─┐
│  Login   │
└─────┬────┘
      │ ✓ Auth
      ▼
┌─────────────── TABS (Autenticado) ───────────────┐
│                                                  │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Home   │  │ Sections │  │ Speakers │       │
│  │ (index) │  │          │  │          │       │
│  └────┬────┘  └─────┬────┘  └─────┬────┘       │
│       │             │             │             │
│       │             ▼             ▼             │
│       │      /section/[id]  /speaker/[id]       │
│       │             │             │             │
│       │             ▼             │             │
│       │      /session/[id] ◄──────┘             │
│       │                                         │
│  ┌─────────┐  ┌─────────┐                      │
│  │  Chat   │  │  Más    │                      │
│  │         │  │         │                      │
│  └─────────┘  └─────────┘                      │
│                     │                          │
│                     ▼ Logout                   │
└─────────────────────┼─────────────────────────┘
                      │
                      ▼
                ┌─────────┐
                │  Login  │
                └─────────┘
```

---

## Patrones de Diseño Utilizados

### 1. **File-based Routing** (Expo Router)
- Navegación automática basada en estructura de carpetas
- Parámetros dinámicos con `[id]`
- Groups con `(tabs)` para navegación por pestañas

### 2. **Context Pattern** 
- `AuthContext` para estado global de autenticación
- Hook personalizado `useAuth()`

### 3. **Guard Pattern**
- `AuthGuard` para protección de rutas
- Redirección automática según estado de autenticación

### 4. **API Layer Pattern**
- Servicios centralizados en `/services/api/`
- Axios client configurado
- Manejo de errores centralizado

### 5. **Responsive Cards**
- Carruseles horizontales con `FlatList`
- Cards reutilizables para diferentes tipos de contenido
- Estados de loading y error consistentes

---

## Tecnologías Principales

- **React Native** - Framework móvil
- **Expo Router** - Navegación
- **TypeScript** - Tipado estático
- **NativeWind** - Styling con Tailwind CSS
- **Expo Secure Store** - Almacenamiento seguro
- **Lucide React Native** - Iconografía
- **Axios** - Cliente HTTP

---

*Documentación generada automáticamente para la aplicación CADE 2025*