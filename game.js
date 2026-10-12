const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function findLine(board, mark) {
  return LINES.find((line) => line.every((index) => board[index] === mark)) || null;
}

function createGame() {
  let board = Array(9).fill(null);
  let turn = "X";
  let over = false;
  let winningLine = null;

  return {
    board() {
      return board.slice();
    },
    turn() {
      return turn;
    },
    over() {
      return over;
    },
    winningLine() {
      return winningLine ? winningLine.slice() : null;
    },
    play(index) {
      if (over || board[index] != null || index < 0 || index > 8 || !Number.isInteger(index)) {
        return { ok: false };
      }

      board[index] = turn;
      const line = findLine(board, turn);
      if (line) {
        over = true;
        winningLine = line;
        return { ok: true, result: "win", player: turn, line };
      }

      if (board.every((cell) => cell != null)) {
        over = true;
        return { ok: true, result: "draw" };
      }

      const played = turn;
      turn = turn === "X" ? "O" : "X";
      return { ok: true, result: "continue", player: played };
    },
    reset() {
      board = Array(9).fill(null);
      turn = "X";
      over = false;
      winningLine = null;
    },
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createGame, LINES, findLine };
}

if (typeof document !== "undefined") {
  const game = createGame();
  const scores = { X: 0, O: 0, draw: 0 };

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const scoreX = document.getElementById("score-x");
  const scoreO = document.getElementById("score-o");
  const scoreDraw = document.getElementById("score-draw");
  const cells = [];

  for (let index = 0; index < 9; index += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Square ${index + 1}, empty`);
    cell.addEventListener("click", () => handlePlay(index));
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  document.getElementById("again").addEventListener("click", () => {
    game.reset();
    render();
  });

  document.getElementById("clear-scores").addEventListener("click", () => {
    scores.X = 0;
    scores.O = 0;
    scores.draw = 0;
    game.reset();
    render();
  });

  function handlePlay(index) {
    const outcome = game.play(index);
    if (!outcome.ok) return;

    if (outcome.result === "win") scores[outcome.player] += 1;
    if (outcome.result === "draw") scores.draw += 1;
    render();
  }

  function render() {
    const board = game.board();
    const line = game.winningLine();
    const winning = new Set(line || []);

    board.forEach((mark, index) => {
      const cell = cells[index];
      cell.textContent = mark || "";
      cell.dataset.mark = mark || "";
      cell.classList.toggle("win", winning.has(index));
      cell.disabled = game.over() || mark != null;
      const place = `Square ${index + 1}`;
      cell.setAttribute(
        "aria-label",
        mark ? `${place}, ${mark}` : `${place}, empty`,
      );
    });

    scoreX.textContent = String(scores.X);
    scoreO.textContent = String(scores.O);
    scoreDraw.textContent = String(scores.draw);

    statusEl.classList.remove("win", "draw");
    if (!game.over()) {
      statusEl.textContent = `${game.turn()}’s turn`;
      return;
    }

    if (line) {
      const winner = board[line[0]];
      statusEl.textContent = `${winner} wins`;
      statusEl.classList.add("win");
      return;
    }

    statusEl.textContent = "Draw";
    statusEl.classList.add("draw");
  }

  render();
}
ga
