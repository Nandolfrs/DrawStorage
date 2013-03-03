//Variáveis Globais
var canvas, ctx, prevX=0, currX=0, prevY=0, currY=0, flag=false, dot_flag=false, w, h;
var cor="black", linha=6, radius=15, lados=28, pontas=22, ferramenta=1;

//Função inicial
function init()
{
	//Instanciando Canvas
	canvas = document.getElementById('canvasDraw');
	ctx = canvas.getContext("2d");

	//Variáveis para armazenar o tamanho do canvas
	w = canvas.width;
	h = canvas.height;

	//Alterando cor do fundo do canvas
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0,0,w,h);

	//Escrita inicial
	ctx.font = "25px Times";
	ctx.strokeText("Desenvolvido por:", 80, 55);
	ctx.strokeText("Luiz Fernando", 100, 95);
	ctx.strokeText("Otávio Augusto", 95, 135);
	ctx.font = "20px Times";
	ctx.strokeStyle = "#009";
	ctx.strokeText("2013 IF Sudeste - Barbacena", 60, 200);
	ctx.strokeText("JQueryMobile", 115, 230);
	ctx.font = "18px Times";
	ctx.strokeStyle = "red";
	ctx.strokeText("Clique no botão limpar antes de desenhar!", 20, 310);

	//Funções acionadas com o click do mouse
	//Mouse em movimento
	canvas.addEventListener("mousemove", moverMouse, false);
	function moverMouse(e) {
		findxy('move',e);
	};

	//Botão do mouse clicado
	canvas.addEventListener("mousedown", clicarMouse, false);
	function clicarMouse(e) {
		findxy('down',e);
	};

	//Botão do mouse solto
	canvas.addEventListener("mouseup", soltarMouse, false);
	function soltarMouse(e) {
		findxy('up',e);
	};

	//Mouse fora do canvas
	canvas.addEventListener("mouseout", mouseFora, false);
	function mouseFora(e) {
		findxy('out',e);
	};
} 

//Função para definir espessura da linha
function line(obj) {
    switch(obj.id)
    {
	    case "1px": 
	      linha = 1;
		  radius = 5;
		  lados = 15;
		  pontas = 12;
	      break;
	    case "2px": 
	      linha = 3;
		  radius = 10;
		  lados = 22;
		  pontas = 16;
	      break;
	    case "3px": 
	      linha = 6;
		  radius = 15;
		  lados = 28;
		  pontas = 22;
	      break;
	    case "4px": 
	      linha = 9;
		  radius = 20;
		  lados = 35;
		  pontas = 28;
	      break;
	    case "5px": 
	      linha = 12;
		  radius = 25;
		  lados = 45;
		  pontas = 34;
	      break;
    }
}

function tools(obj) {
	switch(obj.id)
	{
		case "pencil":
			ferramenta = 1;
			break;
		case "square":
			ferramenta = 2;
			break;
		case "circle":
			ferramenta = 3;
			break;
		case "star":
			ferramenta = 4;
			break;
		case "erase":
			ferramenta = 5;
			break;
	}
}

//Função que desenha com o pincel
function draw()
{
	ctx.beginPath();
	ctx.moveTo(prevX,prevY);
	ctx.lineTo(currX,currY);
	if(ferramenta==1)
		ctx.strokeStyle = cor;
	else
		ctx.strokeStyle = "white";
	ctx.lineWidth = linha;
	ctx.stroke();
	ctx.closePath();
}

//Função para desenhar quadrados
function square()
{
	ctx.fillStyle = cor;
	ctx.fillRect(currX, currY, lados, lados); 
}

//Função para desenhar circulos
function circle()
{
	ctx.beginPath();
	var anticlockwise = true;
	var startAngle = 0;
	var endAngle = Math.PI*2;
	ctx.arc(currX, currY, radius, startAngle, endAngle, anticlockwise);
	ctx.closePath();
	ctx.fillStyle = cor;
	ctx.fill(); 
}

//Função para desenhar estrelas
function star()
{
	ctx.beginPath();
	ctx.translate(currX, currY);
	ctx.moveTo(0, 0 - pontas);
	for(var i=0; i<5; i++)
	{
		ctx.rotate(Math.PI / 5);
		ctx.lineTo(0, 0 - (pontas*0.5));
		ctx.rotate(Math.PI / 5);
		ctx.lineTo(0, 0 - pontas);
	}
	ctx.closePath();
	ctx.translate(-currX, -currY);
	ctx.fillStyle = cor;
	ctx.fill();
}

//Função do botão limpar
function clearC()
{
	ctx.clearRect(0,0,w,h);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,w,h);
}

//Função do botão salvar #WebStorage
function save()
{	
	localStorage.canvasImage = canvas.toDataURL();				
}

//Função do botão carregar #WebStorage
function load()
{
	var img = new Image();
	img.src = localStorage.canvasImage;
	img.onload = function() {
		ctx.drawImage(img, 0, 0, img.width, img.height);
	};
}

//Função de salvar imagem como arquivo
/*function saveToFile()
{
	var dataURL = canvas.toDataURL();
	document.location.href = dataURL;
}*/

//Função que localiza a posição do mouse
//para desenhar no canvas
function findxy(res,e)
{
	//Mouse clicado
	if(res=='down')
    {   prevX = currX;
		prevY = currY;
		currX = e.clientX-canvas.offsetLeft;
		currY = e.clientY-canvas.offsetTop; 
		flag = true;
		dot_flag = true;
		//FERRAMENTAS
		//Pincel
		if(ferramenta==1 || ferramenta==5) {
	    	ctx.beginPath();
			if(ferramenta==1)
				ctx.fillStyle = cor;
			else
				ctx.fillStyle = "white";
	    	ctx.fillRect(currX,currY,2,2);
	    	ctx.closePath();
			dot_flag = false;
		}
		//Quadrado
		else if(ferramenta==2) {
			square();
	    	dot_flag = false;
		}
		//Circulo
		else if(ferramenta==3) {
			circle();
			dot_flag = false;
		}
		//Estrela
		else if(ferramenta==4) {
			star();
			dot_flag = false;
		}
    }
	//Mouse solto ou fora do canvas
	if(res=='up'||res=="out")
	{
	    flag = false; 
	} 
	//Mouse em movimento clicado
	if(res=='move')
	{
	    if(flag)
	    {
			prevX = currX;
			prevY = currY;
			currX = e.clientX-canvas.offsetLeft;
			currY = e.clientY-canvas.offsetTop;
			if(ferramenta==1 || ferramenta==5)
				draw();
			else if(ferramenta==2)
				square();
			else if(ferramenta==3)
				circle();
			else if(ferramenta==4)
				star();
	    }
	}
}

