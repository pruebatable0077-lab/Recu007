/* ============================================================
   config.js — Configuración del tutor de IA
   Proyecto 6 · Sistemas ERP con Odoo · EduIA
   ------------------------------------------------------------
   NOTA: Versión para PRUEBA / DEMOSTRACIÓN.
   La clave de Groq está escrita aquí directamente para que el
   tutor funcione en vivo al abrir la página.
   ============================================================ */

window.ERP_CONFIG = {
  // Clave de Groq (para prueba).
  apiKey: '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',

  // Endpoint de la API de Groq.
  groqUrl: 'https://api.groq.com/openai/v1/chat/completions',

  // Modelo a usar.
  model: 'llama-3.3-70b-versatile',

  // Nombre visible del asistente.
  assistantName: 'Tutor ERP · Odoo',

  // Curso / proyecto
  course: 'Sistemas ERP · Odoo',
  project: 'Proyecto 6 · Recuperación Extraordinaria 3DS «B»'
};
