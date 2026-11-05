/* ============================================================
   server.js — Proxy seguro para el tutor de IA
   Proyecto 6 · Sistemas ERP con Odoo · EduIA
   ------------------------------------------------------------
   Este pequeño servidor guarda la clave de la IA como VARIABLE
   DE ENTORNO (nunca en el código) y recibe las preguntas del
   navegador. Así la clave jamás llega al usuario.

   Uso local:
     npm install
     GROQ_API_KEY=gsk_xxx npm start

   Despliegue: Render, Railway, Vercel (Node) o cualquier hosting
   que permita variables de entorno. Configura GROQ_API_KEY en el
   panel del hosting, NO en el repositorio.
   ============================================================ */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// La clave SOLO se lee del entorno. Si no existe, el servidor avisa.
const API_KEY = process.env.GROQ_API_KEY || '';
const MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
const AI_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT =
  'Eres un tutor de sistemas ERP para estudiantes de bachillerato de El Salvador. ' +
  'Explicas con una empresa salvadoreña, por ejemplo una distribuidora de productos o una pulpería, ' +
  'y muestras cómo un dato pasa de un módulo a otro, en pasos cortos. ' +
  'Usas lenguaje sencillo y ejemplos locales. NUNCA entregas la tarea completa de golpe: explicas, ' +
  'das una pista y terminas con UNA pregunta corta para comprobar que el estudiante entendió. ' +
  'Responde SIEMPRE en español.';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Sirve la página web (opcional, si despliegas todo junto)
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(API_KEY), model: MODEL });
});

app.post('/api/tutor', async (req, res) => {
  try {
    const message = (req.body && req.body.message) || '';
    const history = Array.isArray(req.body && req.body.history) ? req.body.history : [];

    if (!message.trim()) {
      return res.status(400).json({ error: 'Falta la pregunta.' });
    }

    if (!API_KEY) {
      return res.status(503).json({
        error: 'La IA no está configurada en el servidor (falta GROQ_API_KEY).',
        reply: null
      });
    }

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      .concat(history.slice(-10))
      .concat([{ role: 'user', content: message }]);

    const response = await fetch(AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.6,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Error de la IA:', response.status, detail);
      return res.status(502).json({ error: 'La IA no respondió correctamente.' });
    }

    const data = await response.json();
    const reply =
      data && data.choices && data.choices[0] &&
      data.choices[0].message && data.choices[0].message.content;

    if (!reply) return res.status(502).json({ error: 'Respuesta vacía de la IA.' });

    res.json({ reply: reply });
  } catch (err) {
    console.error('Error interno:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Tutor ERP IA escuchando en el puerto ' + PORT);
  console.log('IA configurada: ' + (API_KEY ? 'SÍ' : 'NO (modo demostración)'));
});
