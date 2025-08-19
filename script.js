// Base de datos de herramientas
const tools = [
    {
        id: 1,
        title: "The Conjugator",
        description: "Un juego de conjugación con temática de Terminator. Selección de verbo avanzada y múltiples modos de juego. Perfecto para practicar los tiempos verbales mientras esquivas robots asesinos.",
        link: "https://conjugator.pablotorrado.site",
        subjects: ["Gramática", "General"],
        level: "Todos los niveles",
        type: "Juego",
        dateAdded: "2024-01-15",
        rating: 4.8,
        usageCount: 0
    },
    {
        id: 2,
        title: "SPAN1001 Palabrero",
        description: "Juego de palabras interactivo diseñado para estudiantes del curso SPAN1001. Cada día presenta una nueva palabra del vocabulario del libro de texto, siguiendo el calendario académico del semestre.",
        link: "https://1001palabrero.pablotorrado.site",
        subjects: ["SPAN1001", "Vocabulario"],
        level: "A1",
        type: "Juego",
        dateAdded: "2024-02-20",
        rating: 4.6,
        usageCount: 0
    },
    {
        id: 3,
        title: "Desencripta",
        description: "Adaptación digital del juego de mesa Decrypto. Desarrollado con HTML, CSS y JavaScript, lleva la experiencia de transmitir códigos secretos al navegador. Amplio vocabulario con más de 900 unidades léxicas.",
        link: "https://desencripta.pablotorrado.site",
        subjects: ["Vocabulario", "General"],
        level: "B1",
        type: "Juego",
        dateAdded: "2024-03-10",
        rating: 4.7,
        usageCount: 0
    },
    {
        id: 4,
        title: "Batalla Verbal",
        description: "Innovador juego que combina la estrategia del clásico hundir la flota con práctica de gramática. Cada ataque requiere conjugar un verbo correctamente. ¡Hunde a tu frenemigo con tus verbomisiles!",
        link: "https://batallaverbal.pablotorrado.site",
        subjects: ["Gramática", "General"],
        level: "A2",
        type: "Juego",
        dateAdded: "2024-03-25",
        rating: 4.9,
        usageCount: 0
    },
    {
        id: 5,
        title: "Atún Feliz",
        description: "Adaptación digital del juego de cartas Happy Salmon, creado con fines educativos para practicar vocabulario y reflejos. Incluye animaciones y sonidos que amenizan la experiencia.",
        link: "https://atunfeliz.pablotorrado.site",
        subjects: ["Vocabulario", "General"],
        level: "A1",
        type: "Juego",
        dateAdded: "2024-04-05",
        rating: 4.4,
        usageCount: 0
    },
    {
        id: 6,
        title: "Charaditas",
        description: "Nuestra versión personal de Charades con vocabulario de A1 y A2 del MCERL. Ideal para practicar vocabulario de forma divertida y en grupo.",
        link: "https://charaditas.pablotorrado.site",
        subjects: ["Vocabulario", "General"],
        level: "A1",
        type: "Juego",
        dateAdded: "2024-04-18",
        rating: 4.3,
        usageCount: 0
    },
    {
        id: 7,
        title: "Palabras Clave",
        description: "Juego tipo código secreto para estudiantes de español con el banco de palabras del CVC (Nivel A1-A2). Ideal para repasar vocabulario y fomentar el trabajo en equipo.",
        link: "https://palabrasclave.pablotorrado.site",
        subjects: ["Vocabulario", "General"],
        level: "A2",
        type: "Juego",
        dateAdded: "2024-05-02",
        rating: 4.5,
        usageCount: 0
    }
];

let filteredTools = [...tools];
let currentSort = 'alphabetical';
let currentView = 'card';
let currentLanguage = 'es';

// Traducciones
const translations = {
    noResults: {
        es: 'No se encontraron herramientas con los criterios seleccionados.',
        en: 'No tools found with the selected criteria.'
    },
    added: {
        es: 'Añadido:',
        en: 'Added:'
    },
    type: {
        es: 'Tipo:',
        en: 'Type:'
    },
    access: {
        es: 'Acceder →',
        en: 'Access →'
    },
    uses: {
        es: 'usos',
        en: 'uses'
    }
};

function renderTools() {
    const grid = document.getElementById('toolsGrid');
    const toolCount = document.getElementById('toolCount');
    
    if (filteredTools.length === 0) {
        grid.innerHTML = `<div class="no-results">${translations.noResults[currentLanguage]}</div>`;
        toolCount.textContent = '0';
        return;
    }

    grid.innerHTML = filteredTools.map(tool => `
        <div class="tool-card">
            <div class="tool-header">
                <h3 class="tool-title">${tool.title}</h3>
                <div class="tool-meta">
                    <span>${translations.added[currentLanguage]} ${formatDate(tool.dateAdded)}</span>
                    <span>${translations.type[currentLanguage]} ${tool.type}</span>
                </div>
            </div>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-tags">
                ${tool.subjects.map(subject => `<span class="tag subject">${subject}</span>`).join('')}
                <span class="tag level">${tool.level}</span>
            </div>
            <div class="tool-footer">
                <a href="${tool.link}" target="_blank" class="visit-btn">${translations.access[currentLanguage]}</a>
                <div class="rating">
                    <div class="stars">${'★'.repeat(Math.floor(tool.rating))}${tool.rating % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(tool.rating))}</div>
                    <span class="usage-count">(${tool.usageCount} ${translations.uses[currentLanguage]})</span>
                </div>
            </div>
        </div>
    `).join('');
    
    toolCount.textContent = filteredTools.length;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLanguage === 'es' ? 'es-ES' : 'en-US', options);
}

function sortTools(criteria) {
    switch(criteria) {
        case 'alphabetical':
            filteredTools.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'date':
            filteredTools.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'rating':
            filteredTools.sort((a, b) => b.rating - a.rating);
            break;
        case 'usage':
            filteredTools.sort((a, b) => b.usageCount - a.usageCount);
            break;
    }
    renderTools();
}

function filterTools() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const subjectFilter = document.getElementById('subjectFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;

    filteredTools = tools.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(searchTerm) || 
                            tool.description.toLowerCase().includes(searchTerm);
        const matchesSubject = !subjectFilter || tool.subjects.includes(subjectFilter);
        const matchesLevel = !levelFilter || tool.level === levelFilter;
        const matchesType = !typeFilter || tool.type === typeFilter;

        return matchesSearch && matchesSubject && matchesLevel && matchesType;
    });

    sortTools(currentSort);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    
    // Actualizar todos los elementos con data-es y data-en
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = element.getAttribute(`data-placeholder-${currentLanguage}`);
        } else {
            element.textContent = element.getAttribute(`data-${currentLanguage}`);
        }
    });
    
    // Actualizar el título principal con animación
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.transform = 'rotateY(180deg) scale(0.8)';
            setTimeout(() => {
                word.textContent = word.getAttribute(`data-${currentLanguage}`);
                word.style.transform = 'rotateY(0deg) scale(1)';
            }, 300);
        }, index * 100);
    });
    
    // Actualizar el botón de idioma
    const langBtn = document.getElementById('languageBtn');
    if (currentLanguage === 'en') {
        langBtn.innerHTML = '🇪🇸 ES';
        langBtn.title = 'Cambiar a español';
        document.documentElement.lang = 'en';
    } else {
        langBtn.innerHTML = '🇬🇧 EN';
        langBtn.title = 'Switch to English';
        document.documentElement.lang = 'es';
    }
    
    // Actualizar el título de la página
    document.title = currentLanguage === 'es' ? 
        'Herramientas de Español - Universidad de Hong Kong' : 
        'Spanish Learning Tools - University of Hong Kong';
    
    // Re-renderizar las herramientas con el nuevo idioma
    renderTools();
}

function changeView(viewType) {
    const grid = document.getElementById('toolsGrid');
    currentView = viewType;
    
    // Actualizar clases del grid
    grid.className = `tools-grid ${viewType}-view`;
    
    // Actualizar botones activos
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewType) {
            btn.classList.add('active');
        }
    });
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterTools);
document.getElementById('subjectFilter').addEventListener('change', filterTools);
document.getElementById('levelFilter').addEventListener('change', filterTools);
document.getElementById('typeFilter').addEventListener('change', filterTools);

document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        sortTools(currentSort);
    });
});

document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        changeView(btn.dataset.view);
    });
});

document.getElementById('languageBtn').addEventListener('click', toggleLanguage);

// Inicializar la página
renderTools();
