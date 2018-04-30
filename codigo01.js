// VARIABLES GLOBALES
var total_recetas = 0,
	pagina_actual= 1;

function hacerLogin(frm){
	let xhr= new XMLHttpRequest(),
	url='./rest/login/', 
	fd = new FormData(frm);

	xhr.open('POST', url, true);
	xhr.onload = function(){
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);
		if(r.RESULTADO == 'OK'){
			sessionStorage.setItem('user', xhr.responseText);
			console.log('Sesion iniciada');
			alert('Sesion iniciada correctamente');
			location.href= 'index.html';
		}else{
			console.log('Error en el login');
			alert('El usuario y la contrasena no coinciden');
			location.reload();
		}

	};
	if(document.getElementById('recordar').checked){
		localStorage.setItem('recordado', xhr.responseText);
	}
	xhr.send(fd);
	return false;
}

function logged(){
	var esta = sessionStorage.getItem('user');
	if(esta){
		document.getElementById('log').innerHTML="";
		document.getElementById('reg').innerHTML="";
	}else{
		document.getElementById('out').innerHTML="";
		document.getElementById('new').innerHTML="";
	}
}

function cerrarSesion(){
	sessionStorage.removeItem('user');
	alert('se ha cerrado sesion correctamente');
	console.log('Sesion cerrada correctamente');
}
//function recordar_recordado(){
//	if(localStorage.getItem('recordado')!= null){
		//document.login= JSON.parse(localStorage.getItem('recordado'));
//	}
//}

function busqueda_rapida(frm){
	forma = new FormData(frm);
	location.href='buscar.html';
}
function ultimasRecetas(){
	let xhr = new XMLHttpRequest(), 
	url = 'rest/receta/?u=6';
	xhr.open( 'GET', url, true);
	xhr.onload = function(){
		let objJSON = JSON.parse(xhr.responseText);
			creaReceta(objJSON);
			};
	xhr.onerror = function(){
		console.log('ERROR');
	};

	xhr.send();

}

function creaReceta(recetas){
	var num_recetas = 6,
		etiqueta = document.getElementById('cuerpo_receta');

	for(let i=0; i<num_recetas; i++){
		
		var titulo = recetas.FILAS[total_recetas].nombre,
			autor = recetas.FILAS[total_recetas].autor,
			comentario = recetas.FILAS[total_recetas].comentarios,
			posi = recetas.FILAS[total_recetas].positivos,
			nega = recetas.FILAS[total_recetas].negativos,
			foto = recetas.FILAS[total_recetas].fichero,
			descripcion = recetas.FILAS[total_recetas].descripcion_foto,
			fecha = recetas.FILAS[total_recetas].fecha,
			id = recetas.FILAS[total_recetas].id;


		var receta = 
			`<article>
				<header>
					<a href="receta.html?${id}"><h2>${titulo}</h2></a>
				</header>
					<a href="receta.html?${id}"><img src=fotos/${foto} alt="No se ha podido cargar la imagen"></a><p>${descripcion}</p>
				<footer>
					<span class="icon-thumbs-up">${posi}</span><span class="icon-thumbs-down">${nega}</span><span class="icon-comment">${comentario}</span><br>
					Subido el d&iacute;a <i><time datetime="${fecha}">${fecha}</time></i> por <a href="buscar.html?autor=${autor}"><b>${autor}</b></a>.
				</footer>
			</article>`;

			etiqueta.innerHTML += receta;
			total_recetas++;

	}
}

function ultimaPagina(){
	let pagina = document.getElementById('pagina'),
	calcu = Math.ceil((total_recetas)/6);

	pagina.innerHTML = calcu;
	pagina_actual = calcu;
}