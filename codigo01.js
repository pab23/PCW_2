// VARIABLES GLOBALES
var total_recetas = 0,
	numPagActual= 1,
	login_disponible = true,
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

          var docu = getElementById('resultadosBusqueda');
          for (var i = 0; i < data.FILAS.length; i++) {
            docu.innerHTML +=
           `<div>
				<section>
					
					<a href="receta.html?id=`+data.FILAS[i].id+ `" title=`+data.FILAS[i].nombre+`>
						<img src="fotos/`+data.FILAS[i].fichero+`" alt="` + data.FILAS[i].nombre + `">
					</a>
					<div>
					<a href="receta.html?id=`+data.FILAS[i].id+ `" title=`+data.FILAS[i].nombre+`>
						<h3>`+data.FILAS[i].nombre+`</h3>
					</a>
					
					
						<footer>
							<p>
								<span>
									<a href="buscar.html?autor=` + data.FILAS[i].autor + `">` + data.FILAS[i].autor + `
									</a>
								</span><br>
								<time datetime="` + data.FILAS[i].fecha + `">` + data.FILAS[i].fecha + `</time><br>
								<button onclick="like();"><span class="icon-thumbs-up-alt"></span>` + data.FILAS[i].positivos + `</button>
								<button onclick="dislike();"><span class="icon-thumbs-down-alt"></span>` + data.FILAS[i].negativos + `</button>
								<button><span class="icon-chat"></span>` + data.FILAS[i].comentarios + `</button>
							</p>
						</footer>
					</div>
				</section>
			</div>`;

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

            var cont = document.getElementById('resultadosBusqueda');

            if(search.FILAS.length > 0){

              // Muestra infor

              var i;
              for(i=0;i<4;i++)
              {
                cont.innerHTML +=

                `<div>
				<section>
					
					<a href="receta.html?id=`+search.FILAS[i].id+ `" title=`+search.FILAS[i].nombre+`>
						<img src="fotos/`+search.FILAS[i].fichero+`" alt="` + search.FILAS[i].nombre + `">
					</a>
					<div>
					<a href="receta.html?id=`+search.FILAS[i].id+ `" title=`+search.FILAS[i].nombre+`>
						<h3>`+search.FILAS[i].nombre+`</h3>
					</a>
					
					
						<footer>
							<p>
								<span>
									<a href="buscar.html?autor=` + search.FILAS[i].autor + `">` + search.FILAS[i].autor + `
									</a>
								</span><br>
								<time datetime="` + search.FILAS[i].fecha + `">` + search.FILAS[i].fecha + `</time><br>
								<button onclick="like();"><span class="icon-thumbs-up-alt"></span>` + search.FILAS[i].positivos + `</button>
								<button onclick="dislike();"><span class="icon-thumbs-down-alt"></span>` + search.FILAS[i].negativos + `</button>
								<button><span class="icon-chat"></span>` + search.FILAS[i].comentarios + `</button>
							</p>
						</footer>
					</div>
				</section>
			</div>`;

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
			desripcion  = recetas.FILAS[recetasCreadas].descripcion_foto,
			fecha  = recetas.FILAS[recetasCreadas].fecha,
			id  = recetas.FILAS[recetasCreadas].id;

		//Codigo HTML

		var articulo =

			`<div>
				<section>
					
					<a href="receta.html?${id}" title=${titulo}>
						<img src="fotos/${foto}" alt="${desripcion}">
					</a>
					<div>
					<a href="receta.html?${id}" title=${titulo}>
						<h3>${titulo}</h3>
					</a>
					
					
						<footer>
							<p>
								<span><a href="buscar.html?autor=${autor}">${autor}</a></span><br>
								<time datetime="${fecha}">${fecha}</time><br>
								<button onclick="like();"><span class="icon-thumbs-up-alt"></span>${pos}</button>
								<button onclick="dislike();"><span class="icon-thumbs-down-alt"></span>${neg}</button>
								<button><span class="icon-chat"></span>${comentarios}</button>
							</p>
						</footer>
					</div>
				</section>
			</div>`;


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

