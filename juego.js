const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULT_LVL = 10
class Juego {
  constructor() {
    this.inicializar()
    this.secuencia()
    setTimeout( this.siguienteNivel, 500)
   
  }
  inicializar() 
  {
    this.siguienteNivel = this.siguienteNivel.bind(this)
    this.elegirColor = this.elegirColor.bind(this)
    this.toggleBtn()
    this.nivel = 1
    this.colores = {
        celeste,
        violeta,
        naranja,
        verde
    }
  }
  toggleBtn()
  {
      if(btnEmpezar.classList.contains('hide'))
      {
        btnEmpezar.classList.remove('hide')
      }
      else
      {
          btnEmpezar.classList.add('hide')
      }
    
  }
  secuencia()
  {
     this.secuencia = new Array(ULT_LVL).fill(0).map(n => Math.floor(Math.random() * 4))
  }

  siguienteNivel()
  {
      this.subnivel = 0
      this.iluminarSecuencia()
      this.agregarEvento()  
  }

  numeroAColor(num)
  {
      switch(num)
      {
          case 0: return 'celeste'
          case 1: return 'violeta'
          case 2: return 'naranja'
          case 3: return 'verde'
      }
  }

  colorANum(color)
  {
      switch(color)
      {
          case 'celeste': return 0
          case 'violeta': return 1
          case 'naranja': return 2
          case 'verde':   return 3
      }
  }

  iluminarSecuencia()
  {
      for(let i = 0; i < this.nivel; i++)
      {
        let color = this.numeroAColor(this.secuencia[i])
        setTimeout(() => this.iluminarColor(color), 1000 * i);
        
      }
  }
  
  iluminarColor(color)
  {
    this.colores[color].classList.add('light')
    setTimeout(() => this.apagarColor(color), 350);
  }

  apagarColor(color)
  {
      this.colores[color].classList.remove('light')
  }

  agregarEvento()
  {
      this.colores.celeste.addEventListener('click', this.elegirColor)
      this.colores.verde.addEventListener('click', this.elegirColor)
      this.colores.violeta.addEventListener('click', this.elegirColor)
      this.colores.naranja.addEventListener('click', this.elegirColor)
  }
  eliminarEvento()
  {
      this.colores.celeste.removeEventListener('click', this.elegirColor)
      this.colores.verde.removeEventListener('click', this.elegirColor)
      this.colores.violeta.removeEventListener('click', this.elegirColor)
      this.colores.naranja.removeEventListener('click', this.elegirColor)
  }
  elegirColor(ev)
  {
      const nombreColor = ev.target.dataset.color
      const numeroColor = this.colorANum(nombreColor)
      this.iluminarColor(nombreColor)
      if(numeroColor === this.secuencia[this.subnivel])
      {
          this.subnivel++
          if(this.subnivel === this.nivel)
          {
              this.nivel++
               this.eliminarEvento()
              if(this.nivel === (ULT_LVL + 1))
              {
                  this.ganoElJuego()
              }
              else
              {
                swal('Felicidades', `Pasaste al nivel ${this.nivel}`, 'success')
                .then(() => {
                    setTimeout(this.siguienteNivel, 600)
                }) 
              }
          }
      }
      else
      {
          this.perdiste()
      }
  }
  
  ganoElJuego()
  {
      swal('Felicidades', 'Ganaste el juego!', 'success')
      .then(this.inicializar.bind(this))
  }
  perdiste()
  {
      swal('Perdiste', 'Vuelve a intentarlo!', 'error')
      .then(this.inicializar.bind(this))
  }
}
function empezarJuego() {
  window.juego = new Juego()
}
