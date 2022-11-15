const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')


class Juego {
    constructor() {
        this.inicializar()
        this.secuencia()
        setTimeout(this.siguienteNivel, 500)
        alert()

    }

    inicializar() {

        this.registrarJugador()
        this.this.ULT_LVL = document.getElementById('nivel').value
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
        this.siguienteNivel = this.siguienteNivel.bind(this)
        this.elegirColor = this.elegirColor.bind(this)
        this.nivel = 1
        this.jugador = null
        this.toggleBtn()

    }

    registrarJugador() {

        let nombre = prompt("Registrate - Ingresa tu nombre")

        const nombres = window.localStorage.getItem('nombres')

        let nombreSinEspacio = (nombre != null && nombre.length > 0) && nombre.trim().toLowerCase()


        if (!nombre || nombreSinEspacio == "") {
            return this.registrarJugador()

        }

        if (!nombres) {
            window.localStorage.setItem('nombres', JSON.stringify([{
                nombre: nombreSinEspacio,
                puntos: 0
            }]))
        }

        if (nombres) {
            let nombresViejos = JSON.parse(nombres)


            const userExist = nombresViejos.filter(jugadores => nombreSinEspacio == jugadores.nombre)

            if (userExist.length > 0) {
                alert("El nombre que ingreaste ya fue usado")
                return this.registrarJugador()
            }

            let nuevosNombres = [
                ...nombresViejos,
                { nombre: nombreSinEspacio, puntos: 0 }
            ]
            this.jugador = nombreSinEspacio
            window.localStorage.setItem('nombres', JSON.stringify(nuevosNombres))

        }


    }

    siguienteNivel() {
        this.subnivel = 0
        this.iluminarSecuencia()
        this.agregarEvento()
    }


    numeroAColor(num) {
        switch (num) {
            case 0: return 'celeste'
            case 1: return 'violeta'
            case 2: return 'naranja'
            case 3: return 'verde'
        }
    }

    /**
     * 
     * @param {strimg} color 
     * @returns 
     * 
     * Retorna el índice de la represetanción del color 
     */
    colorANum(color) {
        switch (color) {
            case 'celeste': return 0
            case 'violeta': return 1
            case 'naranja': return 2
            case 'verde': return 3
        }
    }

    toggleBtn() {
        // alert(55)
        if (btnEmpezar.classList.contains('hide')) {
            btnEmpezar.classList.remove('hide')
        }
        else {
            btnEmpezar.classList.add('hide')
        }

    }

    secuencia() {
        this.secuencia = new Array(this.ULT_LVL).fill(0).map(n => Math.floor(Math.random() * 4))
    }

    elegirColor(ev) {
        const nombreColor = ev.target.dataset.color // sacamos el color seleccionado
        const numeroColor = this.colorANum(nombreColor)
        this.iluminarColor(nombreColor)
        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++
            if (this.subnivel === this.nivel) {
                this.nivel++
                this.eliminarEvento()
                if (this.nivel === (this.ULT_LVL + 1)) {
                    const jugadores = [...JSON.parse(window.localStorage.getItem('nombres'))]

                    jugadores[jugadores.length - 1].puntos = jugadores[jugadores.length - 1].puntos + this.ULT_LVL

                    window.localStorage.setItem('nombres', JSON.stringify(jugadores))

                    alert("Felicidades has Ganado")
                    this.toggleBtn()
                }
                else {

                    this.apagarColor(nombreColor)
                    alert(`Felicidades Pasaste al nivel ${this.nivel}`)

                    setTimeout(this.siguienteNivel, 600)
                    // swal('Felicidades', `Pasaste al nivel ${this.nivel}`, 'success')
                    //     .then(() => {
                    //         setTimeout(this.siguienteNivel, 600)
                    //     })

                }
            }
        }
        else {
            this.perdiste()
        }
    }

    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++) {

            let color = this.numeroAColor(this.secuencia[i])
            setTimeout(() => this.iluminarColor(color), 1000 * i);

        }
    }

    /**
     * 
     * @param {string} color 
     * 
     * @return Alumbra el color que debe ser seleccionado
     */
    iluminarColor(color) {
        this.colores[color].classList.add('light')
        setTimeout(() => this.apagarColor(color), 250);
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light')
    }



    agregarEvento() {
        this.colores.celeste.addEventListener('click', this.elegirColor)
        this.colores.verde.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
    }

    eliminarEvento() {
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
    }

    perdiste() {
        alert(`Perdiste Vuelve a intentarlo!`)
        this.toggleBtn()
        this.inicializar.bind(this)
        // swal('Perdiste', 'Vuelve a intentarlo!', 'error')
        //     .then(this.inicializar.bind(this))
    }

}

function empezarJuego() {
    new Juego()
}
