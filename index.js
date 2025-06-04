"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const genai_1 = require("@google/genai");
// --- Configuración de Express ---
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']; // Orígenes de tu frontend (ajusta según sea necesario)
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
// Middleware para parsear JSON en las solicitudes
app.use(express_1.default.json());
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
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un campo "message".' });
        }
        // --- Configuración de la API de Gemini ---
        const ai = new genai_1.GoogleGenAI({
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
        return res.status(200).json({ message: response.text });
    }
    catch (error) {
        console.error('Error al comunicarse con la API de Gemini:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
});
exports.geminiBotFunction = app;
// Iniciar el servidor
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
        console.log(`Endpoint de chat: http://localhost:${port}/chat`);
        console.log('¡Esta es la ejecución LOCAL!');
    });
}
else {
    // Esto se ejecutará en Cloud Functions, pero no hará nada porque el Framework
    // ya está iniciando el servidor con la instancia de 'app' exportada.
    console.log('Ejecutándose en entorno de Cloud Functions (producción).');
}
