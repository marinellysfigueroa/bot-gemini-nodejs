### Bot Asistente de Running con Gemini (Backend)
Este repositorio contiene el código fuente del backend para un Bot Asistente de Running, impulsado por la API de Google Gemini y desarrollado con Node.js y TypeScript.

La aplicación está diseñada para procesar solicitudes de chat de un frontend, interactuar con los modelos de lenguaje grandes de Gemini y ofrecer consejos personalizados sobre running.

## Características Principales
* Integración con Gemini API: Utiliza el modelo gemini-pro para generar respuestas inteligentes y relevantes.
* Desarrollado con TypeScript: Código robusto y tipado para una mejor mantenibilidad.
* Servidor Express.js: Maneja las solicitudes HTTP y enruta las interacciones del chat.
* Manejo de CORS: Configuración para comunicación segura con aplicaciones frontend.
* Despliegue en Google Cloud Functions (Gen2): Optimizado para una ejecución sin servidor, escalable y eficiente.

## Tecnologías Utilizadas
* Node.js
* TypeScript
* Express.js
* @google/genai SDK
* dotenv
* cors


## Configuración y Ejecución Local
Sigue estos pasos para configurar y ejecutar el backend en tu entorno de desarrollo local.

# Requisitos
* Node.js (v18 o superior) y npm instalados.
* Una clave de API de Gemini (obtenida de Google AI Studio).
* Google Cloud SDK (gcloud CLI) instalado y autenticado para credenciales locales.

# Pasos
Clonar el Repositorio:

git clone [<URL_DE_TU_REPOSITORIO>](https://github.com/marinellysfigueroa/bot-gemini-nodejs.git)
cd bot-gemini-typescript

Instalar Dependencias:

npm install

Configurar Variables de Entorno:
Crea un archivo .env en la raíz del proyecto y añade tu clave de API de Gemini:

GEMINI_API_KEY=TU_CLAVE_DE_API_DE_GEMINI_AQUI

¡Importante! Reemplaza TU_CLAVE_DE_API_DE_GEMINI_AQUI con tu clave real.

Autenticar Credenciales de Aplicación Predeterminadas (ADC):
Para que la librería de Gemini acceda a Vertex AI localmente, necesitas autenticar gcloud:

gcloud auth login

Sigue las instrucciones en el navegador.

Compilar y Ejecutar el Servidor Local:

npm start

El servidor se iniciará en http://localhost:3001 (o el puerto configurado).

### Despliegue en Google Cloud Functions
Para desplegar este backend como una función sin servidor en GCP.

## Requisitos de GCP
Un proyecto de Google Cloud con facturación habilitada.

Las siguientes APIs habilitadas en tu proyecto:

Cloud Functions API

Cloud Build API

Artifact Registry API

Vertex AI API

La cuenta de servicio predeterminada de Compute Engine (ej. [NUMERO_DE_PROYECTO]-compute@developer.gserviceaccount.com) debe tener el rol Usuario de Vertex AI.

Pasos de Despliegue
Compilar el Código:
Asegúrate de que tu código TypeScript esté compilado a JavaScript:

npm run build

Desplegar la Función:
Desde la raíz de tu proyecto, ejecuta el comando gcloud. Asegúrate de reemplazar TU_CLAVE_DE_API_DE_GEMINI_AQUI con tu clave real y ajusta la region si es necesario.

gcloud functions deploy geminiBotFunction \
--gen2 \
--runtime nodejs20 \
--region us-central1 \
--source . \
--entry-point geminiBotFunction \
--trigger-http \
--allow-unauthenticated \
--set-env-vars GEMINI_API_KEY=TU_CLAVE_DE_API_DE_GEMINI_AQUI \
--memory 256MB \
--timeout 30s

Obtener la URL de la Función:
Una vez desplegada, la terminal te proporcionará la URL del activador (Trigger URL) de tu función. Será algo como: https://[REGION]-[ID_DE_PROYECTO].cloudfunctions.net/geminiBotFunction.

## Cómo Probar el Backend
Prueba Local (después de npm start)
Utiliza curl o Postman para enviar una solicitud POST:

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cómo evito las lesiones al correr?"}' \
  http://localhost:3001/chat

Prueba en la Nube (después del despliegue)
Utiliza curl o Postman con la URL de tu función desplegada (recuerda añadir /chat al final):

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cómo evito las lesiones al correr?"}' \
  https://[REGION]-[ID_DE_PROYECTO].cloudfunctions.net/geminiBotFunction/chat
