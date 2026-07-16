

/* ===========================
   ACORDIÓ DELS CRITERIS
=========================== */

const criteris = document.querySelectorAll(".ca");

criteris.forEach(item => {

    const header = item.querySelector(".ca-header");

    header.addEventListener("click", () => {

        const actiu = item.classList.contains("active");

        criteris.forEach(c => c.classList.remove("active"));

        if (!actiu) {
            item.classList.add("active");
        }

    });

});


/* ===========================
   ANIMACIÓ D'ENTRADA
=========================== */

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.animate([

                {
                    opacity:0,
                    transform:"translateY(35px)"
                },

                {
                    opacity:1,
                    transform:"translateY(0px)"
                }

            ],{

                duration:700,
                easing:"ease-out",
                fill:"forwards"

            });

            observer.unobserve(entry.target);

        }

    });

},{
    threshold:.15
});

document.querySelectorAll(".card,.skill,.ca").forEach(el=>{

    el.style.opacity="0";

    observer.observe(el);

});


/* ===========================
   SCROLL SUAU
=========================== */

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",e=>{

        e.preventDefault();

        const desti=document.querySelector(link.getAttribute("href"));

        if(desti){

            desti.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/* ===========================
   MENÚ ACTIU (SCROLLSPY)
=========================== */

const seccions=document.querySelectorAll("section");

const menu=document.querySelectorAll("aside nav a");

window.addEventListener("scroll",()=>{

    let actual="";

    seccions.forEach(sec=>{

        const top=window.scrollY;

        const offset=sec.offsetTop-150;

        const height=sec.offsetHeight;

        if(top>=offset && top<offset+height){

            actual=sec.getAttribute("id");

        }

    });

    menu.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+actual){

            link.classList.add("active");

        }

    });

});


/* ===========================
   TORNAR A DALT
=========================== */

const boto=document.createElement("button");

boto.innerHTML="▲";

boto.title="Tornar a dalt";

boto.style.position="fixed";
boto.style.right="25px";
boto.style.bottom="25px";

boto.style.width="52px";
boto.style.height="52px";

boto.style.border="none";
boto.style.borderRadius="50%";

boto.style.cursor="pointer";

boto.style.fontSize="18px";

boto.style.background="linear-gradient(135deg,#22d3ee,#3b82f6)";

boto.style.color="white";

boto.style.boxShadow="0 10px 30px rgba(0,0,0,.25)";

boto.style.display="none";

document.body.appendChild(boto);

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        boto.style.display="block";

    }else{

        boto.style.display="none";

    }

});

boto.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};


/* ===========================
   OBRIR EL PRIMER CRITERI
=========================== */

criteris[0].classList.add("active");



/* ===========================
   NAVEGACIÓ ENTRE RAs
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    const resultats = [

        {
            id: "ra_01.html",
            ra: "RA1",
            titol: "Prevenció i conscienciació en ciberseguretat"
        },

        {
            id: "ra_02.html",
            ra: "RA2",
            titol: "Anàlisi d'incidents de ciberseguretat"
        },

        {
            id: "ra_03.html",
            ra: "RA3",
            titol: "Investigació d'incidents de ciberseguretat"
        },

        {
            id: "ra_04.html",
            ra: "RA4",
            titol: "Resposta davant incidents de ciberseguretat"
        },

        {
            id: "ra_05.html",
            ra: "RA5",
            titol: "Notificació i documentació d'incidents"
        }

    ];

    const paginaActual = window.location.pathname.split("/").pop();

    const index = resultats.findIndex(r => r.id === paginaActual);

    if (index === -1) return;

    let html = '<div class="ra-navigation">';


    // -------------------------
    // RA anterior
    // -------------------------

    if (index > 0) {

        const anterior = resultats[index - 1];

        html += `
            <a class="prev-ra" href="${anterior.id}">
                <span class="nav-label">← Resultat anterior / ${anterior.ra}</span>
                <small>${anterior.titol}</small>
            </a>
        `;

    } else {

        html += `
            <a class="prev-ra" href="index.html">
                <span class="nav-label">← Inici</span>
                <small>Pàgina principal</small>
            </a>
        `;

    }


    // -------------------------
    // targeta central
    // -------------------------

    const actual = resultats[index];

    html += `
        <div class="actual-ra">
            <span class="nav-label">Navegació</span>
            <small>Entre RAs</small>
        </div>
    `;


    // -------------------------
    // RA següent
    // -------------------------

    if (index < resultats.length - 1) {

        const seguent = resultats[index + 1];

        html += `
            <a class="next-ra" href="${seguent.id}">
                <span class="nav-label">${seguent.ra} / Resultat següent →</span>
                <small>${seguent.titol}</small>
            </a>
        `;

    } else {

        html += `
            <a class="next-ra" href="index.html">
                <span class="nav-label">Fi →</span>
                <small>Tornar a l'inici</small>
            </a>
        `;

    }

    html += "</div>";

    document.querySelectorAll("[data-ra-navigation]").forEach(nav => {
        nav.innerHTML = html;
    });

});



/*==========================================
    Posar el mateix footer a totes les ra_0x.html
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const footer = document.querySelector("footer");

    if (!footer) return;

    const resultats = [
        "Prevenció i conscienciació en ciberseguretat",
        "Anàlisi d'incidents de ciberseguretat",
        "Investigació d'incidents de ciberseguretat",
        "Resposta davant incidents de ciberseguretat",
        "Notificació i documentació d'incidents de ciberseguretat"
    ];

    const pagina = window.location.pathname.split("/").pop();

    // "ra_03.html" -> 2
    const index = parseInt(pagina.substring(3, 5), 10) - 1;

    footer.innerHTML = `
        <p>Mòdul: Incidents de Ciberseguretat</p>

        <p><strong>Resultat d'Aprenentatge ${index + 1}</strong> · ${resultats[index]}</p>

        <p style="font-family: 'CCSymbols' ; font-size:larger;">
            2026 · Pablo Pérez · Llicència: &#x1F16D; &#x1F16F; &#x1F10E; &#x1F10F;
        
        </p>
    `;

});