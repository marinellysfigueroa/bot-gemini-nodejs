// npm install @google/genai mime
// npm install -D @types/node
import 'dotenv/config'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as express from 'express'; 
import cors from 'cors';

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  // --- Configuración de Express ---
const app = express.default();
const port = process.env.PORT || 3001; // Puerto para el servidor local

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']; // Orígenes de tu frontend (ajusta según sea necesario)

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());
  

// --- Configuración de la API de Gemini ---
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('Error: La variable de entorno GEMINI_API_KEY no está definida.');
    // En desarrollo local, salir para que el error sea obvio.
    // En Cloud Functions, asegúrate de que la variable esté configurada en el despliegue.
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
}

app.post('/chat', async (req: express.Request, res: express.Response) => { 

    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un campo "message".' });
        }

// --- Configuración de la API de Gemini ---
          const ai = new GoogleGenAI({
              apiKey: API_KEY,
            });
            const model = 'gemini-2.5-pro-preview-05-06';
            const contents = userMessage;

        
  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: "Eres un asistente de running. Proporciona consejos, tips de entrenamiento, motivación y responde preguntas específicamente relacionadas con correr, desde principiantes hasta maratonistas. Mantén tus respuestas concisas y motivadoras. Si una pregunta no es sobre correr, amablemente indica que solo puedes asistir con temas relacionados con correr.",
    },
  });

      return  res.status(200).json({ message: response.text });

        
    } catch (error) {
        console.error('Error al comunicarse con la API de Gemini:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
    console.log(`Endpoint de chat: http://localhost:${port}/chat`);
});

};

main();
