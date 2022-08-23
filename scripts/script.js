// Objeto que tiene todos los datos base necesarios para operar
let datosBase = {
    unidadInicial : "",
    unidadDestino : "",
    cantidadInicial : 0,
    unidades : [
        "mililitros",
        "tazas",
        "gramos",
        "onzas"
    ],
}

// Objeto en donde cada clave es el resultado de una operacion
let resultados = {
    mililitrosATazas : 0,
    tazasAMililitros : 0,
    gramosAOnzas : 0,
    onzasAGramos : 0,
    gramosATazas : 0,
    tazasAGramos : 0
}

//Variable para poder guardar todos los resultados en el Local Storage como objetos diferentes en la misma clave
let idResultado
//Variable para almacenar el array del Storage
let resultadoStorage

//Evalúo antes de empezar si ya hay algo en el storage o no y almaceno en las variables los datos previos si los hubiera 
if (localStorage.getItem("resultados") == null) {
    
    idResultado = 0
    resultadoStorage = []

} else {
    
    idResultado = JSON.parse(localStorage.getItem("resultados")).length
    resultadoStorage = JSON.parse(localStorage.getItem("resultados"))

    for (let i = 0; i < idResultado; i++) {
        //Creo una etiqueta P para imprimir el resultado, y voy a buscar el div en donde lo quiero imprimir
        let result = document.createElement("p")
        let resultadoFinal = document.getElementById("historial")

        //Le agrego el texto al p
        result.innerText = `${resultadoStorage[i].cantInicial} ${resultadoStorage[i].unInicial} equivalen a ${resultadoStorage[i].resultOp} ${resultadoStorage[i].unDestino}`
        
        //Imprimo el p en el div
        resultadoFinal = resultadoFinal.append(result)
    }
}

//Creo un constructor para el objeto que se envía al LocalStorage
function storeResultado(id,cantinicial,uninicial,resultop,undestino) {
    this.id = id,
    this.cantInicial = cantinicial,
    this.unInicial = uninicial,
    this.resultOp = resultop,
    this.unDestino = undestino 
}

//Objeto que contiene todas las operaciones como métodos
let operaciones = {
    MlATazas(cant){
        resultados.mililitrosATazas =  (parseFloat(cant) / 240).toFixed(2)
        return resultados.mililitrosATazas
    },
    TazasAMl (cant){
        resultados.tazasAMililitros = (parseFloat(cant) * 240).toFixed(2)
        return resultados.tazasAMililitros
    },
    GrAOz (cant) {
        resultados.gramosAOnzas = (parseFloat(cant) * 0.035274).toFixed(2)
        return resultados.gramosAOnzas
    },
    OzAGr (cant) {
        resultados.onzasAGramos = (parseFloat(cant) * 28.3495).toFixed(2)
        return resultados.onzasAGramos
    },
    TzaGr (cant) {
        resultados.tazasAGramos = (parseFloat(cant) * 236.588236).toFixed(2)
        return resultados.tazasAGramos
    },
    GraTz (cant) {
        resultados.gramosATazas = (parseFloat(cant) / 236.588236).toFixed(2)
        return resultados.gramosATazas
    }
}

 //Busco los eventos Change de cada campo del formulario y almaceno los valores de cada uno en el objeto datosBase

let obtenerCantidad = document.querySelector("#cantidadInicial")

obtenerCantidad.onchange = (e) => { datosBase.cantidadInicial = obtenerCantidad.value }

let obtenerUnidadInicial = document.getElementById("unidadInicial")

obtenerUnidadInicial.onchange = (e) => { datosBase.unidadInicial = obtenerUnidadInicial.value }

let obtenerUnidadFinal = document.getElementById("unidadFinal")

obtenerUnidadFinal.onchange = (e) => { datosBase.unidadDestino = obtenerUnidadFinal.value }

//Esta funcion evalúa qué operación utilizar dependiendo de lo ingresado, usando como parámetros las unidades de inicio y fin y la cantidad inicial
function convertir(unidadInicial, unidadDestino, cantidadInicial) {

    //Comparo en el if si las unidades pueden ser convertidas de una a otra o no y ejecuto la operación q corresponda, retornando el resultado
    if (unidadInicial == datosBase.unidades[0] && unidadDestino == datosBase.unidades[1]) {

        operaciones.MlATazas(cantidadInicial)

        agregarResultado(resultados.mililitrosATazas)

    } else if (unidadInicial == datosBase.unidades[1] && unidadDestino == datosBase.unidades[0]) {
            
        operaciones.TazasAMl(cantidadInicial)

        agregarResultado(resultados.tazasAMililitros)
        
    } else if (unidadInicial == datosBase.unidades[2] && unidadDestino == datosBase.unidades[1]) {
        
        operaciones.GraTz(cantidadInicial)

        agregarResultado(resultados.gramosATazas)
        
    } else if (unidadInicial == datosBase.unidades[1] && unidadDestino == datosBase.unidades[2]){
        
        operaciones.TzaGr(cantidadInicial)

        agregarResultado(resultados.tazasAGramos)
        
    } else if (unidadInicial == datosBase.unidades[2] && unidadDestino == datosBase.unidades[3]){

        operaciones.GrAOz(cantidadInicial)

        agregarResultado(resultados.gramosAOnzas)

    } else if (unidadInicial == datosBase.unidades[3] && unidadDestino == datosBase.unidades[2]){

        operaciones.OzAGr(cantidadInicial)

        agregarResultado(resultados.onzasAGramos)

    } else {
        
        //Creo una etiqueta P para imprimir el resultado, y voy a buscar el div en donde lo quiero imprimir
        let result = document.createElement("p")
        let operacionErronea = document.getElementById("resultados")

        //Le agrego el texto al p
        result.innerText = "Intentaste hacer una operación no contemplada. Probá de nuevo"
        
        //Imprimo el p en el div
        operacionErronea = operacionErronea.append(result)
        
    }
}

//Funcion para agregar el resultado final al LocalStorage y al HTML
function agregarResultado (operacion) {

    //Sumo 1 a la variable idResultado para cambiar el ID cada vez que agrego uno nuevo
    idResultado += 1

    //Guardo el resultado de la operación que se realizó en una variable local
    let resultadoOperacion = operacion

    //Voy guardando en el array del Storage un objeto nuevo con los resultados
    resultadoStorage.push(new storeResultado(idResultado,datosBase.cantidadInicial,datosBase.unidadInicial,resultadoOperacion,datosBase.unidadDestino))

    //Mando, parseando previamente, el objeto al LocalStorage
    localStorage.setItem("resultados",JSON.stringify(resultadoStorage))

    agregarHTML(resultadoOperacion)
}

//Función para agregar los resultados al HTML

function agregarHTML(resultOperacion) {
    let resultadoOperacion = resultOperacion
    let resultadoFinal = document.querySelector(".ultimoResultado")

    //Evalúo si ya existen resultados impresos en pantalla o no. 
    //Si existe primero lo borro y cuando imprimo el nuevo, imprimo al final del Historial el anterior, si no existe se crea.
    if (resultadoFinal.firstChild != null) {
    
        //Borro el resultado anterior
        resultadoFinal.firstChild.remove()

        //Agrego el nuevo resultado
        resultadoFinal.innerHTML = `<p class="res">${datosBase.cantidadInicial} ${datosBase.unidadInicial} equivalen a ${resultadoOperacion} ${datosBase.unidadDestino}</p>`

        //Creo la etiqueta para guardar el valor que borré en "Historial"
        let resultHist = document.createElement("p")
        let historial = document.getElementById("historial")

        //Uso la variable "idResultado" como índice para buscar el último dato agregado al array del Storage
        let arrayStorage = idResultado-2

        //Le agrego el texto al p
        resultHist.innerText = `${resultadoStorage[arrayStorage].cantInicial} ${resultadoStorage[arrayStorage].unInicial} equivalen a ${resultadoStorage[arrayStorage].resultOp} ${resultadoStorage[arrayStorage].unDestino}`
        
        //Imprimo el p en el div
        historial = historial.append(resultHist)

    } else {
        //Imprimo el resultado en el p
        resultadoFinal.innerHTML = `<p class="res">${datosBase.cantidadInicial} ${datosBase.unidadInicial} equivalen a ${resultadoOperacion} ${datosBase.unidadDestino}</p>`
    }

}

//Busco el elemento form y sobre el evento submit del mismo ejecuto la función que calcula la conversión
let formulario = document.getElementById("conversor")

formulario.onsubmit = (e) => {

    e.preventDefault()

    convertir(datosBase.unidadInicial, datosBase.unidadDestino, datosBase.cantidadInicial)
}

let borrarHistorial = document.getElementById("borrarHistorial")

borrarHistorial.onclick = (e) => {
    localStorage.clear()
    location.reload()
}