/* ============================================================
   quiz.js — Quiz de 5 preguntas + ejercicio autoevaluado
   Proyecto 6 · Sistemas ERP con Odoo · EduIA
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     PARTE A · QUIZ DE 5 PREGUNTAS
     ========================================================== */
  var QUESTIONS = [
    {
      q: '¿Qué es un ERP?',
      opts: [
        'Un programa que solo sirve para hacer facturas.',
        'Un sistema que reúne en uno solo las áreas de una empresa y comparte la misma información.',
        'Una red social para empresas.',
        'Un antivirus para computadoras de oficina.'
      ],
      correct: 1,
      fb: 'Un ERP integra ventas, compras, inventario y contabilidad en un mismo sistema, con una sola base de datos.'
    },
    {
      q: 'Cuando confirmas una venta de 50 sacos de café en Odoo, ¿qué módulo descuenta el stock automáticamente?',
      opts: ['Contabilidad', 'Inventario', 'Recursos Humanos', 'Sitio web'],
      correct: 1,
      fb: 'El módulo de Inventario baja las unidades de la bodega correspondiente en el mismo instante.'
    },
    {
      q: '¿Cuál es el principal problema de trabajar sin un ERP?',
      opts: [
        'Que la empresa se ve menos moderna.',
        'Que la información está dispersa y el mismo dato se captura varias veces.',
        'Que no se pueden usar computadoras.',
        'Que los clientes pagan más rápido.'
      ],
      correct: 1,
      fb: 'Sin ERP cada área tiene su propia información. Por eso hay errores, trabajo repetido y no se sabe el dato real.'
    },
    {
      q: 'Además de Ventas, Compras e Inventario, ¿qué otro módulo base debe activar una empresa?',
      opts: ['Contabilidad', 'Minería de criptomonedas', 'Edición de video', 'Mensajería instantánea'],
      correct: 0,
      fb: 'Contabilidad es el cuarto módulo base: registra el dinero que entra y sale y genera los reportes.'
    },
    {
      q: '¿Qué documento se genera automáticamente después de confirmar el pedido de un cliente?',
      opts: ['Un contrato de trabajo', 'La orden de compra al proveedor', 'La factura con el IVA correspondiente', 'Un folleto publicitario'],
      correct: 2,
      fb: 'Al confirmar la venta se genera la factura con su IVA, y de ahí sale el asiento contable.'
    }
  ];

  var LETTERS = ['A', 'B', 'C', 'D'];
  var body = document.getElementById('quizBody');
  var scoreEl = document.getElementById('quizScore');
  var btnQuiz = document.getElementById('btnQuiz');
  var resultEl = document.getElementById('quizResult');

  if (!body) return;

  /* --- Construir las preguntas --- */
  var answers = new Array(QUESTIONS.length).fill(null);
  var checked = false;

  QUESTIONS.forEach(function (item, qi) {
    var wrap = document.createElement('div');
    wrap.className = 'q-item';

    var num = document.createElement('div');
    num.className = 'q-num';
    num.textContent = 'Pregunta ' + (qi + 1) + ' de ' + QUESTIONS.length;
    wrap.appendChild(num);

    var txt = document.createElement('div');
    txt.className = 'q-text';
    txt.textContent = item.q;
    wrap.appendChild(txt);

    item.opts.forEach(function (opt, oi) {
      var label = document.createElement('label');
      label.className = 'q-opt';
      label.setAttribute('data-q', qi);
      label.setAttribute('data-o', oi);

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q' + qi;
      input.value = oi;

      var span = document.createElement('div');
      span.innerHTML =
        '<span class="lbl">' + LETTERS[oi] + '.</span> ' +
        escapeHtml(opt) +
        '<div class="fb" style="display:none"></div>';

      label.appendChild(input);
      label.appendChild(span);
      wrap.appendChild(label);

      input.addEventListener('change', function () {
        if (checked) return;
        answers[qi] = oi;
        wrap.querySelectorAll('.q-opt').forEach(function (o) {
          o.classList.remove('selected');
        });
        label.classList.add('selected');
      });
    });

    body.appendChild(wrap);
  });

  /* --- Corregir --- */
  if (btnQuiz) {
    btnQuiz.addEventListener('click', function () {
      if (checked) {
        resetQuiz();
        return;
      }

      var unanswered = answers.indexOf(null);
      if (unanswered !== -1) {
        if (resultEl) {
          resultEl.style.display = 'block';
          resultEl.style.borderColor = '#fbe0b0';
          resultEl.style.background = '#fff8ec';
          resultEl.innerHTML =
            '<b>⚠️ Te falta responder</b>' +
            '<span>Contesta la pregunta ' + (unanswered + 1) +
            ' antes de revisar. Puedes ir bajando por el quiz.</span>';
        }
        return;
      }

      var score = 0;

      QUESTIONS.forEach(function (item, qi) {
        var wrap = body.querySelectorAll('.q-item')[qi];
        var optLabels = wrap.querySelectorAll('.q-opt');

        optLabels.forEach(function (lab, oi) {
          lab.classList.remove('selected');
          var isCorrect = oi === item.correct;
          var isPicked = answers[qi] === oi;

          if (isCorrect) lab.classList.add('correct');
          if (isPicked && !isCorrect) lab.classList.add('wrong');

          var fb = lab.querySelector('.fb');
          if (fb) {
            fb.style.display = 'block';
            if (isCorrect) {
              fb.textContent = '✔ Respuesta correcta. ' + item.fb;
            } else if (isPicked) {
              fb.textContent = '✘ Esta no era. Revísala y vuelve a intentarlo.';
            } else {
              fb.textContent = '';
            }
          }
        });

        if (answers[qi] === item.correct) score++;
      });

      checked = true;
      if (scoreEl) scoreEl.textContent = score + '/' + QUESTIONS.length;

      if (resultEl) {
        resultEl.style.display = 'block';
        var pct = Math.round((score / QUESTIONS.length) * 100);
        if (score === QUESTIONS.length) {
          resultEl.style.borderColor = '#bbf0d6';
          resultEl.style.background = '#effaf5';
          resultEl.innerHTML = '<b>🏆 ¡Excelente! ' + score + '/' + QUESTIONS.length + ' (' + pct + '%)</b><span>Dominas los conceptos básicos del ERP y Odoo. ¡Sigue así!</span>';
        } else if (score >= 3) {
          resultEl.style.borderColor = '#fbe0b0';
          resultEl.style.background = '#fff8ec';
          resultEl.innerHTML = '<b>👍 Buen trabajo: ' + score + '/' + QUESTIONS.length + ' (' + pct + '%)</b><span>Vas bien, pero repasa las que fallaste usando las explicaciones en verde.</span>';
        } else {
          resultEl.style.borderColor = '#fecaca';
          resultEl.style.background = '#fef2f2';
          resultEl.innerHTML = '<b>📚 ' + score + '/' + QUESTIONS.length + ' (' + pct + '%)</b><span>Tómate un momento, vuelve a las secciones y pregúntale al tutor de IA. ¡Tú puedes!</span>';
        }
      }

      btnQuiz.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i> Volver a intentar';
    });
  }

  function resetQuiz() {
    checked = false;
    answers = new Array(QUESTIONS.length).fill(null);

    body.querySelectorAll('.q-opt').forEach(function (lab) {
      lab.classList.remove('correct', 'wrong', 'selected');
      var input = lab.querySelector('input');
      if (input) input.checked = false;
      var fb = lab.querySelector('.fb');
      if (fb) { fb.style.display = 'none'; fb.textContent = ''; }
    });

    if (scoreEl) scoreEl.textContent = '0/' + QUESTIONS.length;
    if (resultEl) resultEl.style.display = 'none';
    if (btnQuiz) btnQuiz.innerHTML = '<i class="bi bi-check2-circle"></i> Revisar mis respuestas';
    window.scrollTo({ top: body.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  /* ==========================================================
     PARTE B · EJERCICIO DE MÓDULOS (autocorregido)
     ========================================================== */
  var KEY_IDEAS = [
    { key: 'venta', label: 'Menciona la venta o el pedido en el módulo de Ventas', words: ['venta', 'pedido', 'cotiza', 'orden de venta', 'sales'] },
    { key: 'inventario', label: 'Explica que el inventario o el stock cambia', words: ['inventario', 'stock', 'existencia', 'almacen', 'bodega', 'kardex'] },
    { key: 'factura', label: 'Nombra la factura o la facturación', words: ['factura', 'facturación', 'facturacion', 'iva', 'recibo'] },
    { key: 'contabilidad', label: 'Menciona la contabilidad o el registro del ingreso', words: ['contabilidad', 'contable', 'asiento', 'ingreso', 'cuenta por cobrar', 'dinero'] },
    { key: 'orden', label: 'Describe el orden o la secuencia de los pasos', words: ['primero', 'luego', 'después', 'despues', 'finalmente', 'entonces', 'paso', 'seguido', 'por último', 'por ultimo'] }
  ];

  var txtArea = document.getElementById('practicaTexto');
  var btnOk = document.getElementById('btnCorregir');
  var btnEx = document.getElementById('btnEjemplo');
  var btnCl = document.getElementById('btnLimpiar');
  var fbBox = document.getElementById('fbBox');
  var fbList = document.getElementById('fbList');
  var fbMsg = document.getElementById('fbMsg');
  var fbTitle = document.getElementById('fbTitle');
  var fbScore = document.getElementById('fbScore');

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  if (btnOk) {
    btnOk.addEventListener('click', function () {
      var raw = txtArea ? txtArea.value.trim() : '';
      var text = normalize(raw);

      if (raw.length < 25) {
        fbBox.className = 'fb-box bad show';
        fbTitle.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Respuesta muy corta';
        fbScore.textContent = '0';
        fbList.innerHTML =
          '<li><i class="bi bi-x-circle-fill"></i><span>Escribe al menos dos o tres oraciones explicando el recorrido de la venta.</span></li>';
        fbMsg.textContent = 'Describe los módulos participantes y el orden en que actúan.';
        return;
      }

      var found = 0;
      var items = KEY_IDEAS.map(function (idea) {
        var hit = idea.words.some(function (w) { return text.indexOf(w) !== -1; });
        if (hit) found++;
        return { label: idea.label, hit: hit };
      });

      var score = Math.round((found / KEY_IDEAS.length) * 100);
      var cls = score >= 80 ? 'ok' : (score >= 50 ? 'mid' : 'bad');

      fbBox.className = 'fb-box ' + cls + ' show';
      fbTitle.innerHTML =
        score >= 80 ? '<i class="bi bi-trophy"></i> ¡Muy bien explicado!' :
        score >= 50 ? '<i class="bi bi-hand-thumbs-up"></i> Vas por buen camino' :
        '<i class="bi bi-search"></i> Necesitas más detalles';

      fbScore.textContent = score;

      fbList.innerHTML = items.map(function (it) {
        return '<li><i class="bi ' + (it.hit ? 'bi-check-circle-fill' : 'bi-x-circle-fill') +
          '"></i><span>' + it.label +
          (it.hit ? ' <span style="color:var(--green);font-weight:700">· incluido</span>' :
                    ' <span style="color:var(--red);font-weight:700">· falta</span>') +
          '</span></li>';
      }).join('');

      if (score >= 80) {
        fbMsg.textContent = 'Dominas el flujo de datos del ERP. Revisa el diagrama de la Sección 3 por si quieres afinarlo aún más.';
      } else if (score >= 50) {
        fbMsg.textContent = 'Buen intento. Vuelve a la Sección 3 (Datos conectados) y completa lo que marcamos como «falta». ¡Ya casi lo tienes!';
      } else {
        fbMsg.textContent = 'No te preocupes: revisa el diagrama de flujo de la Sección 3 y pídele al tutor de IA que te explique el paso a paso. Después inténtalo otra vez.';
      }
    });
  }

  if (btnEx) {
    btnEx.addEventListener('click', function () {
      if (!txtArea) return;
      txtArea.value =
        'Primero entro al módulo de Ventas y creo el pedido de 30 cajas de leche para la tienda El Progreso. ' +
        'Luego confirmo el pedido, y en ese momento el sistema pasa al módulo de Inventario y baja el stock ' +
        'automáticamente: quedan 30 cajas menos en la bodega. Después se genera la factura con el IVA incluido, ' +
        'que se envía al cliente. Finalmente, en el módulo de Contabilidad se registra el ingreso y la cuenta por cobrar, ' +
        'todo al mismo tiempo porque los módulos comparten la misma base de datos.';
      fbBox.className = 'fb-box';
      txtArea.focus();
      window.scrollTo({ top: txtArea.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
    });
  }

  if (btnCl) {
    btnCl.addEventListener('click', function () {
      if (txtArea) txtArea.value = '';
      if (fbBox) fbBox.className = 'fb-box';
      if (fbScore) fbScore.textContent = '0';
      if (fbList) fbList.innerHTML = '';
      if (fbMsg) fbMsg.textContent = '';
      if (txtArea) txtArea.focus();
    });
  }

  /* ==========================================================
     Utilidades
     ========================================================== */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
