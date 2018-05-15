var _ANCHO_ = 480,
	_ALTO_ = 480,
	ncols = 3;

function prepararCanvas(){
	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(e){
		e.width = _ANCHO_;
		e.height = _ALTO_;
	});
	//drag&drop
	let cv01 = document.querySelector('#cv01');
	cv01.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault();// return false;
	};
	cv01.ondrop = function(e){
		e.stopPropagation();
		e.preventDefault();

		let fichero = e.dataTransfer.files[0],
			fr = new FileReader();

		fr.onload = function(){
			let img = new Image();
			img.onload = function(){
				let ctx = cv01.getContext('2d');
				ctx.drawImage(img, 0, 0, cv01.width, cv01.height);
			}
			img.src = fr.result;
		}
		fr.readAsDataURL(fichero);
	}
	//EVENTOS DE RATON
	cv02.onmousemove = function(e){
		let x = e.offsetX,
			y = e.offsetY,
			dim = cv02.width / ncols,
			fila, col;
			col = Math.floor(x / dim);
			fila = Math.floor(y / dim);
			document.querySelector('#posXY').innerHTML = `(${x}, ${y})`;
			//pintar trozo imagen

			let ctx02 = cv02.getContext('2d');
			ctx02.drawImage(cv01,col*dim,fila*dim,dim,dim,col*dim, fila*dim,dim,dim);
	}
	cv02.onmouseenter = function(e){
		let x = e.offsetX,
			y = e.offsetY;

			document.querySelector('#posEXY').innerHTML = `(${x}, ${y})`;
	}
	cv02.onmouseleave = function(e){
		let x = e.offsetX,
			y = e.offsetY;

			document.querySelector('#posSXY').innerHTML = `(${x}, ${y})`;
	}
	cv02.onclick = function(e){
		let x = e.offsetX,
			y = e.offsetY,
			dim = cv02.width / ncols,
			fila, col;

			document.querySelector('#posCXY').innerHTML = `(${x}, ${y})`;
			//Sacar fila y columna
			col = Math.floor(x / dim);
			fila = Math.floor(y / dim);
			document.querySelector('#posFCXY').innerHTML = `(${col}, ${fila})`;

			let ctx = cv01.getContext('2d'),
				ctx2 = cv02.getContext('2d'),
				imgData = ctx.getImageData(col*dim,fila*dim,dim,dim);

			ctx2.putImageData(imgData,col*dim,fila*dim);
	}
	cv02.onmousedown = function(e){
		let x = e.offsetX,
			y = e.offsetY;

			document.querySelector('#posDXY').innerHTML = `(${x}, ${y})`;
	}
	cv02.onmouseup = function(e){
		let x = e.offsetX,
			y = e.offsetY;

			document.querySelector('#posUXY').innerHTML = `(${x}, ${y})`;
	}
}

function prueba01(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

		ctx.strokeStyle = '#a00';
		ctx.lineWidth = 2;
		ctx.strokeRect(0,0,100,75);
}

function trasladar(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

		ctx.translate(10,10); 
}

function escalar(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

		ctx.scale(1.5,1.5);
}

function rotar(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		ang = 45;

		ctx.rotate(Math.PI * (ang / 180));
}

function limpiar(e/*, id*/){
	//let cv = document.querySelector('#cv0'+id);
	let footer = e.target.parentNode,
		section = footer.parentNode,
		cv = section.querySelector('canvas');
	cv.width = cv.width;
}

function imagen(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		img = new Image();

	img.onload = function(){
		ctx.drawImage(img,0,0,cv.width/2, cv.height/2);
	};
	img.src = 'fairfox.png';
	
}

function imagen2(){
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		img = new Image();

	img.onload = function(){
		ctx.drawImage(img, 300, 300, cv.width, cv.height, 0, 0, cv.width, cv.height);
	};
	img.src = 'fairfox.png';

}

function copiaCanvas(){
	let cv = document.querySelector('#cv01'),
		cv2 = document.querySelector('#cv02'),
		ctx = cv.getContext('2d'),
		ctx2 = cv2.getContext('2d'),
		imgData;

		imgData = ctx.getImageData( 0, 0, cv.width, cv.height);

		ctx2.putImageData( imgData, 0, 0);
}

function lineas(){
	let cv = document.querySelector('#cv02'),
		ctx = cv.getContext('2d'),
		dimension = cv.width/3;

	ctx.beginPath();
	ctx.strokeStyle = '#FF0000';
	ctx.lineWidth = 2;

	for(let i = 0; i < ncols; i++){
		//Lineas horizontales
		ctx.moveTo(0, i * dimension);
		ctx.lineTo(cv.width, i * dimension);
		//Lineas verticales
		ctx.moveTo(i * dimension, 0);
		ctx.lineTo(i * dimension, cv.height);
	}
	ctx.stroke();
}