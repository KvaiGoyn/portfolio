const devices = [
  {
    id: "headset",
    name: "HyperX Cloud III S WL",
    image: "../../assets/device-service/hyperx-cloud-iii-s-wl.png",
    specs: ["Беспроводная", "53 мм", "DTS:X"],
  },
  {
    id: "controller",
    name: "DualSense",
    image: "../../assets/device-service/dualsense.png",
    specs: ["PS5", "Тактильная отдача", "Адаптивные триггеры"],
  },
];
const quantities = { headset: 0, controller: 0 };
let filter = "all";
const $ = (s) => document.querySelector(s);
function render() {
  $("#catalog").innerHTML = devices
    .filter((device) => filter === "all" || device.id === filter)
    .map(
      (device) =>
        `
          <article class="card ${quantities[device.id] ? "selected" : ""}">
            <button
              class="card-img"
              data-details="${device.id}"
              aria-label="Подробнее: ${device.name}"
            >
              <img src="${device.image}" alt="${device.name}" loading="lazy">
            </button>
            <div class="card-body">
              <h2 class="card-name">${device.name}</h2>
              <div class="card-specs">
                ${device.specs.map((spec) => `<span class="spec">${spec}</span>`).join("")}
              </div>
              <div class="card-bottom">
                <span class="avail">в наличии · 2</span>
                <div class="qty">
                  <button
                    class="qty-btn"
                    data-id="${device.id}"
                    data-delta="-1"
                    aria-label="Убрать ${device.name}"
                    ${quantities[device.id] === 0 ? "disabled" : ""}
                  >−</button>
                  <span class="qty-val">${quantities[device.id]}</span>
                  <button
                    class="qty-btn"
                    data-id="${device.id}"
                    data-delta="1"
                    aria-label="Добавить ${device.name}"
                    ${quantities[device.id] === 2 ? "disabled" : ""}
                  >+</button>
                </div>
              </div>
            </div>
          </article>
        `,
    )
    .join("");
  $("#basket-summary").textContent =
    devices
      .filter((d) => quantities[d.id])
      .map((device) => `${device.name} × ${quantities[device.id]}`)
      .join(" · ") || "Устройства пока не выбраны";
  $("#checkout").disabled = !Object.values(quantities).some(Boolean);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.filter) {
    filter = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((filterButton) =>
        filterButton.setAttribute(
          "aria-pressed",
          String(filterButton === button),
        ),
      );
    render();
  }
  if (button.dataset.delta) {
    const id = button.dataset.id;
    quantities[id] = Math.max(
      0,
      Math.min(2, quantities[id] + Number(button.dataset.delta)),
    );
    render();
    document
      .querySelector(
        `[data-id="${id}"][data-delta="${button.dataset.delta}"]:not(:disabled)`,
      )
      ?.focus();
  }
  if (button.dataset.details) {
    const device = devices.find(
      (device) => device.id === button.dataset.details,
    );
    $("#detail-name").textContent = device.name;
    $("#detail-image").src = device.image;
    $("#detail-image").alt = device.name;
    $("#detail-specs").textContent = device.specs.join(" · ");
    $("#details").showModal();
  }
});
$("#details .close").addEventListener("click", () => $("#details").close());
$("#checkout").addEventListener("click", () => {
  if (!Object.values(quantities).some(Boolean)) return;
  $(".basket").hidden = true;
  $("#catalog").hidden = true;
  $(".filters").hidden = true;
  $("#order").hidden = false;
  $("#order-title").textContent = "Заказ создан";
});
render();
