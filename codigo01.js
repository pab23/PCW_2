// VARIABLES GLOBALES
var total_recetas = 0,
	pagina_actual= 1,
	login_disponible = true;

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
			contrasena_incorrecta.innerHTML="El usuario y la contrase&ntilde;a no coinciden.<br>";
			contrasena_incorrecta.style.color="#FF0000";
			
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
	var num = 6;
	let xhr = new XMLHttpRequest(), 
	url = 'rest/receta/?u='+num;
	console.log(url);
	xhr.open( 'GET', url, true);
	xhr.onload = function(){
		let objJSON = JSON.parse(xhr.responseText);
			creaReceta(objJSON, num);
			};
	xhr.onerror = function(){
		console.log('ERROR');
	};

	
	xhr.send();
}

function creaReceta(recetas, num_recetas){
		var etiqueta = document.getElementById('cuerpo_receta'),
			i;

	for(i=0; i<num_recetas; i++){
		

		var titulo = recetas.FILAS[i].nombre,
			autor = recetas.FILAS[i].autor,
			comentario = recetas.FILAS[i].comentarios,
			posi = recetas.FILAS[i].positivos,
			nega = recetas.FILAS[i].negativos,
			foto = recetas.FILAS[i].fichero,
			descripcion = recetas.FILAS[i].descripcion_foto,
			fecha = recetas.FILAS[i].fecha,
			id = recetas.FILAS[i].id;


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
	ultimaPagina();
	paginaActual();

}

function ultimaPagina(){
	let pagina = document.getElementById('ult_pagina');

	pagina.innerHTML = Math.ceil((total_recetas)/6);
	pagina_actual = Math.ceil((total_recetas)/6);
}

function paginaActual(){
	let pagina = document.getElementById('pagina_actual');

	pagina.innerHTML = pagina_actual;
}

function nextPagina(){
	let pagina = document.getElementById('next_page');
	pagina_actual++;

}

function nuevoIngrediente(){
	let ingredientes =document.getElementById('ingrediente');

	ingredientes.innerHTML+='<li>'+ingredientes2.value+'</li>';
	ingredientes2.value='';
}
function anadirFoto(){

}

/*function buscando(){
	var url_string = window.location.href,
		url = new URL(url_string),
		usuario = url.searchParams.get('a'),
		submit = url.searchParams.get('submit'),
		pagina = url.searchParams.get('pag');
	let xhr = new XMLHttpRequest();

		if (usuario != undefined){
			var url_usr = 'rest/receta/?a='+usuario;
			xhr.open('GET', url_usr,  true);
			xhr.onload = function(){
				let objJSON = JSON.parse(xhr.responseText);
				creaReceta(objJSON, 6);
			};
			xhr.onerror = function(){
				console.log('ERROR');
			};

		}else if( (submit != undefined) || (typeof(pagina) != "undefined" && pagina !== null)){
    // Si usuari ha rellena formulario O pagina
    var titulo = url.searchParams.get("busqueda");
    console.log("titulo: ");
    console.log(titulo);
    var ingredientes = url.searchParams.get("ingredientes");
    console.log("ingredientes: ");
    console.log(ingredientes);
    var tmin = url.searchParams.get("tiempomin");
    console.log("tmin: ");
    console.log(tmin);
    var tmax = url.searchParams.get("tiempomax");
    console.log("tmax: ");
    console.log(tmax);
    var dificultad = url.searchParams.get("dificultad");
    console.log("difi: ");
    console.log(dificultad);
    var comensales = url.searchParams.get("comensales");
    console.log("comensales: ");
    console.log(comensales);
    var autor = url.searchParams.get("autor");
    console.log("autor: ");
    console.log(autor);
    if( ( submit=="Buscar" && titulo=="" && ingredientes=="" && tmin=="" && tmax=="" && dificultad=="" && comensales=="" && autor=="")){
      // Usuario no ha introducido ningun valor en la busqueda
      ultimasRecetas();
    	}
	}else{
		var busca ='rest/receta/?',
			parametros = [];

		if( typeof(titulo)!='undefined' && titulo!=null && titulo!=''){
			parametros.t = titulo.replace(/\s+/g,',');
		}
		if(typeof(ingredientes) != "undefined" && ingredientes !== null && ingredientes != "" ){
          params.i = ingredientes.replace(/\s+/g, ',');
        }

        if(typeof(tmin) != "undefined" && tmin !== null && tmin != "" ){
          params.di = tmin;
        }

        if(typeof(tmax) != "undefined" && tmax !== null && tmax != "" ){
          params.df = tmax;
        }

        if(typeof(dificultad) != "undefined" && dificultad !== null && dificultad != "" ){
          params.d = dificultad;
        }

        if(typeof(comensales) != "undefined" && comensales !== null && comensales != "" ){
          params.c = comensales;
        }

        if(typeof(autor) != "undefined" && autor !== null && autor != "" ){
          params.a = autor;
        }
        parametros.pag=0;
        parametros.lpag=4;
        if( typeof(pagina)!='undefined' && pagina!=null){
        	parametros.pag=pagina;
        	var records = url.searchParams.get('lpag');
        	if(typeof(records)!='undefined' && records!=null){
        		parametros.lpag=records;
        	}
        }
        var url_parametriza = build_params(parametros).replace(/\%2C/g,',');
        busca += url_parametriza;

        xhr.open('GET', busca, true);
        xhr.onload = function(){
				let objJSON = JSON.parse(xhr.responseText);
				creaReceta(objJSON, 6);
			};
			xhr.onerror = function(){
				console.log('ERROR');
		};
	}
}

function build_params(data){
	let ret = [];
	for (let pos in data){
		ret.push(encodeURIComponent(pos)+'='+encodeURIComponent(data[pos]));
	}
	return ret.join('&');
}*/

function comprobarUsuario(valor){
	let xhr = new XMLHttpRequest(),
		url = './rest/login/'+valor;

		xhr.open('GET', url, true);

		xhr.onload = function(){
			let obj= JSON.parse(xhr.responseText);

			if(obj.RESULTADO=='OK'){
				var ultado = document.getElementById('estado_usuario');
				if(obj.DISPONIBLE){
					login_disponible = true;
					ultado.innerHTML="Usuario disponible";
					ultado.style.color='#05A922';
				}else{
					login_disponible = false;
					ultado.innerHTML='Usuario no disponible';
					ultado.style.color='#FF0000';
				}
			}else{
				document.getElementById('estado_usuario').innerHTML='';
			}
		}
		xhr.send();
		return false;
}

function registro(formulario){
	let frm = new FormData(formulario),
		xhr = new XMLHttpRequest(),
		url = './rest/usuario/',
		error_log = false,
		error_contra = false;

	var pwd = formulario.parentNode.querySelector('input[id=pwd]').value,
		pwd2 = formulario.parentNode.querySelector('input[id=pwd2]').value;

		if(pwd != pwd2){
			console.log('Las contrasenas no coinciden');
			error_contra = true;
			contrasena_mal.innerHTML="Las contrase&ntilde;as no coinciden";
			contrasena_mal.style.color="#FF0000"
		}
		if(login_disponible && !error_log && !error_contra){
			xhr.open('POST', url, true);
		xhr.onload = function(){
			console.log(xhr.responseText);
			let obj = JSON.parse(xhr.responseText);
			
			if(obj.RESULTADO=='OK'){
				console.log('Registro correcto');
				document.getElementById('cuerpo_registro').reset();
				alert('El registro se ha completado correctamente');
				window.location.href="login.html";

			}else{
				console.log('Error en la peticion AJAX '+obj.CODIGO);
			}
		}
		xhr.send(frm);
	}			
	
	return false;
}


