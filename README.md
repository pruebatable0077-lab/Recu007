# ERP Tutor IA — Aprende sistemas ERP con Odoo

Página web educativa con **tutor de Inteligencia Artificial** para aprender **sistemas ERP** y **Odoo**.
Construida con **HTML, CSS, JavaScript y Bootstrap 5**, totalmente **responsive** y con **animaciones**.

> **Proyecto 6** — *Aprende sistemas ERP con Odoo con tu tutor de IA*
> Recuperación Extraordinaria · 3DS «B» · INDEL — Instituto Nacional Cantón Lourdes

---

## 🌐 Página en vivo (GitHub Pages)

```
https://pruebatable007-lab.github.io/Recu007/
```

---

## 🎯 ¿Qué hace la página?

Enseña **4 secciones completas** sobre sistemas ERP, con lenguaje simple y ejemplos salvadoreños
(la *Distribuidora El Salvador*, la pulpería *Doña Marta*, la tienda *El Progreso*).

| Sección | Contenido |
|---|---|
| **1. ¿Qué es un ERP?** | Definición, problemas que resuelve, beneficios concretos |
| **2. Módulos principales** | Ventas, Compras, Inventario y Contabilidad |
| **3. Datos conectados** | Cómo una venta mueve varios módulos (diagrama de flujo) |
| **4. Empezar con Odoo** | Crear empresa de prueba y cargar los primeros datos |

Además incluye:

- 🤖 **Tutor de IA** que responde preguntas del tema en lenguaje sencillo.
- ✅ **Mini práctica**: un ejercicio guiado que se corrige solo y da retroalimentación.
- 📝 **Quiz de 5 preguntas** con corrección instantánea y puntaje.
- ❓ **Preguntas frecuentes** (acordeón) y diseño responsive con animaciones.

---

## 🧠 Cómo funciona la Inteligencia Artificial

El tutor usa la **API de Groq** (modelo Llama 3.3). La clave está en el archivo
[`js/config.js`](js/config.js) para que la página funcione de inmediato, sin pasos extra.

```js
// js/config.js
window.ERP_CONFIG = {
  apiKey: 'gsk_...',
  groqUrl: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile'
};
```

Si por un momento no hay internet o la API no responde, el tutor tiene una **base de conocimiento
local de respaldo**, así que la página nunca deja al estudiante sin respuesta.

> ℹ️ Para una entrega final en producción, lo recomendable es mover la clave a una **variable de
> entorno** en el hosting (ver carpeta [`server/`](server/)) y no dejarla en el código público.
> En esta versión de prueba/demostración la clave está integrada a propósito.

---

## 📁 Estructura del repositorio

```
Recu007/
├── index.html          # Página completa (contenido, secciones, quiz)
├── css/
│   └── styles.css      # Estilos extra opcionales
├── js/
│   ├── config.js       # Configuración pública (sin claves)
│   ├── app.js          # Interacciones: navegación, animaciones, scroll
│   ├── tutor.js        # Tutor de IA (servidor / clave local / demostración)
│   └── quiz.js         # Quiz de 5 preguntas + ejercicio autoevaluado
├── server/             # Proxy seguro (opcional, para IA real)
│   ├── package.json
│   ├── server.js
│   └── README.md
├── .nojekyll
├── .gitignore
└── README.md
```

---

## 🚀 Cómo publicar en GitHub Pages

1. Sube todos los archivos a tu repositorio **`Recu007`** en la rama `main`.
2. Entra a **Settings → Pages**.
3. En *Source*, elige **Deploy from a branch**.
4. Selecciona la rama **`main`** y la carpeta **`/ (root)`**. Guarda.
5. Espera 1–2 minutos y abre: `https://pruebatable007-lab.github.io/Recu007/`

> El archivo `.nojekyll` ya está incluido para que GitHub Pages sirva todo correctamente.

---

## 🖥️ Cómo probarlo en tu computadora

```bash
git clone https://github.com/pruebatable007-lab/Recu007.git
cd Recu007
python -m http.server 8000
```

Abre en el navegador: `http://localhost:8000`

---

## 🛠️ Tecnologías usadas

- **HTML5** semántico y accesible
- **CSS3** con variables, grid, flexbox, gradientes y animaciones
- **JavaScript** puro (sin frameworks pesados)
- **Bootstrap 5.3** (rejilla responsive + acordeón)
- **Bootstrap Icons**
- Tipografías **Plus Jakarta Sans** e **Inter**

---

## ✨ Características del diseño

- Diseño **comercial y profesional** (no futurista), estilo de empresa consolidada.
- Paleta azul marino + acento azul corporativo + dorado.
- **100 % responsive**: se ve bien en celular, tablet y computadora.
- Animaciones suaves al hacer scroll, barra de progreso de lectura, botón «volver arriba».
- Accesible: foco visible, contraste adecuado, etiquetas ARIA y soporte para *reducir movimiento*.

---

## 👨‍💻 Créditos

- **Estudiante:** *(escribe tu nombre aquí)*
- **Docente:** Prof. Javier Mineros
- **Institución:** INDEL — Instituto Nacional Cantón Lourdes
- **Curso:** BTV Desarrollo de Software · 3.er año · Sección 3DS «B»

---

## ✅ Lista de requisitos cumplidos

- [x] Página pública con tutor de IA funcionando
- [x] Mínimo 4 secciones con lenguaje simple y ejemplos salvadoreños
- [x] Quiz de 5 preguntas
- [x] Ejercicio que se corrige automáticamente
- [x] Diseño responsive (celular, tablet, computadora)
- [x] Repositorio ordenado con README
- [x] Clave de IA configurada y tutor funcionando en vivo (Groq)
