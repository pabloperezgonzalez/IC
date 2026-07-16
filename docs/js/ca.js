/*****************************************************************
    RA.JS
    Part 1
*****************************************************************/


document.addEventListener("DOMContentLoaded", () => {

    generarIndex();

    activarScrollSpy();

    barraProgres();

    initMermaid();
   


});


/* ==========================================================
   MERMAID
========================================================== */

function initMermaid() {

    document.querySelectorAll(".mermaid").forEach(el => {

        // Guardem el codi original només la primera vegada
        if (!el.dataset.source) {
            el.dataset.source = el.textContent;
        }

        // Restaurar el codi Mermaid
        el.removeAttribute("data-processed");
        el.innerHTML = el.dataset.source;

    });

    mermaid.initialize({

        startOnLoad: false,

        securityLevel: "loose",

        theme: document.body.classList.contains("light")
            ? "default"
            : "dark"

    });

    mermaid.run();

}


/*****************************************************************
    ÍNDEX AUTOMÀTIC
*****************************************************************/

function generarIndex() {

    const toc = document.getElementById("toc");

    if (!toc) return;

    /*const titols = document.querySelectorAll("article h2, article h3");*/
    const titols = document.querySelectorAll("article h2");

    titols.forEach((titol, index) => {

        if (!titol.id) {

            titol.id = "sec-" + index;

        }

        const link = document.createElement("a");

        link.href = "#" + titol.id;

        link.textContent = titol.textContent;

        if (titol.tagName === "H3") {

            link.classList.add("sub");

        }

        toc.appendChild(link);

    });

}



/*****************************************************************
    SCROLLSPY
*****************************************************************/

function activarScrollSpy() {

    const links = document.querySelectorAll("#toc a");

    /*const seccions = document.querySelectorAll("article h2, article h3");*/

        const seccions = document.querySelectorAll("article h2");

    const observer = new IntersectionObserver(

        (entrades) => {

            entrades.forEach((entrada) => {

                if (!entrada.isIntersecting) return;

                links.forEach((link) => {

                    link.classList.remove("active");

                    if (link.getAttribute("href") === "#" + entrada.target.id) {

                        link.classList.add("active");

                    }

                });

            });

        },

        {

            rootMargin: "-20% 0px -70% 0px"

        }

    );

    seccions.forEach(sec => observer.observe(sec));

}



/*****************************************************************
    BARRA DE PROGRÉS
*****************************************************************/

function barraProgres() {

    const barra = document.getElementById("progress-bar");

    if (!barra) return;

    window.addEventListener("scroll", () => {

        const altura =

            document.documentElement.scrollHeight -

            document.documentElement.clientHeight;

        const percentatge =

            (window.scrollY / altura) * 100;

        barra.style.width = percentatge + "%";

    });

}

/*****************************************************************
    CERCADOR DE CONTINGUT
*****************************************************************/

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        eliminarMarks();

        const text = this.value.trim().toLowerCase();

        if (text.length < 2) return;

        buscar(document.getElementById("article"), text);

    });

}


function buscar(element, text) {

    if (!element) return;

    for (const node of element.childNodes) {

        if (node.nodeType === 3) {

            const valor = node.nodeValue;

            const pos = valor.toLowerCase().indexOf(text);

            if (pos >= 0) {

                const span = document.createElement("span");

                span.innerHTML =

                    valor.substring(0, pos) +

                    "<mark>" +

                    valor.substring(pos, pos + text.length) +

                    "</mark>" +

                    valor.substring(pos + text.length);

                node.parentNode.replaceChild(span, node);

            }

        }

        else if (

            node.nodeType === 1 &&

            node.tagName !== "SCRIPT" &&

            node.tagName !== "STYLE" &&

            node.tagName !== "MARK"

        ) {

            buscar(node, text);

        }

    }

}


function eliminarMarks() {

    document.querySelectorAll("mark").forEach(mark => {

        const text = document.createTextNode(mark.textContent);

        mark.parentNode.replaceChild(text, mark);

        mark.parentNode.normalize();

    });

}



/*****************************************************************
    BOTÓ COPIAR
*****************************************************************/

document.querySelectorAll(".copy-btn").forEach(boto => {

    boto.addEventListener("click", () => {

        const codi = boto.parentElement.querySelector("code");

        navigator.clipboard.writeText(codi.innerText);

        const txt = boto.innerHTML;

        boto.innerHTML = "✔ Copiat";

        setTimeout(() => {

            boto.innerHTML = txt;

        }, 1800);

    });

});



/*****************************************************************
    MODE CLAR / FOSC
*****************************************************************/

const botoTema = document.getElementById("themeToggle");

const temaGuardat = localStorage.getItem("tema");

if (temaGuardat === "clar") {

    document.body.classList.add("light");

    if (botoTema) botoTema.innerHTML = "🌙 fosc";

}

else {

    if (botoTema) botoTema.innerHTML = "☀️ clar";

}

// Inicialitzar Mermaid una vegada carregada la pàgina
if (typeof mermaid !== "undefined") {
    initMermaid();
}

if (botoTema) {

    botoTema.addEventListener("click", () => {

        document.body.classList.toggle("light");

        const clar = document.body.classList.contains("light");

        localStorage.setItem(

            "tema",

            clar ? "clar" : "fosc"

        );

        botoTema.innerHTML =

            clar

                ? "🌙 fosc"

                : "☀️ clar";
            // Redibuixar els diagrames
        if (typeof mermaid !== "undefined") {
            initMermaid();
        }


    });

    
}
/*****************************************************************
    BOTÓ "TORNAR A DALT"
*****************************************************************/

const backButton = document.getElementById("backToTop");

if (backButton) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backButton.style.display = "block";

        }
        else {

            backButton.style.display = "none";

        }

    });

    backButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}



/*****************************************************************
    ANIMACIÓ D'ENTRADA DE LES SECCIONS
*****************************************************************/

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },

    {

        threshold: 0.15

    }

);

document.querySelectorAll("section").forEach(sec => {

    sec.classList.add("hidden");

    observer.observe(sec);

});



/*****************************************************************
    TANCAR EL CERCADOR AMB ESC
*****************************************************************/

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        const input = document.getElementById("searchInput");

        if (!input) return;

        input.value = "";

        eliminarMarks();

    }

});



/*****************************************************************
    SCROLL SUAU ALS ENLLAÇOS INTERNS
*****************************************************************/

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const desti = document.querySelector(

            this.getAttribute("href")

        );

        if(desti){

            desti.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});



/*****************************************************************
    EFECTE A LES TARGETES
*****************************************************************/

document.querySelectorAll(

    ".activity-card, .lab-card, .resource-card"

).forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =

            "translateY(-8px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =

            "translateY(0) scale(1)";

    });

});



/*****************************************************************
    MISSATGE FINAL A LA CONSOLA
*****************************************************************/

console.log(

`========================================

 Plataforma CE-CETI

 Mòdul Incidents de Ciberseguretat

 Plantilla carregada correctament.

========================================`

);



/* ==========================================================
   NAVEGACIÓ AUTOMÀTICA ENTRE CRITERIS D'AVALUACIÓ
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const criteris = [

        // ==========================
        // RA1
        // ==========================

        {
            id: "ca_1a.html",
            ra: "ra_01.html",
            ca: "CA1a",
            titol: "Principis generals de ciberseguretat"
        },

        {
            id: "ca_1b.html",
            ra: "ra_01.html",
            ca: "CA1b",
            titol: "Normativa de protecció del lloc de treball"
        },

        {
            id: "ca_1c.html",
            ra: "ra_01.html",
            ca: "CA1c",
            titol: "Pla de conscienciació en ciberseguretat"
        },

        {
            id: "ca_1d.html",
            ra: "ra_01.html",
            ca: "CA1d",
            titol: "Materials de conscienciació"
        },

        {
            id: "ca_1e.html",
            ra: "ra_01.html",
            ca: "CA1e",
            titol: "Auditoria del pla de prevenció"
        },



        // ==========================
        // RA2
        // ==========================

        {
            id: "ca_2a.html",
            ra: "ra_02.html",
            ca: "CA2a",
            titol: "Taxonomia d'incidents"
        },

        {
            id: "ca_2b.html",
            ra: "ra_02.html",
            ca: "CA2b",
            titol: "Monitorització i detecció"
        },

        {
            id: "ca_2c.html",
            ra: "ra_02.html",
            ca: "CA2c",
            titol: "Seguretat física"
        },

        {
            id: "ca_2d.html",
            ra: "ra_02.html",
            ca: "CA2d",
            titol: "OSINT"
        },

        {
            id: "ca_2e.html",
            ra: "ra_02.html",
            ca: "CA2e",
            titol: "Classificació i seguiment"
        },



        // ==========================
        // RA3
        // ==========================

        {
            id: "ca_3a.html",
            ra: "ra_03.html",
            ca: "CA3a",
            titol: "Recollida d'evidències"
        },

        {
            id: "ca_3b.html",
            ra: "ra_03.html",
            ca: "CA3b",
            titol: "Anàlisi d'evidències"
        },

        {
            id: "ca_3c.html",
            ra: "ra_03.html",
            ca: "CA3c",
            titol: "Investigació d'incidents"
        },

        {
            id: "ca_3d.html",
            ra: "ra_03.html",
            ca: "CA3d",
            titol: "Intercanvi d'informació"
        },

        {
            id: "ca_3e.html",
            ra: "ra_03.html",
            ca: "CA3e",
            titol: "Mesures de contenció"
        },



        // ==========================
        // RA4
        // ==========================

        {
            id: "ca_4a.html",
            ra: "ra_04.html",
            ca: "CA4a",
            titol: "Procediments de resposta"
        },

        {
            id: "ca_4b.html",
            ra: "ra_04.html",
            ca: "CA4b",
            titol: "Ciberresiliència"
        },

        {
            id: "ca_4c.html",
            ra: "ra_04.html",
            ca: "CA4c",
            titol: "Escalat d'incidents"
        },

        {
            id: "ca_4d.html",
            ra: "ra_04.html",
            ca: "CA4d",
            titol: "Restabliment dels serveis"
        },

        {
            id: "ca_4e.html",
            ra: "ra_04.html",
            ca: "CA4e",
            titol: "Lliçons apreses"
        },

        {
            id: "ca_4f.html",
            ra: "ra_04.html",
            ca: "CA4f",
            titol: "Seguiment de l'incident"
        },



        // ==========================
        // RA5
        // ==========================

        {
            id: "ca_5a.html",
            ra: "ra_05.html",
            ca: "CA5a",
            titol: "Procediment de notificació"
        },

        {
            id: "ca_5b.html",
            ra: "ra_05.html",
            ca: "CA5b",
            titol: "Notificació interna"
        },

        {
            id: "ca_5c.html",
            ra: "ra_05.html",
            ca: "CA5c",
            titol: "Autoritats competents"
        },

        {
            id: "ca_5d.html",
            ra: "ra_05.html",
            ca: "CA5d",
            titol: "Comunicació als afectats"
        },

        {
            id: "ca_5e.html",
            ra: "ra_05.html",
            ca: "CA5e",
            titol: "Comunicació als mitjans"
        }

    ];


    /* ===============================
       Detectar la pàgina actual
    =============================== */

    const paginaActual = window.location.pathname.split("/").pop();

    const index = criteris.findIndex(c => c.id === paginaActual);

    if (index === -1) return;


    let html = '<div class="ca-navigation">';



    /* ===============================
       Botó anterior
    =============================== */

    if (index > 0) {

        const anterior = criteris[index - 1];

        html += `

        <a class="prev-ca" href="${anterior.id}">

            <span class="nav-label">← Criteri anterior  / ${anterior.ca}</span>   

            <small>${anterior.titol}</small>

        </a>

        `;

    }

    else{

       /* html += '<div></div>';*/

       html += `

        <a class="prev-ca" href="">

            <span class="nav-label"> INICI</span>   

            <small>...</small>

        </a>

        `;        

    }


        /* ===============================
            Botó RA
        =============================== */
        const actual = criteris[index];

        const textRA = actual.ra
            .replace(".html", "")
            .replace("_", " ")
            .toUpperCase();

        html += `
        <a class="current-ra" href="${actual.ra}">
            <span class="nav-label">📘 Resultat d'aprenentatge</span>
            <small>${textRA}</small>
        </a>
        `;        


    /* ===============================
       Botó següent
    =============================== */

    if (index < criteris.length - 1) {

        const següent = criteris[index + 1];

        html += `

        <a class="next-ca" href="${següent.id}">

            <span class="nav-label">  ${següent.ca} / Criteri següent →  </span>

            <small>${següent.titol}</small>

        </a>

        `;

    }

    else{

       /* html += '<div></div>';*/

        html += `

        <a class="next-ca" href="">

            <span class="nav-label">  FI </span>

            <small>...</small>

        </a>

        `;
       
    }



    html += "</div>";

    document.querySelectorAll("[data-ca-navigation]").forEach(nav => {

    nav.innerHTML = html;

});

   

});






/*==========================================================
    IMATGES AMPLIABLES
==========================================================*/

document.querySelectorAll(".zoomable").forEach(img => {

    img.addEventListener("click", () => {

        // Crear overlay
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";

        // Crear imatge
        const zoom = document.createElement("img");
        zoom.src = img.src;
        zoom.alt = img.alt;

        overlay.appendChild(zoom);
        document.body.appendChild(overlay);

        // Animació d'entrada
        requestAnimationFrame(() => {

            overlay.classList.add("show");

        });

        let escala = 1;

        /*==========================================
            Zoom amb la roda del ratolí
        ==========================================*/

        overlay.addEventListener("wheel", e => {

            e.preventDefault();

            const increment = 0.10;

            if (e.deltaY < 0) {

                escala += increment;

            } else {

                escala -= increment;

            }

            escala = Math.max(0.5, Math.min(5, escala));

            zoom.style.transform = `scale(${escala})`;

        });

        /*==========================================
            Tancar fent clic fora
        ==========================================*/

        overlay.addEventListener("click", e => {

            if (e.target === overlay) {

                tancar();

            }

        });

        /*==========================================
            Tancar amb ESC
        ==========================================*/

        function tecla(e) {

            if (e.key === "Escape") {

                tancar();

            }

        }

        document.addEventListener("keydown", tecla);

        /*==========================================
            Funció de tancament
        ==========================================*/

        function tancar() {

            overlay.classList.remove("show");

            setTimeout(() => {

                document.removeEventListener("keydown", tecla);

                overlay.remove();

            }, 200);

        }

    });

});



/*==========================================
    Posar el mateix footer a totes les ca_xy.html    
==========================================*/
document.addEventListener("DOMContentLoaded", () => {

    const footer = document.querySelector("footer");

    if (!footer) return;

    footer.innerHTML = `
        <p>Mòdul: Incidents de Ciberseguretat</p>

        <p>Criteris d'avaluació</p>

    <p style="font-family:'CCSymbols' ; font-size:larger;">  
                2026 ·· Llicència: &#x1F16D; &#x1F16F; &#x1F10E; &#x1F10F;       </p>

    `;

});


