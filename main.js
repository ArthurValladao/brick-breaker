let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let raio = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let alturaBarra = 10;
let larguraBarra = 75;
let barraX = (canvas.width - larguraBarra) / 2;
let btePressionado = false;
let btdPressionado = false;
let qtdBlocosLinha = 5;
let qtdBlocosColuna = 3;
let blocosLargura = 75;
let blocosAltura = 20;
let blocosEspaco = 10;
let blocosEspacoTopo = 30;
let blocosEspacoEsquerda = 30;
let pontos = 0;
let vidas = 3;
let pausado = false;
let fase = 1;

let blocos = [];

function gerarBlocos() {
  blocos = [];
  for (let i = 0; i < qtdBlocosColuna; i++) {
    blocos[i] = [];
    for (let j = 0; j < qtdBlocosLinha; j++) {
      blocos[i][j] = { x: 0, y: 0, status: 1 };
    }
  }
}

function configurarFase() {
  if (fase === 1) {
    larguraBarra = 75;
    qtdBlocosLinha = 5;
    qtdBlocosColuna = 3;
    dx = 2;
    dy = -2;
    canvas.width = 350; 
    canvas.height = 280;
  } else if (fase === 2) {
    larguraBarra = 60;
    qtdBlocosLinha = 7;
    qtdBlocosColuna = 4;
    dx *= 1.4;
    dy *= 1.4;
    canvas.width = 450; 
    canvas.height = 400; 
  } else if (fase === 3) {
    larguraBarra = 45;
    qtdBlocosLinha = 9;
    qtdBlocosColuna = 5;
    dx *= 1.6;
    dy *= 1.6;
    canvas.width = 650; 
    canvas.height = 500; 
  }
  gerarBlocos();
  x = canvas.width / 2;
  y = canvas.height - 30;
  barraX = (canvas.width - larguraBarra) / 2;
  pontos = 0;
}

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("mousemove", mouseMove, false);

function keyDown(e) {
  if (e.code === "ArrowRight") {
    btePressionado = true;
  } else if (e.code === "ArrowLeft") {
    btdPressionado = true;
  } else if (e.code === "KeyP") {
    pausado = !pausado;
  }
}

function keyUp(e) {
  if (e.code === "ArrowRight") {
    btePressionado = false;
  } else if (e.code === "ArrowLeft") {
    btdPressionado = false;
  }
}

function mouseMove(e) {
  let relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX < canvas.width) {
    barraX = relativeX - larguraBarra / 2;
  }
}

function colisao() {
  for (let i = 0; i < qtdBlocosColuna; i++) {
    for (let j = 0; j < qtdBlocosLinha; j++) {
      let b = blocos[i][j];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + blocosLargura &&
          y > b.y &&
          y < b.y + blocosAltura
        ) {
          dy = -dy;
          b.status = 0;
          pontos++;
          if (pontos === qtdBlocosColuna * qtdBlocosLinha) {
            if (fase < 3) {
              fase++;
              configurarFase();
              alert("Fase " + fase + "!");
            } else {
              alert("Você venceu o jogo!");
              document.location.reload();
            }
          }
        }
      }
    }
  }
}

function desenharBola() {
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function desenharBarra() {
  ctx.beginPath();
  ctx.rect(barraX, canvas.height - alturaBarra, larguraBarra, alturaBarra);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function desenharBlocos() {
  for (let i = 0; i < qtdBlocosColuna; i++) {
    for (let j = 0; j < qtdBlocosLinha; j++) {
      if (blocos[i][j].status == 1) {
        let b = blocos[i][j];
        b.x = i * (blocosLargura + blocosEspacoEsquerda) + blocosEspacoEsquerda;
        b.y = j * (blocosAltura + blocosEspaco) + blocosEspacoTopo;
        ctx.beginPath();
        ctx.rect(b.x, b.y, blocosLargura, blocosAltura);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function desenharPontos() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Pontos: " + pontos, 8, 20);
}

function desenharVidas() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Vidas: " + vidas, canvas.width - 65, 20);
}

function desenharFase() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Fase: " + fase, canvas.width / 2 - 30, 20);
}

function desenharPausa() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("JOGO PAUSADO", canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "start";
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharBlocos();
  desenharBola();
  desenharBarra();
  desenharPontos();
  desenharVidas();
  desenharFase();

  if (pausado) {
    desenharPausa();
    requestAnimationFrame(desenhar);
    return;
  }

  colisao();

  if (x + dx > canvas.width - raio || x + dx < raio) {
    dx = -dx;
  }

  if (y + dy < raio) {
    dy = -dy;
  } else if (y + dy > canvas.height - raio) {
    if (x > barraX && x < barraX + larguraBarra) {
      dy = -dy;
    } else {
      vidas--;
      if (!vidas) {
        alert("Você perdeu!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        barraX = (canvas.width - larguraBarra) / 2;
      }
    }
  }

  if (btePressionado && barraX < canvas.width - larguraBarra) {
    barraX += 7;
  } else if (btdPressionado && barraX > 0) {
    barraX -= 7;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(desenhar);
}

configurarFase();
desenhar();
