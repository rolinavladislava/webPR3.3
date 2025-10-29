const $btnKick = document.getElementById("btn-kick");
const $btnQuick = document.getElementById("btn-quick");
const $logs = document.getElementById("logs");

function createPlayer({ name, elHPId, elProgressbarId, defaultHP = 100 }) {
  const elHP = document.getElementById(elHPId);
  const elProgressbar = document.getElementById(elProgressbarId);

  return {
    name,
    defaultHP,
    damageHP: defaultHP,
    lost: false,
    elHP,
    elProgressbar,

    renderHPLife() {
      const { elHP, damageHP, defaultHP } = this;
      elHP.innerText = `${damageHP} / ${defaultHP}`;
    },

    renderProgressbarHP() {
      const { elProgressbar, damageHP } = this;
      elProgressbar.style.width = damageHP + "%";
      if (damageHP > 60) {
        elProgressbar.style.background = "#4CAF50";
      } else if (damageHP > 30) {
        elProgressbar.style.background = "#FF9800";
      } else {
        elProgressbar.style.background = "#F44336";
      }
    },

    renderHP() {
      this.renderHPLife();
      this.renderProgressbarHP();
    },
    changeHP(count) {
      const { damageHP } = this;
      const actual = Math.min(count, damageHP);
      this.damageHP = Math.max(0, damageHP - count);
      this.renderHP();

      if (this.damageHP === 0 && !this.lost) {
        this.lost = true;
        alert(`Бідний ${this.name} програв бій!`);
      }

      return actual;
    },
  };
}

const character = createPlayer({
  name: "Pikachu",
  elHPId: "health-character",
  elProgressbarId: "progressbar-character",
});

const enemy1 = createPlayer({
  name: "Charmander",
  elHPId: "health-enemy1",
  elProgressbarId: "progressbar-enemy1",
});

const enemy2 = createPlayer({
  name: "Bulbasaur",
  elHPId: "health-enemy2",
  elProgressbarId: "progressbar-enemy2",
});

function random(num) {
  return Math.ceil(Math.random() * num);
}

const logs = [];

function addLog({ attacker, target, damage, remaining }) {
  const time = new Date().toLocaleTimeString();
  const text = `${time} — ${attacker} атакував ${target} і наніс ${damage} урона. Залишилося: ${remaining} / ${
    target === enemy1.name ||
    target === enemy2.name ||
    target === character.name
      ? 100
      : 100
  }`;
  logs.unshift(text);
  renderLogs();
}

function renderLogs() {
  $logs.innerHTML = logs
    .map(
      (t) =>
        `<div class="log" style="padding:6px;border-bottom:1px solid #eee;">${t}</div>`
    )
    .join("");
}

function attack(attacker, target, maxDamage) {
  const damage = target.changeHP(random(maxDamage));
  addLog({
    attacker: attacker.name,
    target: target.name,
    damage,
    remaining: target.damageHP,
  });
}

$btnKick.addEventListener("click", function () {
  attack(character, enemy1, 20);
  attack(character, enemy2, 20);
});

$btnQuick.addEventListener("click", function () {
  attack(character, enemy1, 10);
  attack(character, enemy2, 10);
});

function init() {
  character.renderHP();
  enemy1.renderHP();
  enemy2.renderHP();
  renderLogs();
}

init();
