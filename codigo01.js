// VARIABLES GLOBALES
var total_recetas = 0,
	numPagActual= 1,
	login_disponible = true,
	comprobante=false;
	recetasCreadas = 0;
	

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
		
		if(recetas.FILAS[i] != undefined){

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


function anadirFoto(){

}


/*function busquedaRapida(){
	let busca = document.getElementById('buscaReceta'),
		url = "./rest/receta/?t=",
		xhr = new XMLHttpRequest();

	url += busca.value;

	console.log(url);

	xhr.open('GET', url, true);

	xhr.onload = function(){
		
		let obj = JSON.parse(xhr.responseText);

		if( obj.RESULTADO =='OK'){
			console.log("Recetas obtenidas correctamente");
			creaReceta(obj, 6);
		}else{
			console.log("eror en la peticion AJAX");
		}
	};

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
					login_dispname=cocidoonible = false;
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

function compruebaUsuario() {
  // Comprobar tipo de busqueda
  var url_string = window.location.href;
  var url = new URL(url_string);
  var user = url.searchParams.get("a");
  var submit = url.searchParams.get("submit");
  var pagina = url.searchParams.get("pag");
  console.log("user:");
  console.log(user);
  if( user != undefined )
  {
    // Si hay usuario en la URL se realiza la consulta
    console.log("Usuario activo: ");
    console.log(user);
    var url_u = "rest/receta/?a="+user;
    fetch( url_u )
    .then(
      function(response){
        if( response.status !== 200 )
        {
          console.log("Error fetch usuario en buscar.");
        }
        response.json().then( function(data){
          console.log("data: ");
          console.log(data);
          // Si el JSON es OK

          var docu = getElementById('cuerpo_receta');
          for (var i = 0; i < data.FILAS.length; i++) {
            docu.innerHTML +=
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

          }
        });
      })
    .catch( function( err ) {

    })

  }
  else if( (submit != undefined) || (typeof(pagina) != "undefined" && pagina !== null) )
  {
    // Si usuario ha rellenado formulario O pagina
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
    if( ( submit=="Buscar" && titulo=="" && ingredientes=="" && tmin=="" && tmax=="" && dificultad=="" && comensales=="" && autor=="" ) )
    {
      // Usuario no ha introducido ningun valor en la busqueda
      pedirEntradas();
    }
    else {
      // Si introduce cualquier otra cosa -> realizar busqueda
      var link = "rest/receta/?";
      // Si ha realizado una busqueda

        var params = [];

        if(typeof(titulo) != "undefined" && titulo !== null && titulo != "" ){
          params.t = titulo.replace(/\s+/g, ',');
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

        params.pag = 0;
        params.lpag = 4;
        if(typeof(pagina) != "undefined" && pagina !== null){
          params.pag = pagina;
          var records = url.searchParams.get("lpag");
          if(typeof(records) != "undefined" && records !== null){
            params.lpag = records;
          }
        }

        var url_params = build_params(params).replace(/\%2C/g,',');
        link += url_params;
        console.log("params:");
        console.log(url_params);
        console.log("link:");
        console.log(link);

        fetch(link)
        .then( function(response){
          if(response.status !== 200){
            console.log("Error status");
          }
          response.json().then(function( search ) {
            console.log("search: ");
            console.log(search);

            var cont = document.getElementById('cuerpo_receta');

            if(search.FILAS.length > 0){

              // Muestra infor

              var i;
              for(i=0;i<4;i++)
              {
                cont.innerHTML +=

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

              }
              // paginacion
              console.log("tot:");
              console.log(search.TOTAL_COINCIDENCIAS);
              paginacion(search.TOTAL_COINCIDENCIAS,4);
            }
            else{
              // No resultados
              cont.innerHTML +=
              `
              <article class="card">
              <p>No se han encontrado resultados.</p>
              </article>
              `;
            }
          })
        })
        .catch( function(err){
          console.log("Error catch", err);
        });

    }


  }
  else
  {
    // Si ha entrado en buscar.html sin parametros ni nada
    pedirEntradas();
    console.log("pagina: ");
    console.log(pagina);
  }
}

function build_params(data) {
  let ret = [];
  for (let pos in data){
    ret.push(encodeURIComponent(pos) + "=" + encodeURIComponent(data[pos]));
  }
  return ret.join('&');
}

function pedirEntradas(){

	console.log('HE ENTRADO A PEDIR ENTRADAS')
	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/?u=6';
	var totalRecetas = 0;
		
	xhr.open('GET',url, true);
	xhr.onload = function(){
		var recetas = JSON.parse(xhr.responseText);			
		console.log(recetas);

			ponerRecetas(recetas);

			totalRecetas = document.getElementById('ult_pagina');
			paginaActual = document.getElementById('paginaActual');
			

			totalRecetas.innerHTML = Math.ceil((recetas.FILAS.length)/6); // redondeamos hacia arriba
			botonesIndex(recetas.FILAS.length);
			console.log('ENTROOOOOO');
		

		};

		xhr.send();


	}



function ponerRecetas(recetas){

	var recetas_a_mostrar = 6;
	let todas = document.getElementById('cuerpo_receta');


	for(let x =0 ; x<recetas_a_mostrar;x++){


		//JSON

		var titulo = recetas.FILAS[recetasCreadas].nombre,
			autor  = recetas.FILAS[recetasCreadas].autor,
			comentarios  = recetas.FILAS[recetasCreadas].comentarios,
			pos  = recetas.FILAS[recetasCreadas].positivos,
			neg  = recetas.FILAS[recetasCreadas].negativos,
			foto   = recetas.FILAS[recetasCreadas].fichero,
			descripcion  = recetas.FILAS[recetasCreadas].descripcion_foto,
			fecha  = recetas.FILAS[recetasCreadas].fecha,
			id  = recetas.FILAS[recetasCreadas].id;

		//Codigo HTML

		var articulo =

			`<article>
				<header>
					<a href="receta.html?${id}"><h2>${titulo}</h2></a>
				</header>
					<a href="receta.html?${id}"><img src=fotos/${foto} alt="No se ha podido cargar la imagen"></a><p>${descripcion}</p>
				<footer>
					<span class="icon-thumbs-up">${pos}</span><span class="icon-thumbs-down">${neg}</span><span class="icon-comment">${comentarios}</span><br>
					Subido el d&iacute;a <i><time datetime="${fecha}">${fecha}</time></i> por <a href="buscar.html?autor=${autor}"><b>${autor}</b></a>.
				</footer>
			</article>`;


			if(articulo!=null){
			todas.innerHTML+= articulo;
			recetasCreadas++;
			console.log('Recetas Creadas: ' + recetasCreadas);
			}

	}
}


function botonesIndex(total){

	var paginaActual = document.getElementById('pagina_actual');

	if(recetasCreadas<=6){

		paginaActual.innerHTML = numPagActual;

	}else{


	}

}
/***********************************************************************************************AÑADIR RECETAS*********************************************************************************************************/
var ing_num = 0;

/*function nuevaReceta(formulario){
	let frm = new FormData(formulario),
		xhr = new XMLHttpRequest(),


}*/
function nuevoIngrediente(){
	let ingredientes =document.getElementById('ingrediente');

	if(ingredientes != ""){
		var list = ingredientes;
		ingredientes.innerHTML+='<li>'+ingredientes2.value+'</li>';
	}
	ingredientes2.value='';
	ing_num++;
}

/*function enviarIngredientes(id){
  let xhr = new XMLHttpRequest(),
  fd  = new FormData(),
  url = 'rest/receta/' + id + '/ingredientes',
  usu;

  if(xhr){
    var ul = document.getElementById("ingrediente");
    var vIngredientes = [];
    var i;

    for(i=0; i<ul.children.length; i++){
      vIngredientes.push(ul.childNodes[i].innerText);
    }

    usu = JSON.parse(sessionStorage.getItem('user'));

    fd.append('l',usu.login);
    fd.append('i',JSON.stringify(vIngredientes));
    console.log(fd);

    xhr.open('POST', url, true);
    xhr.onload = function(){
       console.log(xhr.responseText);

       let r = JSON.parse(xhr.responseText);

       if(r.RESULTADO == "OK"){
         console.log("ingredientes enviados a la BD");
       } else {
         console.log("nope");
       }
    }
    xhr.setRequestHeader('Authorization', usu.clave);
    xhr.send(fd);
  }
}*/




function muestraReceta(){
	let url = window.location.href,
		xhr = new XMLHttpRequest(),
		parsed = url.split("?"),
		busca = "rest/receta/";

	busca += parsed[1];
	console.log(busca);
	if(parsed[1]!=undefined){
		xhr.open('GET', busca, true);
		xhr.onload =function(){
				obj = JSON.parse(xhr.responseText);

				if(obj.RESULTADO == 'OK'){
					console.log('peticion AJAX correcta')
					var receta = document.getElementById('receta'),
						receta2 = document.getElementById('receta2'),
						difi = "Dif&iacute;cil";
					ingredientes = ponerIngredientes(parsed[1]);
					
					if(obj.FILAS[0].dificultad == 0){
						difi = "F&aacute;cil";
					}
					if(obj.FILAS[0].dificultad == 1){
						difi ="Media";
					}
					receta.innerHTML= 
					`
						<header id="titulo_receta"><a href="receta.html?${parsed[1]}"><h2 title="${obj.FILAS[0].nombre}">${obj.FILAS[0].nombre}</h2></a></header>
						<a href="receta.html"><img id="imagen_receta" src="fotos/${obj.FILAS[0].fichero}" alt="No se ha podido cargar la imagen"></a><br>
					`
					ponerIngredientes(parsed[1]);
					nuevoComentario();
					muestraComentario();
					receta2.innerHTML= 
					`
						<b>Fecha de alta:</b> <time datetime="${obj.FILAS[0].fecha}">${obj.FILAS[0].fecha}</time><br><br>
						<p id="parrafo">
						<b>Elaboración:</b>${obj.FILAS[0].elaboracion}<br><br>
					</p>

						<b>Tiempo de elaboración:</b>${obj.FILAS[0].tiempo}<br><br>
						<b>Dificultad:</b>${difi}<br><br>
						<b>Número de comensales:</b>${obj.FILAS[0].comensales}<br><br>
						<b>Número de votos positivos:</b> ${obj.FILAS[0].positivos}<span class="icon-thumbs-up"></span><br><br>
						<b>Número de votos negativos:</b> ${obj.FILAS[0].negativos}<span class="icon-thumbs-down"></span><br><br>
						<b>Número de comentarios:</b> <a href="#comentario"> ${obj.FILAS[0].comentarios}<span class="icon-comment"></span></a><br><br>
						<b>Autor:</b> <a href="buscar.html"><b>${obj.FILAS[0].autor}</b></a><br><br>	
						<b>¿Te ha gustado esta receta?</b><input type="button" value="Me gusta" onclick=gusta()> <input type="button" value="No me gusta" onclick=noGusta()> 
					
					

					<br>

					</div>
					`;
				}
			}
			xhr.send();
		}else{
			window.location.href="index.html";
		}
}

function ponerIngredientes(id){
	let xhr =new XMLHttpRequest(),
		url = "./rest/receta/"+id+"/ingredientes";

		xhr.open('GET', url, true);

		xhr.onload = function(){
			var ingredientes = JSON.parse(xhr.responseText),
				num_ingres = ingredientes.FILAS.length,
				insert = document.getElementById("ingredientess");

			for(let i = 0; num_ingres>i;i++){
					insert.innerHTML += `<li>${ingredientes.FILAS[i].nombre}</li>`;
					
			}
		}
		xhr.send();

}

/***********************************************************************************************RECETAS*********************************************************************************************************/
function nuevoComentario(){
	var logged = sessionStorage.getItem("user"),
		xhr = new XMLHttpRequest();
	if(logged){
		xhr.open('GET', './comentario.html', true);
		xhr.onload=function(){


		document.getElementById('commentCage').innerHTML=xhr.responseText;
		}
		xhr.send();
	}
	else{
		document.getElementById('commentCage').innerHTML=`Debes estar <a href="login.html">logeado</a> para escribir un comentario`;
	}
}
function dejaComentario(frm){
	let formulario = new FormData(),
		parsed = window.location.href.split("?"),
		xhr = new XMLHttpRequest(),
		usu = JSON.parse(sessionStorage.getItem('user')),
		url = './rest/receta/'+parsed[1]+'/comentario';

		formulario.append('l',usu.login);
		formulario.append('titulo', frm.titulo.value);
		formulario.append('texto', frm.texto.value);

		if(!sessionStorage.getItem('user')) return false;
		console.log(usu);
		console.log(formulario.l);


		xhr.open('POST',url,true);

		xhr.onload=function(){

			var obj=JSON.parse(xhr.responseText);
			if(obj.RESULTADO=='OK'){
				console.log('comentario registrado');
			}
			else{
				console.log(xhr.responseText);
			}

		}
		xhr.onerror=function(){
			console.log(xhr.responseText);
		}
		xhr.setRequestHeader('Authorization', usu.clave );

		xhr.send(formulario);


}
function muestraComentario(){
	let xhr = new XMLHttpRequest(),
		parsed = window.location.href.split("?"),
		url = './rest/receta/'+parsed[1]+'/comentarios';

		xhr.open('GET', url, true);

		xhr.onload = function(){
			var obj=JSON.parse(xhr.responseText), 
				comentario = document.getElementById('comentarios');



			for(let i=0;i<obj.FILAS.length;i++){
				comentario.innerHTML+=`					<p id="comentario">
					<b>#1</b> ${obj.FILAS[i].autor} <b>Fecha:</b><time datetime="${obj.FILAS[i].fecha}">${obj.FILAS[i].fecha}</time><br><br><b>${obj.FILAS[i].titulo}</b><br>
					${obj.FILAS[i].texto}<br><br>
					</p>`
			}
		}
		xhr.send();
}
function gusta(){
    let xhr = new XMLHttpRequest(),
        frm = new FormData();
        receta = window.location.href,
        parsed = receta.split("?"),
        url = './rest/receta/'+parsed[1]+'/voto/1';

        if(!sessionStorage.getItem('user')){
        	if(!comprobante){

         	document.getElementById('receta2').innerHTML+='Debes estar registrado para votar recetas.<br>';
         	comprobante=true;
         	}
         	return false;
    	}

        let user = JSON.parse(sessionStorage.getItem('user'));


        frm.append('l', user.login);

        xhr.open('POST', url, true);

        xhr.onload = function(){
            let obj = JSON.parse(xhr.responseText);

            if(obj.RESULTADO=='OK'){
                console.log("Voto registrado correctamente");
            }
        }
        xhr.setRequestHeader('Authorization', user.clave)
        xhr.send(frm);
        location.reload(true);
}

function noGusta(){
    let xhr = new XMLHttpRequest(),
        frm = new FormData();
        receta = window.location.href,
        parsed = receta.split("?"),
        url = './rest/receta/'+parsed[1]+'/voto/0';


		if(!sessionStorage.getItem('user')){
			if(!comprobante){

         		document.getElementById('receta2').innerHTML+='Debes estar registrado para votar recetas.<br>';
         		comprobante=true;
         	}
			 return false;
		}

		    let user = JSON.parse(sessionStorage.getItem('user'));

        frm.append('l', user.login);

        xhr.open('POST', url, true);

        xhr.onload = function(){
            let obj = JSON.parse(xhr.responseText);

            if(obj.RESULTADO=='OK'){
                console.log("Voto registrado correctamente");
            }
        }
        xhr.setRequestHeader('Authorization', user.clave)
        xhr.send(frm);
        location.reload(true);
}
