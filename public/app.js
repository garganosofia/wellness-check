const WA_URL =
  "https://wa.me/5492215571566?text=" +
  encodeURIComponent("Hola Sofía, completé el autochequeo de bienestar en tu web.");

const I18N = {
  es: {
    title: "Bienestar: autochequeo",
    subtitle:
      "Respondé con honestidad. Es orientativo, no sustituye valoración médica.",
    foot: "Hecho para ",
    start: "Comenzar",
    next: "Siguiente",
    result: "Ver resultado",
    again: "Repetir",
    scoreLabel: "Puntaje orientativo",
    tipsTitle: "Consejos generales de alimentación",
    disclaimer: "Si tenés síntomas intensos o persistentes, consultá a un profesional de la salud.",
    q: [
      { text: "¿Cuántas horas dormís en promedio?", opts: ["Menos de 5", "5–6", "7–8", "Más de 8"] },
      { text: "¿Cómo calificarías tu energía diaria?", opts: ["Muy baja", "Baja", "Buena", "Alta"] },
      { text: "¿Dolor o molestias corporales frecuentes?", opts: ["Siempre", "A veces", "Rara vez", "No"] },
      { text: "¿Días por semana con actividad física moderada?", opts: ["0", "1–2", "3–4", "5 o más"] },
      { text: "Nivel de estrés percibido", opts: ["Muy alto", "Alto", "Moderado", "Bajo"] },
      { text: "Estado de ánimo en general", opts: ["Muy bajo", "Bajo", "Estable", "Positivo"] },
      { text: "¿Regularidad en las comidas principales?", opts: ["Irregular", "Algo irregular", "Regular", "Muy regular"] },
      { text: "¿Consumo de agua durante el día?", opts: ["Poco", "Algo bajo", "Adecuado", "Muy bueno"] },
    ],
    tiers: [
      {
        max: 35,
        label: "Priorizá descanso y apoyo",
        tips: [
          "Incluí proteína en cada comida principal (legumbres, huevos, lácteos, pescado o carne magra).",
          "Sumá una fruta entera y verdura cruda o cocida en al menos dos momentos del día.",
          "Evitá saltear el desayuno; hidratate al levantarte con un vaso de agua.",
        ],
      },
      {
        max: 55,
        label: "Equilibrio en progreso",
        tips: [
          "Planificá snacks con fibra: frutos secos moderados, yogur con cereales integrales.",
          "Reducí bebidas azucaradas; alterná con agua, mate o infusiones sin azúcar.",
          "Cociná porciones extra para congelar y evitar comidas ultraprocesadas apuradas.",
        ],
      },
      {
        max: 75,
        label: "Buen camino",
        tips: [
          "Mantené variedad de colores en el plato (fitoquímicos y micronutrientes).",
          "Ajustá grasas: priorizá aceite de oliva, frutos secos, pescado azul una o dos veces por semana.",
          "Si entrenás, repartí hidratos de carbono complejos alrededor del ejercicio.",
        ],
      },
      {
        max: 100,
        label: "Muy bien",
        tips: [
          "Conservá rutinas: horarios de comida estables favorecen digestión y energía.",
          "Revisá cada tanto el sodio (fiambres, conservas) aunque te sientas bien.",
          "Si aumentás el entrenamiento, subí hidratación y alimentos ricos en magnesio y potasio.",
        ],
      },
    ],
  },
  en: {
    title: "Wellness self-check",
    subtitle: "Answer honestly. This is indicative only—not a medical assessment.",
    foot: "Built for ",
    start: "Start",
    next: "Next",
    result: "See result",
    again: "Again",
    scoreLabel: "Indicative score",
    tipsTitle: "General nutrition tips",
    disclaimer: "If symptoms are intense or persistent, seek professional care.",
    q: [
      { text: "Average hours of sleep?", opts: ["Under 5", "5–6", "7–8", "Over 8"] },
      { text: "How would you rate daily energy?", opts: ["Very low", "Low", "Good", "High"] },
      { text: "Frequent body pain or discomfort?", opts: ["Always", "Sometimes", "Rarely", "No"] },
      { text: "Days/week of moderate physical activity?", opts: ["0", "1–2", "3–4", "5+"] },
      { text: "Perceived stress level", opts: ["Very high", "High", "Moderate", "Low"] },
      { text: "Overall mood", opts: ["Very low", "Low", "Stable", "Positive"] },
      { text: "Regularity of main meals?", opts: ["Irregular", "Somewhat", "Regular", "Very regular"] },
      { text: "Daily water intake?", opts: ["Low", "Somewhat low", "Adequate", "Very good"] },
    ],
    tiers: [
      {
        max: 35,
        label: "Prioritize rest and support",
        tips: [
          "Include protein at each main meal (legumes, eggs, dairy, fish, or lean meat).",
          "Add whole fruit and raw or cooked vegetables at least twice a day.",
          "Avoid skipping breakfast; hydrate on waking with a glass of water.",
        ],
      },
      {
        max: 55,
        label: "Balance in progress",
        tips: [
          "Plan fiber-rich snacks: moderate nuts, yogurt with whole grains.",
          "Cut sugary drinks; switch to water or unsweetened tea.",
          "Batch-cook portions to freeze and reduce ultra-processed rushed meals.",
        ],
      },
      {
        max: 75,
        label: "On a good track",
        tips: [
          "Keep plate colour variety (phytonutrients and micronutrients).",
          "Tune fats: favour olive oil, nuts, oily fish once or twice weekly.",
          "If you train more, add hydration and magnesium- and potassium-rich foods.",
        ],
      },
      {
        max: 100,
        label: "Doing great",
        tips: [
          "Keep routines: stable meal times support digestion and energy.",
          "Check sodium (deli, canned goods) even when you feel well.",
          "If training load rises, bump hydration and electrolyte-rich foods.",
        ],
      },
    ],
  },
};

let lang = "es";
let step = -1;
const answers = [];

function scoreFromAnswers() {
  let raw = 0;
  answers.forEach((i) => {
    raw += [0, 25, 50, 75][i] ?? 0;
  });
  const max = (answers.length || 1) * 75;
  return Math.round((raw / max) * 100);
}

function tierFor(score, tiers) {
  const sorted = [...tiers].sort((a, b) => a.max - b.max);
  for (let i = 0; i < sorted.length; i += 1) {
    if (score <= sorted[i].max) return sorted[i];
  }
  return sorted[sorted.length - 1];
}

function setLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.getElementById("title").textContent = I18N[lang].title;
  document.getElementById("subtitle").textContent = I18N[lang].subtitle;
  document.getElementById("foot-note").textContent = I18N[lang].foot;
  render();
}

function render() {
  const t = I18N[lang];
  const app = document.getElementById("app");
  if (step === -1) {
    app.innerHTML = `<div class="card"><button type="button" class="primary" id="go" style="width:100%">${t.start}</button></div>`;
    document.getElementById("go").onclick = () => {
      step = 0;
      answers.length = 0;
      render();
    };
    return;
  }
  if (step >= t.q.length) {
    const score = scoreFromAnswers();
    const tier = tierFor(score, t.tiers);
    app.innerHTML = `
      <div class="card">
        <p class="sub" style="margin:0 0 .5rem">${t.scoreLabel}</p>
        <div class="score-num ${score < 40 ? "low" : score < 70 ? "mid" : "good"}">${score}</div>
        <p style="margin:0 0 1rem;font-weight:600">${tier.label}</p>
        <div class="tips">
          <h3>${t.tipsTitle}</h3>
          <ul>${tier.tips.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
        <p class="disclaimer">${t.disclaimer}</p>
        <div class="actions" style="margin-top:1rem">
          <button type="button" class="secondary" id="again">${t.again}</button>
          <a class="wa-btn" href="${WA_URL}" rel="noopener" target="_blank">WhatsApp</a>
        </div>
      </div>`;
    document.getElementById("again").onclick = () => {
      step = -1;
      render();
    };
    return;
  }
  const qi = t.q[step];
  const sel = answers[step];
  app.innerHTML = `
    <div class="card">
      <p class="q-label">${qi.text}</p>
      <div class="options">
        ${qi.opts
          .map(
            (o, j) => `
        <label><input type="radio" name="o" value="${j}" ${sel === j ? "checked" : ""}> ${o}</label>`
          )
          .join("")}
      </div>
      <div class="actions">
        ${step > 0 ? `<button type="button" class="secondary" id="prev">${lang === "es" ? "Atrás" : "Back"}</button>` : ""}
        <button type="button" class="primary" id="nx">${step === t.q.length - 1 ? t.result : t.next}</button>
      </div>
    </div>`;
  document.getElementById("nx").onclick = () => {
    const r = document.querySelector('input[name="o"]:checked');
    if (!r) return;
    answers[step] = parseInt(r.value, 10);
    step += 1;
    render();
  };
  const prev = document.getElementById("prev");
  if (prev) {
    prev.onclick = () => {
      step -= 1;
      render();
    };
  }
}

document.getElementById("btn-es").onclick = () => {
  document.getElementById("btn-es").classList.add("is-on");
  document.getElementById("btn-en").classList.remove("is-on");
  setLang("es");
};
document.getElementById("btn-en").onclick = () => {
  document.getElementById("btn-en").classList.add("is-on");
  document.getElementById("btn-es").classList.remove("is-on");
  setLang("en");
};

document.getElementById("foot-note").textContent = I18N.es.foot;
render();
