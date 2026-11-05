/* ============================================================
   tutor.js — Tutor de Inteligencia Artificial (ERP / Odoo)
   Proyecto 6 · Sistemas ERP con Odoo · EduIA

   Usa la API de Groq con la clave definida en js/config.js.
   Si por alguna razón no hay conexión o la clave falla, el
   tutor responde con una base de conocimiento local para que
   la página siga funcionando.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIGURACIÓN
     ---------------------------------------------------------- */
  var CONFIG = window.ERP_CONFIG || {};
  var API_KEY = CONFIG.apiKey || '';
  var GROQ_URL = CONFIG.groqUrl || 'https://api.groq.com/openai/v1/chat/completions';
  var MODEL = CONFIG.model || 'llama-3.3-70b-versatile';

  var SYSTEM_PROMPT =
    'Eres un tutor de sistemas ERP para estudiantes de bachillerato de El Salvador. ' +
    'Explicas con una empresa salvadoreña, por ejemplo una distribuidora de productos o una pulpería, ' +
    'y muestras cómo un dato pasa de un módulo a otro, en pasos cortos. ' +
    'Usas lenguaje sencillo, ejemplos locales (Soyapango, Santa Ana, pulpería, sacos de café, cajas de jabón). ' +
    'NUNCA entregas una tarea completa de golpe: explicas, das una pista y terminas con UNA pregunta corta ' +
    'para comprobar que el estudiante entendió. ' +
    'Si te preguntan algo fuera de ERP, Odoo o sistemas de información, regresas amablemente al tema. ' +
    'Responde SIEMPRE en español y en formato claro, con listas cortas cuando ayude.';

  /* ----------------------------------------------------------
     ELEMENTOS DEL DOM
     ---------------------------------------------------------- */
  var chatWindow = document.getElementById('chatWindow');
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var sendBtn = document.getElementById('sendBtn');
  var suggestions = document.getElementById('suggestions');
  var keyBadge = document.getElementById('keyBadge');
  var tutorModeLabel = document.getElementById('tutorModeLabel');

  if (!chatWindow || !chatForm) return;

  var history = [];
  var busy = false;

  /* ----------------------------------------------------------
     ESTADO INICIAL
     ---------------------------------------------------------- */
  function detectAccess() {
    if (API_KEY) applyMode('IA conectada', 'on');
    else applyMode('Modo demostración', 'off');
  }

  function applyMode(label, state) {
    if (tutorModeLabel) tutorModeLabel.textContent = label;
    if (keyBadge) {
      keyBadge.className = 'key-badge ' + state;
      keyBadge.innerHTML = '<i class="bi bi-circle-fill"></i> ' +
        (state === 'on' ? 'IA conectada' : 'Demostración');
    }
  }

  detectAccess();

  /* ----------------------------------------------------------
     SUGERENCIAS RÁPIDAS
     ---------------------------------------------------------- */
  if (suggestions) {
    suggestions.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-q]');
      if (!btn) return;
      var q = btn.getAttribute('data-q');
      if (chatInput) chatInput.value = q;
      sendMessage();
    });
  }

  /* ----------------------------------------------------------
     ENVÍO DEL FORMULARIO
     ---------------------------------------------------------- */
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage();
  });

  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    chatInput.addEventListener('input', function () {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
  }

  /* ----------------------------------------------------------
     FUNCIÓN PRINCIPAL
     ---------------------------------------------------------- */
  function sendMessage() {
    if (busy) return;
    var text = (chatInput && chatInput.value || '').trim();
    if (!text) return;

    addMessage('user', text);
    history.push({ role: 'user', content: text });

    chatInput.value = '';
    chatInput.style.height = 'auto';

    busy = true;
    if (sendBtn) sendBtn.disabled = true;

    var typing = addTyping();

    askTutor(text)
      .then(function (reply) {
        typing.remove();
        addMessage('bot', reply);
        history.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        typing.remove();
        var fallback = localAnswer(text);
        addMessage('bot', fallback);
        history.push({ role: 'assistant', content: fallback });
      })
      .then(function () {
        busy = false;
        if (sendBtn) sendBtn.disabled = false;
      });
  }

  /* ----------------------------------------------------------
     LLAMADA A LA IA (Groq)
     ---------------------------------------------------------- */
  function askTutor(text) {
    if (!API_KEY) {
      return new Promise(function (resolve) {
        setTimeout(function () { resolve(localAnswer(text)); }, 650);
      });
    }

    var messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      .concat(history.slice(-10))
      .concat([{ role: 'user', content: text }]);

    return fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.6,
        max_tokens: 700
      })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('api');
        return r.json();
      })
      .then(function (data) {
        var out = data && data.choices && data.choices[0] &&
                  data.choices[0].message && data.choices[0].message.content;
        if (!out) throw new Error('empty');
        return out;
      });
  }

  /* ----------------------------------------------------------
     RENDER DE MENSAJES
     ---------------------------------------------------------- */
  function addMessage(who, content) {
    var msg = document.createElement('div');
    msg.className = 'msg ' + (who === 'user' ? 'user' : 'bot');

    var av = document.createElement('div');
    av.className = 'av';
    av.innerHTML = who === 'user'
      ? '<i class="bi bi-person-fill"></i>'
      : '<i class="bi bi-robot"></i>';

    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = who === 'user' ? escapeHtml(content) : formatReply(content);

    msg.appendChild(av);
    msg.appendChild(bubble);
    chatWindow.appendChild(msg);
    scrollDown();
    return msg;
  }

  function addTyping() {
    var msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.innerHTML =
      '<div class="av"><i class="bi bi-robot"></i></div>' +
      '<div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
    chatWindow.appendChild(msg);
    scrollDown();
    return msg;
  }

  function scrollDown() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  /* ----------------------------------------------------------
     FORMATO DE LA RESPUESTA
     ---------------------------------------------------------- */
  function formatReply(text) {
    var safe = escapeHtml(text);
    var lines = safe.split(/\n/);
    var html = '';
    var inList = false;

    lines.forEach(function (line) {
      var l = line.trim();
      if (!l) {
        if (inList) { html += '</ul>'; inList = false; }
        return;
      }
      if (/^(\*|-|•)\s+/.test(l)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + l.replace(/^(\*|-|•)\s+/, '') + '</li>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p style="margin:0 0 8px">' + l + '</p>';
      }
    });
    if (inList) html += '</ul>';
    return html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }

  /* ----------------------------------------------------------
     BASE DE CONOCIMIENTO LOCAL (respaldo si falla la red)
     ---------------------------------------------------------- */
  var KB = [
    {
      k: ['qué es un erp', 'que es un erp', 'para qué sirve', 'definición', 'definicion'],
      a: '<b>Un ERP (Enterprise Resource Planning)</b> es un sistema que reúne en un solo lugar todas las áreas de una empresa, para que compartan la misma información.<br><br>' +
         'Piensa en la <b>Distribuidora El Salvador</b>: antes tenía las ventas en un cuaderno, el inventario en Excel y las facturas en otro archivo. Con un ERP, todo vive en una sola base de datos.<br><br>' +
         '<b>Problemas que resuelve:</b><ul><li>Información dispersa o duplicada</li><li>Errores al capturar el mismo dato varias veces</li><li>No saber cuánto hay en bodega en tiempo real</li><li>Perder tiempo cerrando cuentas a mano</li></ul><br>' +
         '¿Te lo explico con el ejemplo de una venta concreta? 🚀'
    },
    {
      k: ['vendo', 'venta', 'pedido', 'factura', 'confirmo'],
      a: '¡Buena pregunta! Veamos qué pasa cuando vendes <b>50 sacos de café</b> a la pulpería «Doña Marta» 👇<br><br>' +
         '<b>1. Ventas:</b> creas y confirmas el pedido.<br>' +
         '<b>2. Inventario:</b> el stock baja solo de 320 a 270 sacos.<br>' +
         '<b>3. Facturación:</b> se genera la factura con el IVA.<br>' +
         '<b>4. Contabilidad:</b> se registra el ingreso y la cuenta por cobrar.<br><br>' +
         'Todo ocurre al mismo tiempo porque los módulos comparten la misma base de datos. Eso es la magia del ERP ✨<br><br>' +
         '¿Sabes qué pasaría si el inventario no estuviera conectado a Ventas?'
    },
    {
      k: ['módulo', 'modulo', 'ventas', 'compras', 'inventario', 'contabilidad', 'crm'],
      a: 'Estos son los <b>4 módulos base</b> que toda empresa activa al inicio:<br><br>' +
         '<b>Ventas:</b> cotizaciones, pedidos y facturas.<br>' +
         '<b>Inventario:</b> existencias por producto y bodega, alertas de stock mínimo.<br>' +
         '<b>Compras:</b> órdenes a proveedores y recepción de mercadería.<br>' +
         '<b>Contabilidad:</b> ingresos, gastos, impuestos y reportes.<br><br>' +
         'Existen más (CRM, Recursos Humanos, Sitio web…) pero se agregan después.<br><br>' +
         '¿Cuál de los cuatro crees que es el más importante para no perder dinero? 🤔'
    },
    {
      k: ['odoo', 'empezar', 'crear empresa', 'prueba', 'base de datos', 'instalar'],
      a: 'Empezar con Odoo es sencillo. Estos son los pasos 👇<br><br>' +
         '<b>1.</b> Crea una base de datos de prueba gratuita (nombre: distribuidora-el-salvador).<br>' +
         '<b>2.</b> En Ajustes, configura la empresa: nombre, moneda USD y país.<br>' +
         '<b>3.</b> Instala los 4 módulos: Ventas, Inventario, Compras y Contabilidad.<br>' +
         '<b>4.</b> Carga productos («Café molido 1 kg»), clientes («Pulpería Doña Marta») y bodegas.<br>' +
         '<b>5.</b> Haz tu primera venta y mira cómo todo se actualiza solo.<br><br>' +
         '¿Quieres que te ayude a inventar los datos de tu empresa de prueba? 😄'
    },
    {
      k: ['kardex', 'stock mínimo', 'stock minimo', 'asiento', 'orden de compra', 'glosario'],
      a: 'Te ayudo con el vocabulario del ERP 📘<br><br>' +
         '<b>Kardex:</b> historial de movimientos de un producto (entradas y salidas).<br>' +
         '<b>Orden de compra:</b> documento con el que pides mercadería a un proveedor.<br>' +
         '<b>Asiento contable:</b> registro de una operación en la contabilidad.<br>' +
         '<b>Stock mínimo:</b> cantidad mínima que debe existir antes de volver a pedir.<br><br>' +
         '¿Cuál de estos términos quieres que te explique con un ejemplo de la distribuidora?'
    },
    {
      k: ['diferencia', 'contabilidad vs', 'inventario vs', 'comparar'],
      a: 'Buena comparación 👇<br><br>' +
         '<b>Inventario</b> se ocupa de las cosas físicas: cuántos sacos de café hay, en qué bodega, y cuándo reordenar.<br>' +
         '<b>Contabilidad</b> se ocupa del dinero: cuánto entró, cuánto salió y cuánto se debe cobrar o pagar.<br><br>' +
         'Se conectan así: cuando vendes 50 sacos, el <b>inventario</b> baja las unidades y la <b>contabilidad</b> registra el ingreso de dinero. Una acción, dos efectos.<br><br>' +
         '¿Se te ocurre otro ejemplo donde se vean juntos? 💡'
    },
    {
      k: ['clave', 'seguridad', 'api key', 'proteger', 'github'],
      a: 'La clave de la IA se configura en el archivo de configuración del proyecto. Para publicar una versión final, lo ideal es guardarla como variable de entorno en el hosting; en esta versión de prueba está lista para funcionar de inmediato.<br><br>' +
         '¿Tienes otra duda sobre el ERP que quieras resolver? 🙂'
    }
  ];

  function localAnswer(text) {
    var t = norm(text);

    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        if (t.indexOf(KB[i].k[j]) !== -1) return KB[i].a;
      }
    }

    return 'Muy buena pregunta 👏 Te doy una idea general:<br><br>' +
           'Un <b>ERP</b> conecta todas las áreas de una empresa (ventas, compras, inventario y contabilidad) ' +
           'para que compartan la misma información. En <b>Odoo</b>, un solo dato —como una venta— se mueve ' +
           'automáticamente de un módulo a otro.<br><br>' +
           'Puedes preguntarme, por ejemplo:<ul>' +
           '<li>¿Qué es un ERP?</li>' +
           '<li>¿Qué pasa cuando vendo un producto?</li>' +
           '<li>¿Cuáles son los módulos principales?</li>' +
           '<li>¿Cómo empiezo con Odoo?</li></ul><br>' +
           '¿Cuál te gustaría que explicáramos primero? 🙂';
  }

  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
