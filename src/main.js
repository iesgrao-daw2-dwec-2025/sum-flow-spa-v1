const $ = (sel) => document.querySelector(sel);
const app = $("#app");
const KEY = "sumFlowItems";

function render(fn) {
  app.innerHTML = "";
  fn();
}

function viewWelcome() {
  app.innerHTML = `
    <h1>Aplicación Sum Flow (SPA Monolítica)</h1>
    <p>Bienvenido/a. Pulsa para continuar al login.</p>
    <button id="btnStart">Continuar</button>
  `;
  $("#btnStart")?.addEventListener("click", () => render(viewLogin));
}

function viewLogin() {
  app.innerHTML = `
    <h1>Acceso</h1>
    <input id="user" placeholder="Usuario" autocomplete="username" />
    <input id="pass" type="password" placeholder="Contraseña" autocomplete="current-password" />
     <button id="btnHome">Volver al inicio</button>
    <button id="btnLogin">Iniciar sesión</button>
  `;
  $("#btnLogin")?.addEventListener("click", () => {
    const user = $("#user")?.value.trim();
    const pass = $("#pass")?.value.trim();
    if (user === "admin" && pass === "1234") render(viewDashboard);
    else render(viewError);
  });

  $("#btnHome")?.addEventListener("click", () => {
    render(viewWelcome);
  });
}

function viewDashboard() {
  app.innerHTML = `
    <h1>Panel principal</h1>
    <input id="numItems" type="number" min="1" placeholder="Número de ítems" />
    <div>
      <button id="btnGenerate">Generar</button>
      <button id="btnToggleInstructions">Mostrar instrucciones</button>
    </div>
    <p id="instructions" class="notice hidden">
      Introduce un número y genera ítems. Cada ítem muestra un número aleatorio entre 0 y 100.
    </p>
    <div id="items"></div>
    <div>
      <button id="btnContinue">Sumar</button>
      <button id="btnExit">Salir</button>
    </div>
  `;

  const itemsDiv = $("#items");
  const num = $("#numItems");
  const instructions = $("#instructions");

  $("#btnGenerate")?.addEventListener("click", () => {
    const n = Number(num?.value);
    if (!n || n < 1) return;
    itemsDiv.innerHTML = "";
    const vals = [];
    for (let i = 0; i < n; i++) {
      const v = Math.floor(Math.random() * 101);
      vals.push(v);
      const d = document.createElement("div");
      d.className = "item";
      d.textContent = String(v);
      itemsDiv.appendChild(d);
    }
    localStorage.setItem(KEY, JSON.stringify(vals));
  });

  $("#btnToggleInstructions")?.addEventListener("click", () => {
    instructions?.classList.toggle("hidden");
  });

  $("#btnContinue")?.addEventListener("click", () => render(viewSummary));
  $("#btnExit")?.addEventListener("click", () => {
    localStorage.removeItem(KEY);
    render(viewLogin);
  });
}

function viewSummary() {
  const vals = JSON.parse(localStorage.getItem(KEY) || "[]");
  const sum = vals.reduce((a, b) => a + b, 0);
  app.innerHTML = `
    <h1>Resumen</h1>
    <p>${
      vals.length > 0
        ? `Resultado: ${vals.join(" + ")} = ${sum}`
        : "No hay datos disponibles."
    }</p>
    <div>
      <button id="btnBack">Volver</button>
      <button id="btnExit">Salir</button>
    </div>
  `;
  $("#btnBack")?.addEventListener("click", () => render(viewDashboard));
  $("#btnExit")?.addEventListener("click", () => {
    localStorage.removeItem(KEY);
    render(viewLogin);
  });
}

function viewError() {
  app.innerHTML = `
    <h1>Acceso denegado</h1>
    <p>Los datos de acceso son incorrectos.</p>
    <button id="btnRetry">Volver al login</button>
  `;
  $("#btnRetry")?.addEventListener("click", () => render(viewLogin));
}

render(viewWelcome);
