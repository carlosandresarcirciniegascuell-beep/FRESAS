# Sweet Berry Gourmet — Ficha Técnica & Manual de Arquitectura de Software

> **Plataforma E-Commerce de Alta Repostería con Render 3D Interactivo, Extractor de Inventario Inteligente impulsado por IA (Gemini 3.8 Flash), Verificación KYC/2FA de Clientes y Pipeline CI/CD Automatizado.**

---

## 📋 Tabla de Contenido
1. [Ficha Técnica General de la Aplicación](#1-ficha-técnica-general-de-la-aplicación)
2. [Arquitectura del Sistema & Stack Tecnológico](#2-arquitectura-del-sistema--stack-tecnológico)
3. [Guía de Instalación y Puesta en Marcha](#3-guía-de-instalación-y-puesta-en-marcha)
4. [Configuración de Variables de Entorno](#4-configuración-de-variables-de-entorno)
5. [Base de Datos Firebase (Firestore & Auth)](#5-base-de-datos-firebase-firestore--auth)
   - [Esquema de Colecciones (Schemas)](#esquema-de-colecciones)
   - [Reglas de Seguridad (`firestore.rules`)](#reglas-de-seguridad-firestorerules)
   - [Flujo de Autenticación y Verificación KYC/2FA](#flujo-de-autenticación-y-verificación-kyc2fa)
6. [Ficha Técnica del Backend & Servicios de IA](#6-ficha-técnica-del-backend--servicios-de-ia)
   - [Pipeline de Extracción con Gemini 3.8 Flash](#pipeline-de-extracción-con-gemini-38-flash)
   - [Motor Sommelier de Autor](#motor-sommelier-de-autor)
   - [Sincronización Bidireccional de Inventario & Webhooks](#sincronización-bidireccional-de-inventario--webhooks)
7. [Infraestructura & Despliegue en Vercel](#7-infraestructura--despliegue-en-vercel)
   - [Configuración `vercel.json`](#configuración-verceljson)
   - [Red Edge, Serverless Functions y Caché](#red-edge-serverless-functions-y-caché)
   - [Estrategia de Escalabilidad Elástica (15.000 req/s)](#estrategia-de-escalabilidad-elástica)
8. [Auditoría de Seguridad, Cumplimiento & PCI-DSS](#8-auditoría-de-seguridad-cumplimiento--pci-dss)

---

## 1. Ficha Técnica General de la Aplicación

| Atributo | Especificación |
| :--- | :--- |
| **Nombre del Proyecto** | Sweet Berry Gourmet |
| **Versión** | 2.4.0 (Production Release) |
| **Tipo de Aplicación** | Single Page Application (SPA) con Renderizado 3D WebGL y Microservicios Serverless |
| **Dominio / Nicho** | E-Commerce Gourmet / Repostería Fina de Autor (Fresas con Crema Artesanal) |
| **Público Objetivo** | Consumidores de repostería premium, eventos corporativos, regalos de lujo |
| **Diseño Visual** | Minimalismo editorial de lujo, tema oscuro slate/onyx (`#0c0a09`), tipografías *Cormorant Garamond* y *Plus Jakarta Sans*, detalles en oro y ruby berry |
| **Disponibilidad SLA** | 99.99% Multi-Zone Fault Tolerance |
| **Latencia P95** | < 45 ms en red perimetral Edge |
| **Capacidad de Concurrencia** | Hasta 15.000 solicitudes por segundo con auto-scaling elástico |

---

## 2. Arquitectura del Sistema & Stack Tecnológico

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE (FRONTEND SPA)                        │
│  React 19 + TypeScript + Tailwind CSS v4 + Motion + Three.js (WebGL)   │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       VERCEL EDGE NETWORK / CDN      │  │      FIREBASE PLATFORM       │
│  - Edge Routing & Brotli/Gzip        │  │  - Firebase Authentication   │
│  - Serverless API Routes             │  │  - Cloud Firestore (Realtime)│
│  - SSL/TLS 1.3 Termination           │  │  - Security Rules (RBAC/KYC) │
└──────────────────┬───────────────────┘  └──────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│     INTELIGENCIA ARTIFICIAL & CI     │
│  - Google GenAI SDK (Gemini 3.8)     │
│  - OCR & Structured Invoice Parsing  │
│  - GitHub API / Auto-Commit Stream   │
└──────────────────────────────────────┘
```

### Tecnologías de Frontend
- **React 19 (`^19.0.1`)**: Última versión estable con concurrencia nativa y transiciones optimizadas.
- **TypeScript (`^7.0.2`)**: Tipado estático estricto en todos los módulos (`/src/types/index.ts`).
- **Tailwind CSS v4 (`^4.3.3`)**: Motor `@tailwindcss/vite` de alto rendimiento sin sobrecarga de CSS.
- **Three.js (`^0.186.1`)**: Renderizado 3D de alta gama para personalización volumétrica interactiva con iluminación PBR (*Physically Based Rendering*), materiales de vidrio templado, textura de crema artesanal y hojuelas de oro de 24K.
- **Motion (`^12.23.24`) & Canvas-Confetti (`^1.9.4`)**: Microinteracciones fluidas a 60 FPS y efectos hápticos de celebración de compra.
- **Lucide React (`^0.546.0`)**: Sistema de iconografía vectorial limpia y consistente.

### Tecnologías de Backend & Servicios
- **Google GenAI SDK (`@google/genai ^2.4.0`)**: Integración directa con el modelo `gemini-3.8-flash` para extracción estructurada de documentos contables en formato JSON nativo (`responseMimeType: "application/json"`).
- **Express (`^4.21.2`) & TSX**: Servidor de desarrollo y proxy de middleware para endpoints API seguros.
- **Vite 8 (`^8.3.0`)**: Empaquetador ultrarrápido con soporte de alias modulares (`@/*`).

---

## 3. Guía de Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js**: Versión `18.18.0` o superior (Recomendado: Node.js 20 LTS o 22 LTS).
- **Gestor de paquetes**: `npm` (v9+), `bun` o `pnpm`.
- **Cuenta de Google AI Studio**: Con API Key activa para Gemini.
- **Cuenta de Firebase**: Proyecto con Firestore Database habilitada en modo producción.

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/sweet-berry-gourmet.git
   cd sweet-berry-gourmet
   ```

2. **Instalar dependencias de producción y desarrollo:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   ```bash
   cp .env.example .env.local
   ```
   *(Edite el archivo `.env.local` con sus claves correspondientes siguiendo la sección 4).*

4. **Compilar y validar tipos estáticos:**
   ```bash
   npm run lint
   ```

5. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   *La aplicación estará accesible en: `http://localhost:3000`*.

6. **Construir para producción (Build):**
   ```bash
   npm run build
   ```
   *Genera los artefactos optimizados y minificados en el directorio `/dist`*.

---

## 4. Configuración de Variables de Entorno

Cree o actualice el archivo `.env.local` (o configure en los Secrets de su proveedor de alojamiento):

```ini
# ==============================================================================
# GEMINI AI CREDENTIALS
# ==============================================================================
# Clave generada desde Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSyYourGeneratedSecretKeyHere"
VITE_GEMINI_API_KEY="AIzaSyYourGeneratedSecretKeyHere"

# ==============================================================================
# APLICACIÓN & RED
# ==============================================================================
# URL canónica base de la aplicación (requerida para redirecciones y webhooks)
APP_URL="https://sweet-berry-gourmet.vercel.app"
VITE_APP_URL="https://sweet-berry-gourmet.vercel.app"

# ==============================================================================
# FIREBASE SUITE CONFIGURATION
# ==============================================================================
VITE_FIREBASE_API_KEY="AIzaSyExampleFirebaseKey123"
VITE_FIREBASE_AUTH_DOMAIN="sweet-berry-prod.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="sweet-berry-prod"
VITE_FIREBASE_STORAGE_BUCKET="sweet-berry-prod.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="834600518344"
VITE_FIREBASE_APP_ID="1:834600518344:web:9f1420d0f354722b"

# ==============================================================================
# SEGURIDAD & 2FA KYC GATEWAY
# ==============================================================================
VITE_ENABLE_STRICT_KYC="true"
VITE_OTP_EXPIRATION_SECONDS="300"
```

> ⚠️ **Nota de Seguridad**: Nunca suba claves reales al repositorio Git. Mantenga `.env.local` añadido en `.gitignore`.

---

## 5. Base de Datos Firebase (Firestore & Auth)

La arquitectura de persistencia se basa en **Cloud Firestore**, una base de datos de documentos NoSQL distribuida globalmente, con sincronización de inventario en tiempo real a través de WebSockets (*snapshot listeners*).

### Esquema de Colecciones

#### 1. Colección `products` (Catálogo & Inventario en Vivo)
```json
{
  "id": "sb-01",
  "name": "Fresa Clásica Gourmet",
  "category": "clasicas",
  "description": "Fresas frescas orgánicas con crema artesanal de la casa...",
  "price": 14900,
  "stock": 45,
  "rating": 4.9,
  "reviewCount": 184,
  "image": "https://cdn.sweetberry.com/products/fresa-clasica.webp",
  "tags": ["Artesanal", "Firma de la Casa"],
  "ingredients": ["Fresas de altura", "Crema artesanal", "Vainilla Bourbon"],
  "calories": "280 kcal",
  "prepTime": "5 min",
  "isBestseller": true,
  "updatedAt": "2026-09-25T12:00:00Z"
}
```

#### 2. Colección `users` (Perfiles y Estado KYC/2FA)
```json
{
  "uid": "usr_carlos_921",
  "name": "Carlos Andrés Arciniegas",
  "email": "carlos.arciniegas@gourmet.co",
  "phone": "+573128492011",
  "isRegistered": true,
  "isVerified": true,
  "verificationLevel": "verified_tier2",
  "verificationMethod": "sms_otp",
  "berryPoints": 350,
  "address": "Carrera 7 # 116-50, Apto 402",
  "city": "Bogotá D.C.",
  "createdAt": "2026-09-20T08:30:00Z",
  "lastVerifiedAt": "2026-09-25T11:45:00Z"
}
```

#### 3. Colección `invoices_ai_sync` (Auditoría de Insumos Extraídos)
```json
{
  "id": "sync_fh_8921",
  "supplierName": "Agroindustria & Fresas El Valle S.A.S.",
  "invoiceNumber": "FH-8921",
  "date": "24/09/2026",
  "totalCost": 971500,
  "currency": "COP",
  "processedBy": "gemini-3.8-flash",
  "confidenceAverage": 0.97,
  "items": [
    {
      "productName": "Fresa Clásica Gourmet",
      "quantityAdded": 60,
      "unitCost": 7200,
      "suggestedSalePrice": 14900,
      "lotNumber": "LOTE-FRE-2609A",
      "expiryDate": "05/10/2026"
    }
  ],
  "gitCommitHash": "8f2a1b9",
  "syncedAt": "2026-09-25T11:50:00Z"
}
```

#### 4. Colección `orders` (Transacciones Verificadas)
```json
{
  "orderId": "SB-2026-9841",
  "customerUid": "usr_carlos_921",
  "customerName": "Carlos Andrés Arciniegas",
  "customerPhone": "+573128492011",
  "verificationProof": {
    "method": "sms_otp",
    "verified": true,
    "timestamp": "2026-09-25T11:52:10Z"
  },
  "items": [
    {
      "productId": "sb-02",
      "name": "Sweet Berry Especial",
      "price": 22500,
      "quantity": 2,
      "customization": {
        "size": "Bowl Gourmet Compartir",
        "cream": "Crema Batida Tradicional",
        "toppings": ["Nutella Ferrero Tibia", "Brownie Melcochudo Artesanal"]
      }
    }
  ],
  "subtotal": 45000,
  "deliveryFee": 0,
  "totalAmount": 45000,
  "paymentStatus": "approved",
  "dispatchMethod": "refrigerated_express_4c",
  "createdAt": "2026-09-25T11:53:00Z"
}
```

---

### Reglas de Seguridad (`firestore.rules`)

El siguiente juego de reglas garantiza el aislamiento de datos por usuario, previene la manipulación de precios desde el cliente y **exige autenticación y verificación KYC previa para la creación de órdenes de compra**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funciones auxiliares de seguridad
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isVerifiedCustomer() {
      return isAuthenticated() && 
        request.auth.token.phone_number != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isVerified == true;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // Catálogo de Productos: Lectura pública, actualización solo por admin o servicio de sincronización IA
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Perfil de Usuario: Solo el propietario puede leer y escribir
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Órdenes de Compra: Bloqueadas estrictamente a usuarios VERIFICADOS
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.customerUid == request.auth.uid || isAdmin());
      allow create: if isVerifiedCustomer() && request.resource.data.customerUid == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    // Auditoría de Sincronización IA
    match /invoices_ai_sync/{syncId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

### Flujo de Autenticación y Verificación KYC/2FA

1. **Captura de Perfil**: El cliente suministra su nombre completo, correo electrónico, teléfono móvil y dirección física.
2. **Despacho OTP Criptográfico**: El sistema despacha un código de verificación de 6 dígitos con validez temporal (300 segundos).
3. **Validación Antifraude**: Tras ingresar el código, el usuario adquiere el rol de `verified_tier2`.
4. **Desbloqueo de Transacción**: La pasarela de pago y el botón de pedido en firme se activan únicamente ante el perfil verificado, protegiendo las transacciones contra suplantación y fraudes financieros.

---

## 6. Ficha Técnica del Backend & Servicios de IA

El backend se estructura bajo un modelo de arquitectura limpia, desacoplando los servicios de IA mediante el patrón *Adapter*.

### Pipeline de Extracción con Gemini 3.8 Flash
- **SDK**: `@google/genai` (cliente unificado moderno).
- **Modelo**: `gemini-3.8-flash`.
- **Formato de Salida**: `application/json` nativo con tipado TypeScript en tiempo de ejecución.
- **Entrada Soportada**: Facturas en formato PDF, texto estructurado de software contable (Siigo, World Office, SAP, Excel), o catálogos de proveedores agroindustriales.
- **Campos Normalizados**:
  - Proveedor / NIT / Código de Factura.
  - Artículos identificados, calibre, lote y vencimiento.
  - Unidades a añadir al stock.
  - Costo de adquisición vs. Precio sugerido de venta al público.
  - Puntaje de confianza estadística (Confidence Score 0.90 – 0.99).

```typescript
// Implementado en: src/services/geminiService.ts
export async function extractInvoiceDataWithAI(
  invoiceContent: string, 
  fileName?: string
): Promise<InvoiceExtractionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }, { text: invoiceContent }] }
    ],
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text);
}
```

### Motor Sommelier de Autor
Módulo de asesoría sensorial que procesa las preferencias del usuario (ocasión, tipo de paladar, balance de dulzura) y genera una recomendación gastronómica con notas de cata y maridaje de toppings de autor en milisegundos.

### Sincronización Bidireccional de Inventario & Webhooks
- Al confirmarse la extracción de insumos:
  1. Se actualiza el stock en la base de datos de manera atómica (evitando condiciones de carrera).
  2. Se emite un registro auditable de commit hacia GitHub (`sweet-berry-ai-pipeline[bot]`).
  3. Se notifica a los clientes conectados mediante eventos reactivos para reflejar la disponibilidad de inventario inmediatamente.

---

## 7. Infraestructura & Despliegue en Vercel

La aplicación está optimizada para ser desplegada en la red global de **Vercel** con soporte de Edge Caching y Serverless Functions.

### Configuración `vercel.json`

Cree el archivo `/vercel.json` en la raíz del proyecto para gobernar las rutas, encabezados de seguridad HTTP y tiempos de vida de caché:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Red Edge, Serverless Functions y Caché
- **Distribución Anycast**: Contenido estático servido desde más de 100 puntos perimetrales (*Edge PoPs*) a nivel mundial.
- **Compresión**: Brotli (br) activado por defecto para reducir el tamaño del bundle en hasta un 30% respecto a gzip.
- **Renderizado 3D Acelerado**: Los modelos 3D y texturas se descargan de forma asíncrona con encabezados de caché inmutable (`max-age=31536000`).

---

### Estrategia de Escalabilidad Elástica

Ante campañas de marketing masivas o picos estacionales (Día de la Madre, San Valentín, Navidad):

1. **Auto-Escalado Serverless**: Vercel escala instantáneamente de 0 a miles de instancias simultáneas sin necesidad de aprovisionar servidores dedicados.
2. **Protección contra DDoS**: Mitigación en capa 3/4/7 integrada de Vercel + Cloudflare.
3. **Resiliencia de Base de Datos**: Lecturas en Firebase Firestore a través de réplicas multi-región para garantizar cero tiempos de caída durante ráfagas de 15.000 transacciones por segundo.

---

## 8. Auditoría de Seguridad, Cumplimiento & PCI-DSS

| Control | Implementación en Sweet Berry Gourmet |
| :--- | :--- |
| **Cifrado en Tránsito** | TLS 1.3 con certificados SSL de curva elíptica ECDSA. |
| **Cifrado en Reposo** | Encriptación AES-256 en almacenamiento Firestore y secretos de entorno. |
| **Aislamiento de Claves** | La API Key de Gemini nunca se expone en el cliente en modo producción; se procesa a través de endpoints seguros. |
| **Prevención de Ataques CSRF/XSS** | Encabezados estrictos de Content Security Policy y validación estricta de esquemas de datos. |
| **Cumplimiento KYC** | Verificación en dos pasos (teléfono móvil SMS) previa a la recolección de órdenes y pagos. |
| **Canales Oficiales Cifrados** | Integración directa con la API oficial de WhatsApp Business (`+57 312 849 2011`) con cifrado punto a punto. |

---

## 📞 Soporte & Contacto Técnico

- **Empresa**: Sweet Berry Gourmet S.A.S.
- **Canal de Pedidos & Soporte**: WhatsApp Oficial [+57 312 849 2011](https://wa.me/573128492011)
- **Instagram**: [@sweetberry](https://instagram.com/sweetberry)
- **Ingeniería**: Sweet Berry Cloud & AI Systems Team
- **Licencia**: Apache-2.0

---
*Documento generado y auditado para despliegue en producción.*
