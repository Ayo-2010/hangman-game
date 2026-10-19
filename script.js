const WORDS = [
  { word: 'JAVASCRIPT', hint: 'Programming language' },
  { word: 'MOUNTAIN', hint: 'Landform' },
  { word: 'ELEPHANT', hint: 'Animal' },
  { word: 'GUITAR', hint: 'Instrument' },
  { word: 'PENGUIN', hint: 'Animal' },
  { word: 'VOLCANO', hint: 'Landform' },
  { word: 'GALAXY', hint: 'Space' },
  { word: 'ORANGE', hint: 'Fruit' },
  { word: 'LIBRARY', hint: 'Place' },
  { word: 'COMPASS', hint: 'Tool' },
  { word: 'DOLPHIN', hint: 'Animal' },
  { word: 'CASTLE', hint: 'Building' },
  { word: 'RAINBOW', hint: 'Weather' },
  { word: 'PLANET', hint: 'Space' },
  { word: 'BICYCLE', hint: 'Transport' },
  { word: 'CHIMNEY', hint: 'House part' },
  { word: 'DIAMOND', hint: 'Gemstone' },
  { word: 'FOREST', hint: 'Nature' },
  { word: 'HARBOR', hint: 'Place' },
  { word: 'ISLAND', hint: 'Landform' },
  { word: 'JOURNEY', hint: 'Travel' },
  { word: 'KITCHEN', hint: 'Room' },
  { word: 'LANTERN', hint: 'Object' },
  { word: 'MACHINE', hint: 'Object' },
  { word: 'OCTOPUS', hint: 'Animal' },
  { word: 'PYRAMID', hint: 'Building' },
  { word: 'ROCKET', hint: 'Space' },
  { word: 'SUNFLOWER', hint: 'Plant' },
  { word: 'TREASURE', hint: 'Adventure' },
  { word: 'UMBRELLA', hint: 'Object' },
  { word: 'VILLAGE', hint: 'Place' },
  { word: 'WHISPER', hint: 'Sound' },
  { word: 'YOGURT', hint: 'Food' },
  { word: 'ZEBRA', hint: 'Animal' },
  { word: 'ANCHOR', hint: 'Sea' },
  { word: 'BRIDGE', hint: 'Structure' },
  { word: 'CAMERA', hint: 'Object' },
  { word: 'DRAGON', hint: 'Myth' },
  { word: 'MEADOW', hint: 'Nature' },
  { word: 'CIRCUS', hint: 'Entertainment' },
];

const PARTS = ['p-head', 'p-body', 'p-arm-l', 'p-arm-r', 'p-leg-l', 'p-leg-r'];
const MAX_WRONG = 6;

const wordEl = document.getElementById('word');
const hintEl = document.getElementById('hint');
const livesEl = document.getElementById('lives');
const keysEl = document.getElementById('keys');
const messageEl = document.getElementById('message');
const newBtn = document.getElementById('newBtn');

let entry = WORDS[0];
let guessed = new Set();
let wrong = 0;
let over = false;

function pickWord() {
  let next = entry;
  while (next.word === entry.word) {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return next;
}

function buildKeys() {
  keysEl.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.type = 'button';
    btn.textContent = letter;
    btn.dataset.letter = letter;
    btn.addEventListener('click', () => guess(letter));
    keysEl.appendChild(btn);
  });
}

function renderWord() {
  wordEl.innerHTML = '';
  entry.word.split('').forEach((letter) => {
    const span = document.createElement('span');
    const visible = guessed.has(letter) || over;
    span.className = 'letter' + (visible ? '' : ' blank');
    if (over && !guessed.has(letter)) span.classList.add('missed');
    span.textContent = visible ? letter : '';
    wordEl.appendChild(span);
  });
}

function renderLives() {
  livesEl.textContent = MAX_WRONG - wrong;
  PARTS.forEach((id, index) => {
    document.getElementById(id).classList.toggle('on', index < wrong);
  });
}

function endGame(won) {
  over = true;
  messageEl.hidden = false;
  messageEl.className = 'message ' + (won ? 'win' : 'lose');
  messageEl.textContent = won ? `You got it — ${entry.word}.` : `Out of lives. The word was ${entry.word}.`;
  keysEl.querySelectorAll('.key').forEach((btn) => {
    btn.disabled = true;
  });
  renderWord();
}

function guess(letter) {
  if (over || guessed.has(letter)) return;

  guessed.add(letter);
  const btn = keysEl.querySelector(`[data-letter="${letter}"]`);
  const hit = entry.word.includes(letter);

  if (btn) {
    btn.disabled = true;
    btn.classList.add(hit ? 'hit' : 'miss');
  }

  if (!hit) wrong++;

  renderLives();
  renderWord();

  const solved = entry.word.split('').every((char) => guessed.has(char));
  if (solved) {
    endGame(true);
  } else if (wrong >= MAX_WRONG) {
    endGame(false);
  }
}

function newGame() {
  entry = pickWord();
  guessed = new Set();
  wrong = 0;
  over = false;

  hintEl.textContent = `Hint: ${entry.hint}`;
  messageEl.hidden = true;
  keysEl.querySelectorAll('.key').forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('hit', 'miss');
  });

  renderLives();
  renderWord();
}

document.addEventListener('keydown', (event) => {
  const letter = event.key.toUpperCase();
  if (/^[A-Z]$/.test(letter)) guess(letter);
});

newBtn.addEventListener('click', newGame);

buildKeys();
entry = WORDS[0];
newGame();
