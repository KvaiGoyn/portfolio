const workshop = document.querySelector("[data-workshop]");
if (workshop) {
  const deviceFrame = workshop.querySelector(".device-demo-frame");
  function fitDeviceFrame() {
    const frameDocument = deviceFrame.contentDocument;
    const height = Math.max(
      frameDocument?.body?.scrollHeight || 0,
      frameDocument?.documentElement?.scrollHeight || 0,
    );
    if (height) deviceFrame.style.height = `${height + 2}px`;
  }
  let deviceObserver;
  function observeDeviceFrame() {
    fitDeviceFrame();
    const content = deviceFrame.contentDocument?.body;
    if (content && window.ResizeObserver) {
      deviceObserver?.disconnect();
      deviceObserver = new ResizeObserver(fitDeviceFrame);
      deviceObserver.observe(content);
    }
  }
  deviceFrame.addEventListener("load", observeDeviceFrame);
  if (deviceFrame.contentDocument?.readyState === "complete")
    observeDeviceFrame();
  window.addEventListener("resize", fitDeviceFrame);
  workshop.querySelectorAll("[data-scene]").forEach((button) =>
    button.addEventListener("click", () => {
      workshop
        .querySelectorAll("[data-scene]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      workshop
        .querySelectorAll("[data-panel]")
        .forEach((p) => (p.hidden = p.dataset.panel !== button.dataset.scene));
    }),
  );
  const mapPool = [
    "Mirage",
    "Inferno",
    "Nuke",
    "Ancient",
    "Anubis",
    "Dust II",
    "Vertigo",
  ];
  const bans = [];
  let match = false;
  const matchStart = document.querySelector("#match-start");
  const undo = document.querySelector("#veto-undo");
  const maps = workshop.querySelector(".veto-maps");
  maps.innerHTML = mapPool
    .map(
      (name, i) =>
        `
          <button
            class="veto-map map-${i}"
            data-map="${i}"
            aria-label="Исключить ${name}"
          >
            <span class="map-art" aria-hidden="true"><i></i><i></i><i></i></span>
            <strong>${name}</strong>
            <span class="map-state">Исключить</span>
          </button>
        `,
    )
    .join("");
  function renderVeto() {
    const remaining = mapPool.filter((_, i) => !bans.includes(i));
    const ready = remaining.length === 1;
    const team = bans.length % 2 === 0 ? "A" : "B";
    maps.querySelectorAll("[data-map]").forEach((button) => {
      const mapIndex = Number(button.dataset.map);
      const banIndex = bans.indexOf(mapIndex);
      const banned = banIndex !== -1;
      button.disabled = banned || ready || match;
      button.classList.toggle("is-banned", banned);
      button.classList.toggle("is-picked", ready && !banned);
      button.querySelector(".map-state").textContent = banned
        ? `Бан · команда ${banIndex % 2 === 0 ? "A" : "B"}`
        : ready
          ? "Карта матча"
          : "Исключить";
    });
    document.querySelector("#veto-progress").textContent = `${bans.length} / 6`;
    document.querySelector("#veto-turn").textContent = match
      ? `Вето завершено. Матч на ${remaining[0]}`
      : ready
        ? `Выбрана ${remaining[0]}. Можно запускать матч.`
        : `Ход команды ${team} — исключите карту`;
    document.querySelector("#match-map").textContent = ready
      ? `${remaining[0]} · BO1`
      : "BO1 · 5 × 5";
    document.querySelector("#match-score").textContent = match ? "0 : 0" : "VS";
    document.querySelector("#match-status").textContent = match
      ? "Матч запущен"
      : ready
        ? "Команды готовы к старту"
        : "Команды выбирают карту";
    workshop.querySelector(".match-scene").classList.toggle("is-live", match);
    workshop
      .querySelectorAll(".team")
      .forEach((team, index) =>
        team.classList.toggle("is-turn", !ready && index === bans.length % 2),
      );
    workshop.querySelector(".veto-history").innerHTML = bans
      .map(
        (index, i) =>
          `<li><span>${i % 2 === 0 ? "A" : "B"}</span> <s>${mapPool[index]}</s></li>`,
      )
      .join("");
    undo.disabled = bans.length === 0 || match;
    matchStart.disabled = !ready || match;
    matchStart.textContent = match
      ? "Матч запущен"
      : ready
        ? `Запустить на ${remaining[0]}`
        : "Сначала завершите вето";
  }
  maps.addEventListener("click", (event) => {
    const button = event.target.closest("[data-map]");
    if (!button || button.disabled || match || bans.length >= 6) return;
    bans.push(Number(button.dataset.map));
    renderVeto();
    if (bans.length === 6) matchStart.focus();
    else maps.querySelector("button:not(:disabled)")?.focus();
  });
  undo.addEventListener("click", () => {
    if (!match && bans.length) {
      const restored = bans.pop();
      renderVeto();
      maps.querySelector(`[data-map="${restored}"]`).focus();
    }
  });
  document.querySelector("#veto-reset").addEventListener("click", () => {
    match = false;
    bans.length = 0;
    renderVeto();
    maps.querySelector("button").focus();
  });
  matchStart.addEventListener("click", () => {
    if (bans.length !== 6 || match) return;
    match = true;
    renderVeto();
    document.querySelector("#veto-reset").focus();
  });
  renderVeto();
  let booking = 0;
  document
    .querySelector("#booking-action")
    .addEventListener("click", (event) => {
      booking = (booking + 1) % 3;
      document.querySelector("#booking-message").innerHTML = [
        `<strong>Ожидаем событие</strong><p>Создайте бронь на соседнем экране.</p>`,
        `<strong>✓ Новая бронь</strong><p>ПК 07 · 18:00 — 20:00</p><small>Гость · место зарезервировано</small>`,
        `<strong>↶ Бронь отменена</strong><p>ПК 07 снова доступен</p><small>Команда видит изменение статуса</small>`,
      ][booking];
      event.target.textContent = [
        "Создать бронь",
        "Отменить бронь",
        "Начать заново",
      ][booking];
      workshop
        .querySelector(".booking-ticket")
        .classList.toggle("is-booked", booking === 1);
    });
}
