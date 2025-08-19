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
    return new Date(dateString).toLocaleDateString('es-
