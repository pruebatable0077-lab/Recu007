# Proxy seguro del Tutor de IA

Este pequeño servidor permite usar el tutor de IA **sin exponer la clave** al navegador.
La clave se guarda como **variable de entorno**, nunca en el código.

## Cómo funciona

```
Navegador  ──pregunta──▶  Este servidor (tiene la clave)  ──▶  IA (Groq)
           ◀──respuesta──                                 ◀──
```

## Paso 1 · Obtener una clave

Entra a GroqCloud, Google AI Studio (Gemini) o Hugging Face y crea una clave gratuita.
Revisa los límites gratuitos vigentes.

## Paso 2 · Probar en tu computadora

```bash
cd server
npm install
GROQ_API_KEY=tu_clave_aqui npm start
```

Luego, en `js/config.js`, activa el proxy:

```js
apiEndpoint: 'http://localhost:3000/api/tutor'
```

## Paso 3 · Desplegar (Render, Railway, Vercel…)

1. Sube el repositorio a GitHub (**sin la clave**).
2. Crea un *Web Service* en tu hosting apuntando a la carpeta `server/`.
3. Añade la variable de entorno `GROQ_API_KEY` en el panel del hosting.
   > ⚠️ Esta variable se configura en el panel, **nunca** en un archivo del repositorio.
4. Copia la URL pública del servicio (ej. `https://erp-tutor.onrender.com`) y escríbela
   en `js/config.js` como `apiEndpoint: 'https://erp-tutor.onrender.com/api/tutor'`.

## Nota sobre GitHub Pages

GitHub Pages solo sirve archivos estáticos, no puede ejecutar este servidor.
Por eso el `index.html` está listo para funcionar en **modo demostración** (base de conocimiento local)
cuando no hay `apiEndpoint`. Si quieres IA real en vivo, despliega este proxy aparte y enlázalo.

## Seguridad

- La clave **jamás** se escribe en `index.html`, `tutor.js`, `config.js` ni el README.
- Si la clave se publica por error: **bórrala y genera una nueva** inmediatamente.
- Usa `.gitignore` para no subir archivos `.env`.
