

import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.3/+esm'

export default class Juego {
    constructor(
        skyBlue, violet, orange, green,
        startGameBtn,
        win1, win2, win3
    ) {
        this.winsSpan = [win1, win2, win3]
        this.ULT_LVL = document.getElementById('levels').value;
        this.level = 1;
        this.totalColors = 4;
        this.sequence = [];
        this.colors = {
            1: skyBlue,
            2: violet,
            3: orange,
            4: green
        };
        this.player = "";
        this.players = [];
        this.sequencesSelected = [];
        this.startGameBtn = startGameBtn;
        this.addEventColors();
    }

    async init() {
        this.setSequence([])
        this.setLevel(1)

        const result = await this.registerPlayer()
        if (result != false) {
            this.toggleBtn()
            this.handleNextLevel()
        }
    }

    setLevel(value) {
        this.level = value
    }
    setPlayer(value) {
        this.player = value
    }
    setSequence() {
        this.sequence = new Array(this.ULT_LVL).fill(this.totalColors).map(n => Math.floor(Math.random() * n) + 1)
    }

    setSequencesSelected(payload = []) {
        this.sequencesSelected = payload
    }
    setPlayers(newPlayers) {
        window.localStorage.setItem('playersStorage', JSON.stringify(newPlayers))
    }

    async registerPlayer() {

        let name = prompt("Registrate - Ingresa tu nombre")

        const playersStorage = window.localStorage.getItem('playersStorage')

        if (name == null) return false

        let nameFormat = (name != null && name.length > 0) && name.trim().toLowerCase()


        if (playersStorage !== null) { //storage exists
            let players = JSON.parse(playersStorage)
            const userExist = players.filter(player => nameFormat == player.name)

            if (userExist.length > 0) {
                return await Swal.fire({
                    title: '',
                    text: 'El nombre que ingreaste ya fue usado, Intenta con otro.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    return false
                })
            }


            let newPlayers = [
                ...players,
                { name: nameFormat, point: 0 }
            ]

            this.setPlayers(newPlayers)
            this.setPlayer(nameFormat)
            return nameFormat
        }

        let newPlayer = [
            { name: nameFormat, point: 0 }
        ]

        this.setPlayers(newPlayer)
        this.setPlayer(nameFormat)
        return nameFormat

    }

    handleNextLevel() {
        this.illuminateSequence()
    }

    illuminateSequence() {
        const sequecen = this.sequence

        if (sequecen.length > 0) {
            for (let index = 0; index < this.level; index++) {

                const levelSequence = this.sequence[index]
                setTimeout(() => this.illuminateColor(levelSequence), 1000 * (index + 1));
            }
        }
    }


    illuminateColor(color) {
        this.colors[color].classList.toggle('light')
        if (this.colors[color].classList.value.split(" ").includes("light")) {
            setTimeout(() => this.illuminateColor(color), 250);
        }

    }

    toggleBtn() {
        this.startGameBtn.classList.toggle("hide")
    }

    selectColor(ev) {

        const colorSelected = parseInt(ev.target.dataset.color) // get selected color.
        const sequencesSelected = [...this.sequencesSelected] //old selected sequence.

        if (this.sequencesSelected.length > 0 && this.sequencesSelected[(this.sequencesSelected.length - 1)] != this.sequence[(this.sequencesSelected.length - 1)]) {
            return this.youLost();//we validate your selection.
        }

        sequencesSelected.push(colorSelected)//the selection is added to the selected sequence.
        this.setSequencesSelected(sequencesSelected)

        if (sequencesSelected.length != this.level) return false;

        if (sequencesSelected.length == this.level) {//UP LEVEL
            const validateResult = this.sequenceValidate(sequencesSelected)

            if (!validateResult) {
                return this.youLost();//we validate your selection.
            }


            if (sequencesSelected.length == (this.ULT_LVL)) { //Winner

                const players = [...JSON.parse(window.localStorage.getItem('playersStorage'))]
                const player = players.find(el => el.name == this.player)

                if (!player) return alert("Error Usuario")

                const idPlayer = players.findIndex(p => p.name == player.name);
                let newPlayers = players.splice(0, idPlayer)

                player.point = this.ULT_LVL;
                newPlayers = [
                    ...newPlayers,
                    player
                ]

                this.setPlayers(newPlayers)

                return Swal.fire({
                    title: '',
                    text: 'Felicidades has Ganado!!.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    this.toggleBtn()
                    this.showRank()
                    this.setSequencesSelected([])
                })
            }

            this.setLevel((this.level + 1))//SET NEW LEVEL
            const _this = this
            return Swal.fire({
                title: '',
                text: `Felicidades Pasaste al nivel ${this.level}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed || result.isDismissed) {
                    _this.setSequencesSelected([])
                    setTimeout(_this.handleNextLevel(), 600)
                }
            })

        }
    }

    addEventColors() {
        this.colors[1].addEventListener('click', this.selectColor.bind(this))
        this.colors[2].addEventListener('click', this.selectColor.bind(this))
        this.colors[3].addEventListener('click', this.selectColor.bind(this))
        this.colors[4].addEventListener('click', this.selectColor.bind(this))
    }

    removeEventColors() {
        this.colors[1].removeEventListener('click', this.selectColor.bind(this))
        this.colors[2].removeEventListener('click', this.selectColor.bind(this))
        this.colors[3].removeEventListener('click', this.selectColor.bind(this))
        this.colors[4].removeEventListener('click', this.selectColor.bind(this))
    }

    sequenceValidate(sequencesSelected) {

        const sequences = [...this.sequence]
        const sequencesLevel = sequences.splice(0, this.level)

        if (JSON.stringify(sequencesLevel) === JSON.stringify(sequencesSelected)) {
            return true
        }

        return false;
    }

    youLost() {
        this.setSequencesSelected([])
        this.toggleBtn()
        this.removeEventColors()

        return Swal.fire({
            title: '',
            text: `Perdiste Vuelve a intentarlo!`,
            icon: 'error',
            confirmButtonText: 'OK'
        }).then((result) => {
            // throw `Perdiste Vuelve a intentarlo!`;
        })
    }

    showRank() {

        if (window.localStorage.getItem('playersStorage') != null) {
            const players = JSON.parse(window.localStorage.getItem('playersStorage'))
            const highScores = players.sort(function (a, b) { return b.point - a.point })
            this.winsSpan[0].innerHTML = `<p>Nombre: ${highScores.length > 0 ? highScores[0].name : ""}</p><p>puntaje: ${highScores.length > 0 ? highScores[0].point : ""}🥇️ </p>`
            this.winsSpan[1].innerHTML = `<p>Nombre: ${highScores.length > 1 ? highScores[1].name : ""}</p><p>puntaje: ${highScores.length > 1 ? highScores[1].point : ""}🥈️ </p>`
            this.winsSpan[2].innerHTML = `<p>Nombre: ${highScores.length > 2 ? highScores[2].name : ""}</p><p>puntaje: ${highScores.length > 2 ? highScores[2].point : ""}🥉️ </p>`
        }
    }
}

addEventListener('load', () => {

    const initBtn = document.getElementById('btnEmpezar')

    const skyBlue = document.getElementById('skyBlue')
    const violet = document.getElementById('violet')
    const orange = document.getElementById('orange')
    const green = document.getElementById('green')
    const win1 = document.getElementById('win-1')
    const win2 = document.getElementById('win-2')
    const win3 = document.getElementById('win-3')
    const juego = new Juego(skyBlue,
        violet,
        orange,
        green,
        initBtn,
        win1,
        win2,
        win3)

    initBtn.addEventListener("click", () => {
        juego.init()
    })


    juego.showRank()

})