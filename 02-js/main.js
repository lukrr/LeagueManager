"use strict";

// - Sin alerta
// * - Alerta lima
// ! - Alerta roja
// ? - Alerta azul
// TODO - Alerta naranja

// Colores:
// #0385FF - Main
// #389EFF - Main más claro
// #046BCC - Main más oscuro
// #98cdff - Main ultra claro
// #0F0C34 - Secundario
// #1A1742 - Secundario más claro
// #EFF1FF - Main casi blanco

// Variables
// * Variables generales
let totalUsers = 0;
let datos = [];
let sortedAsc = true; // Estado de orden ascendente
// * Variables de las palabras del sidebar
let sidebar_word_ranking = document.querySelector(".sidebar-word-ranking");
let sidebar_word_jugadores = document.querySelector(".sidebar-word-jugadores");
let sidebar_word_historial = document.querySelector(".sidebar-word-historial");
let sidebar_word_informacion = document.querySelector(".sidebar-word-informacion");
let jugadores_containers = document.querySelector(".jugadores-containers");
let historial_containers = document.querySelector(".historial-containers");
let informacion_containers = document.querySelector(".informacion-containers");
// * Variables de los contenedores de las páginas
let ranking_containers = document.querySelector(".ranking-containers");
let rankingcontainerdiv = document.getElementById("ranking-container-div");
// * Variables para ordenar
let rankingorder_nombre = document.getElementById("ranking-order-nombre");
let rankingorder_elo = document.getElementById("ranking-order-elo");
let rankingorder_ranking = document.getElementById("ranking-order-ranking");
let rankingorder_racha = document.getElementById("ranking-order-racha");
let rankingorder_victorias = document.getElementById("ranking-order-victorias");
let rankingorder_derrotas = document.getElementById("ranking-order-derrotas");
let rankingorder_winrate = document.getElementById("ranking-order-winrate");

//! Cargar datos de la página < Ranking >

async function cargarUsuarios() {
    try {
        // Agregar un parámetro único a la URL para evitar caché

        //const url = `https://raram.eljotita.com/rank?timestamp=${Date.now()}`;
        const url = "/03-assets/usersExample/users.txt";

        let respuestas = await fetch(url, { cache: "no-store" });
        let data = await respuestas.json();

        // Asegurarse de que los valores necesarios sean números
        data.forEach(user => {
            user.victorias = Number(user.victorias);
            user.derrotas = Number(user.derrotas);
            user.elo_raram = Number(user.elo_raram);
            user.rank = Number(user.rank);
        });

        // Ordenar los datos por ranking al cargar
        data.sort((a, b) => a.rank - b.rank);

        // Calcular winrate para cada usuario
        data.forEach(user => {
            const winrate = (user.victorias / (user.victorias + user.derrotas)) * 100;
            user.winrate = winrate;
        });

        // Actualizar los datos
        totalUsers = data.length;
        datos = data;

        // Imprimir los datos
        mostrarUsuarios(data);
        marcarYournick();

    } catch (error) {
        console.log(error);
    }
}

// Llamar a la función para cargar los usuarios
cargarUsuarios();

function mostrarUsuarios(data) {
    // Limpiar el contenido existente del rankingcontainer
    rankingcontainerdiv.innerHTML = '';

    // Iterar sobre cada usuario y construir una cadena HTML para cada uno
    const usuariosHTML = data.map(user => {
        const totalGames = user.victorias + user.derrotas;
        return `
      <section class="ranking-container">
        <article class="ranking-container-nick article">
          <h3 class="ranking-h3">
            ${user.rank === 1 ? `<img class="ranking-img-puesto1" src="../03-assets/img/02-puesto1.png" alt="Puesto1" />` : ''}
            ${user.rank === 2 ? `<img class="ranking-img-puesto2" src="../03-assets/img/03-puesto2.png" alt="Puesto2" />` : ''}
            ${user.rank === 3 ? `<img class="ranking-img-puesto3" src="../03-assets/img/04-puesto3.png" alt="Puesto3" />` : ''}
            ${user.name.split('#')[0]}
          </h3>
        </article>
  
        <article class="ranking-container-elo article">
          <h3 class="ranking-h3">${user.elo_raram}</h3>
        </article>
  
        <article class="ranking-container-puesto article">
          <h3 class="ranking-h3">${user.rank}/${totalUsers}</h3>
        </article>
  
        <article class="ranking-container-racha article">
        <h3 class="ranking-h3" style="color: ${user.rachas <= -3 ? '#e4595a' : user.rachas >= 3 ? '#69d765' : '#ddd'}">
          ${user.rachas ?? 'Próximamente'}
        </h3>
        </article>
  
        <article class="ranking-container-victorias article">
          <h3 class="ranking-h3 ranking-h3-victorias">${user.victorias}</h3>
        </article>
  
        <article class="ranking-container-derrotas article">
          <h3 class="ranking-h3 ranking-h3-derrotas">${user.derrotas}</h3>
        </article>
  
        <article class="ranking-container-winrate article">
          ${totalGames <= 9 ? `<h3 class="ranking-h3-pocosgames">${totalGames}/10 games</h3>` :
                `<h3 class="ranking-h3" style="color: ${user.winrate <= 49 ? '#e4595a' : user.winrate === 50 ? '#e3f15b' : '#69d765'}">
              ${user.winrate.toFixed(2)}%
            </h3>`
            }
        </article>
      </section>
      `;
    });

    // Unir las cadenas HTML en una sola y asignarla a rankingcontainer.innerHTML
    rankingcontainerdiv.innerHTML = usuariosHTML.join('');
}

//! Función que página cargar al ingresar

if (localStorage.getItem("page") === "ranking") {
    pageRanking();
} else if (localStorage.getItem("page") === "jugadores") {
    pageJugadores();
} else if (localStorage.getItem("page") === "historial") {
    pageHistorial();
} else if (localStorage.getItem("page") === "informacion") {
    pageInformacion();
} else {
    pageInformacion();
}

//! Función ir a página < Ranking >

sidebar_word_ranking.addEventListener("click", function () {
    if (localStorage.getItem("page") !== "ranking") {
        pageRanking();
    }
});

function pageRanking() {
    localStorage.setItem("page", "ranking");
    // Aqui los estilos para mostrar la página de ranking
    sidebar_word_ranking.classList.add("sidebar-word-link-activo");
    ranking_containers.style.display = "flex";

    // Aqui los estilos para eliminar las otras páginas
    sidebar_word_jugadores.classList.remove("sidebar-word-link-activo");
    sidebar_word_historial.classList.remove("sidebar-word-link-activo");
    sidebar_word_informacion.classList.remove("sidebar-word-link-activo");
    jugadores_containers.style.display = "none";
    historial_containers.style.display = "none";
    informacion_containers.style.display = "none";
}

//! Función ir a página < Jugadores >

sidebar_word_jugadores.addEventListener("click", function () {
    if (localStorage.getItem("page") !== "jugadores") {
        pageJugadores();
    }
});

function pageJugadores() {
    localStorage.setItem("page", "jugadores");
    // Aqui los estilos para mostrar la página de jugadores
    sidebar_word_jugadores.classList.add("sidebar-word-link-activo");
    jugadores_containers.style.display = "flex";

    // Aqui los estilos para eliminar las otras páginas
    sidebar_word_ranking.classList.remove("sidebar-word-link-activo");
    sidebar_word_historial.classList.remove("sidebar-word-link-activo");
    sidebar_word_informacion.classList.remove("sidebar-word-link-activo");
    ranking_containers.style.display = "none";
    historial_containers.style.display = "none";
    informacion_containers.style.display = "none";
}

//! Función ir a página < Historial >

sidebar_word_historial.addEventListener("click", function () {
    if (localStorage.getItem("page") !== "historial") {
        pageHistorial();
    }
});

function pageHistorial() {
    localStorage.setItem("page", "historial");
    // Aqui los estilos para mostrar la página de historial
    sidebar_word_historial.classList.add("sidebar-word-link-activo");
    historial_containers.style.display = "flex";

    // Aqui los estilos para eliminar las otras páginas
    sidebar_word_jugadores.classList.remove("sidebar-word-link-activo");
    sidebar_word_ranking.classList.remove("sidebar-word-link-activo");
    sidebar_word_informacion.classList.remove("sidebar-word-link-activo");
    ranking_containers.style.display = "none";
    jugadores_containers.style.display = "none";
    informacion_containers.style.display = "none";
}

//! Función ir a página < Información >

sidebar_word_informacion.addEventListener("click", function () {
    if (localStorage.getItem("page") !== "informacion") {
        pageInformacion();
    }
});

function pageInformacion() {
    localStorage.setItem("page", "informacion");
    // Aqui los estilos para mostrar la página de informacion
    sidebar_word_informacion.classList.add("sidebar-word-link-activo");
    informacion_containers.style.display = "flex";

    // Aqui los estilos para eliminar las otras páginas
    sidebar_word_jugadores.classList.remove("sidebar-word-link-activo");
    sidebar_word_historial.classList.remove("sidebar-word-link-activo");
    sidebar_word_ranking.classList.remove("sidebar-word-link-activo");
    ranking_containers.style.display = "none";
    jugadores_containers.style.display = "none";
    historial_containers.style.display = "none";
}

//! Ordenar por nombre
rankingorder_nombre.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => a.name.trim().localeCompare(b.name.trim())); // Uso trim() para eliminar los espacios
    if (!sortedAsc) sorted.reverse();
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

//! Ordenar por elo
rankingorder_elo.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => sortedAsc ? a.elo_raram - b.elo_raram : b.elo_raram - a.elo_raram);
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

//! Ordenar por ranking
rankingorder_ranking.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => sortedAsc ? a.rank - b.rank : b.rank - a.rank);
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});


//! Ordenar por racha
rankingorder_racha.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => sortedAsc ? a.racha - b.racha : b.racha - a.racha);
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

//! Ordenar por victorias
rankingorder_victorias.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => sortedAsc ? a.victorias - b.victorias : b.victorias - a.victorias);
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

//! Ordenar por derrotas
rankingorder_derrotas.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => sortedAsc ? a.derrotas - b.derrotas : b.derrotas - a.derrotas);
    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

//! Ordenar por winrate
rankingorder_winrate.addEventListener('click', () => {
    const sorted = [...datos].sort((a, b) => {
        // Obtener la cantidad de partidas de a y b
        const aTotalGames = a.victorias + a.derrotas;
        const bTotalGames = b.victorias + b.derrotas;

        // Si a tiene menos de 10 partidas, asignar un valor especial bajo
        const aWinrate = aTotalGames < 10 ? -1 : a.winrate;
        // Si b tiene menos de 10 partidas, asignar un valor especial bajo
        const bWinrate = bTotalGames < 10 ? -1 : b.winrate;

        // Si ambos tienen menos de 10 partidas, ordenar por cantidad de partidas
        if (aTotalGames < 10 && bTotalGames < 10) {
            return sortedAsc ? aTotalGames - bTotalGames : bTotalGames - aTotalGames;
        }

        // Ordenar por winrate
        return sortedAsc ? aWinrate - bWinrate : bWinrate - aWinrate;
    });

    mostrarUsuarios(sorted);
    sortedAsc = !sortedAsc;
});

//! Función reload página
let body_reload_icon = document.querySelector(".body-reload-icon");

body_reload_icon.addEventListener("click", function () {
    location.reload(true);
});

//! Función yournick página
let body_yournick_icon = document.querySelector(".body-yournick-icon");
let body_yournick_container = document.querySelector(".body-yournick-container");
let body_yournick_input = document.querySelector(".body-yournick-input");
let body_yournick_button1 = document.querySelector(".body-yournick-button1");
let body_yournick_button2 = document.querySelector(".body-yournick-button2");

//! Entrar a yournick
body_yournick_icon.addEventListener("click", function () {
    body_yournick_container.style.display = "flex";
    body_yournick_input.value = "";
    if (localStorage.getItem("yournick")) {
        body_yournick_input.value = localStorage.getItem("yournick");
    }
});

//! Cancelar yournick
body_yournick_button1.addEventListener("click", function () {
    body_yournick_container.style.display = "none";
});

//! Confirmar yournick
body_yournick_button2.addEventListener("click", function () {
    body_yournick_container.style.display = "none";
    if (body_yournick_input.value.length > 0) {
        localStorage.setItem("yournick", body_yournick_input.value);
        marcarYournick();
    } else {
        localStorage.removeItem("yournick");
        marcarYournick();
    }
});

//! Confirmar yournick apretando enter
body_yournick_input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && body_yournick_button2.offsetParent !== null) { // Verifica si el botón es visible
        body_yournick_button2.click(); // Dispara el evento click del botón
    }
});

function marcarYournick() {
    if (localStorage.getItem("yournick")) {
        let yournick = localStorage.getItem("yournick").toLowerCase().split('#')[0]; // Convertir a minúsculas

        // Obtener todos los usuarios
        const usuarios = document.querySelectorAll(".ranking-container-nick h3");

        // Iterar sobre cada usuario
        usuarios.forEach(usuario => {
            const nombreUsuario = usuario.innerText.toLowerCase(); // Convertir a minúsculas

            // Verificar si el nombre de usuario contiene el nick
            if (nombreUsuario.includes(yournick)) {
                // Agregar clase para resaltar al nombre
                usuario.classList.add("yournick-resaltado");

                // Obtener el elemento padre (contenedor de usuario)
                const contenedorUsuario = usuario.closest(".ranking-container");

                // Resaltar el elo y ranking del mismo usuario
                const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
                const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

                if (eloElement) {
                    eloElement.classList.add("yournick-resaltado");
                }

                if (rankingElement) {
                    rankingElement.classList.add("yournick-resaltado");
                }
            } else {
                // Remover clase si no coincide
                usuario.classList.remove("yournick-resaltado");

                // Obtener el elemento padre (contenedor de usuario)
                const contenedorUsuario = usuario.closest(".ranking-container");

                // Remover resaltado del elo y ranking del mismo usuario
                const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
                const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

                if (eloElement) {
                    eloElement.classList.remove("yournick-resaltado");
                }

                if (rankingElement) {
                    rankingElement.classList.remove("yournick-resaltado");
                }
            }
        });
    } else {
        // Obtener todos los usuarios
        const usuarios = document.querySelectorAll(".ranking-container-nick h3");

        // Iterar sobre cada usuario
        usuarios.forEach(usuario => {
            usuario.classList.remove("yournick-resaltado");

            // Obtener el elemento padre (contenedor de usuario)
            const contenedorUsuario = usuario.closest(".ranking-container");

            // Remover resaltado del elo y ranking del mismo usuario
            const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
            const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

            if (eloElement) {
                eloElement.classList.remove("yournick-resaltado");
            }

            if (rankingElement) {
                rankingElement.classList.remove("yournick-resaltado");
            }
        });
    }
}

//! Función música
let body_music_icon = document.querySelector(".body-music-icon");
let music = new Audio("../03-assets/audio/raramOpening.mp3");
let music_playing = false;

body_music_icon.addEventListener("click", function () {
    if (music.paused || music.currentTime === music.duration) {
        // Si la música está pausada o terminó, reinicia y reproduce desde el principio
        music.currentTime = 0;
        music.play();
        music_playing = true; // Marca como "reproduciendo"
    } else {
        // Si la música está sonando, pausa
        music.pause();
        music_playing = false; // Marca como "pausada"
    }
});
