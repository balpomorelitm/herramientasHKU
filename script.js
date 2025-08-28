// Variables globales
let tools = [];
let filteredTools = [];
let currentSort = 'alphabetical';
let currentView = 'card';
let currentLanguage = 'en'; // Inglés por defecto
let currentTheme = 'light';

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
    },
    loading: {
        es: 'Cargando herramientas...',
        en: 'Loading tools...'
    },
    error: {
        es: 'Error al cargar las herramientas. Por favor, recarga la página.',
        en: 'Error loading tools. Please refresh the page.'
    }
};

// Función para cargar herramientas desde JSON
async function loadTools() {
    try {
        const response = await fetch('tools.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        tools = data.tools;
        filteredTools = [...tools];
        
        // Cargar contadores guardados después de cargar las herramientas
        loadUsageCounts();
        renderTools();
        
        console.log(`✅ Cargadas ${tools.length} herramientas desde tools.json`);
        return true;
    } catch (error) {
        console.error('❌ Error cargando herramientas:', error);
        
        // Mostrar mensaje de error en la UI
        const grid = document.getElementById('toolsGrid');
        grid.innerHTML = `
            <div class="no-results">
                <h3>⚠️ ${translations.error[currentLanguage]}</h3>
                <p>Error: ${error.message}</p>
            </div>
        `;
        return false;
    }
}

// Función para mostrar loading
function showLoading() {
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = `
        <div class="no-results">
            <h3>⏳ ${translations.loading[currentLanguage]}</h3>
        </div>
    `;
}

// Función para obtener el texto localizado
function getLocalizedText(textObj) {
    if (typeof textObj === 'object' && textObj[currentLanguage]) {
        return textObj[currentLanguage];
    }
    return textObj; // Fallback si no es un objeto bilingüe
}

// Función para cargar contadores guardados
function loadUsageCounts() {
    tools.forEach(tool => {
        const count = parseInt(localStorage.getItem(`tool_usage_${tool.id}`) || '0');
        tool.usageCount = count;
    });
}

// Función para incrementar y guardar contador
function incrementUsage(toolId, toolName) {
    const key = `tool_usage_${toolId}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0');
    const newCount = currentCount + 1;
    
    // Guardar en localStorage
    localStorage.setItem(key, newCount.toString());
    
    // Actualizar en memoria
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
        tool.usageCount = newCount;
    }
    
    // Analytics opcional (si tienes Google Analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_access', {
            'tool_name': toolName,
            'usage_count': newCount
        });
    }
    
    // Re-renderizar para mostrar contador actualizado
    renderTools();
    
    // Log para debugging
    console.log(`${toolName} usado ${newCount} veces`);
}

// Función para obtener estadísticas
function getUsageStats() {
    const stats = tools.map(tool => ({
        name: tool.title,
        clicks: tool.usageCount
    })).sort((a, b) => b.clicks - a.clicks);
    
    console.table(stats);
    return stats;
}

// Función para resetear contadores (para testing)
function resetAllCounters() {
    tools.forEach(tool => {
        localStorage.removeItem(`tool_usage_${tool.id}`);
        tool.usageCount = 0;
    });
    renderTools();
    console.log('Todos los contadores reseteados');
}

// Función para manejar saltos de línea inteligentes en el título
function handleMobileTitle() {
    if (window.innerWidth <= 768) {
        const titleWord = document.querySelector('.title-word');
        const titleText = titleWord.getAttribute(`data-${currentLanguage}`);
        
        let formattedTitle = titleText;
        
        // Reglas específicas para cada idioma
        if (currentLanguage === 'es') {
            // "HERRAMIENTAS PARA APRENDER ESPAÑOL" -> "HERRAMIENTAS PARA<br>APRENDER ESPAÑOL"
            formattedTitle = titleText.replace('PARA APRENDER', 'PARA<br>APRENDER');
        } else if (currentLanguage === 'en') {
            // "SPANISH LEARNING TOOLS" -> "SPANISH<br>LEARNING TOOLS"
            formattedTitle = titleText.replace('SPANISH LEARNING', 'SPANISH<br>LEARNING');
        }
        
        // Limpiar título actual
        titleWord.innerHTML = '';
        
        // Dividir por <br> y procesar cada línea
        const lines = formattedTitle.split('<br>');
        
        lines.forEach((line, lineIndex) => {
            if (lineIndex > 0) {
                // Añadir salto de línea
                const lineBreak = document.createElement('br');
                titleWord.appendChild(lineBreak);
            }
            
            // Añadir letras de esta línea
            line.split('').forEach(letter => {
                const letterSpan = document.createElement('span');
                letterSpan.className = letter === ' ' ? 'title-letter space' : 'title-letter';
                letterSpan.textContent = letter === ' ' ? '\u00A0' : letter;
                titleWord.appendChild(letterSpan);
            });
        });
    } else {
        // En desktop, usar el comportamiento normal
        const titleWord = document.querySelector('.title-word');
        const titleText = titleWord.getAttribute(`data-${currentLanguage}`);
        titleWord.innerHTML = '';
        
        titleText.split('').forEach(letter => {
            const letterSpan = document.createElement('span');
            letterSpan.className = letter === ' ' ? 'title-letter space' : 'title-letter';
            letterSpan.textContent = letter === ' ' ? '\u00A0' : letter;
            titleWord.appendChild(letterSpan);
        });
    }
}

// Función para inicializar las letras del título
function initializeTitle() {
    handleMobileTitle();
}

// Escuchar cambios de tamaño de ventana
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        handleMobileTitle();
    }, 250);
});

// Función para cargar tema guardado
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton();
    }
}

// Función para cambiar tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('preferred-theme', currentTheme);
    updateThemeButton();
}

// Función para actualizar el botón de tema
function updateThemeButton() {
    const themeBtn = document.getElementById('themeBtn');
    if (currentTheme === 'dark') {
        themeBtn.title = themeBtn.getAttribute('data-tooltip-dark') || 'Switch to light mode';
    } else {
        themeBtn.title = themeBtn.getAttribute('data-tooltip-light') || 'Switch to dark mode';
    }
}

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
                    <span>${translations.type[currentLanguage]} ${getLocalizedText(tool.type)}</span>
                </div>
            </div>
            <p class="tool-description">${getLocalizedText(tool.description)}</p>
            <div class="tool-tags">
                ${getLocalizedText(tool.subjects).map(subject => `<span class="tag subject">${subject}</span>`).join('')}
            </div>
            <div class="tool-footer">
                <a href="${tool.link}" 
                   target="_blank" 
                   class="visit-btn" 
                   onclick="incrementUsage(${tool.id}, '${tool.title.replace(/'/g, "\\'")}'); return true;">
                   ${translations.access[currentLanguage]}
                </a>
                <div class="usage-stats">
                    <span class="usage-count">${tool.usageCount} ${translations.uses[currentLanguage]}</span>
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
        case 'usage':
            filteredTools.sort((a, b) => b.usageCount - a.usageCount);
            break;
    }
    renderTools();
}

function filterTools() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const subjectFilter = document.getElementById('subjectFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;

    filteredTools = tools.filter(tool => {
        // Buscar en títulos y descripciones en ambos idiomas
        const matchesSearch = tool.title.toLowerCase().includes(searchTerm) || 
                            getLocalizedText(tool.description).toLowerCase().includes(searchTerm);
        
        // Verificar subjects en el idioma actual
        const currentSubjects = getLocalizedText(tool.subjects);
        const matchesSubject = !subjectFilter || currentSubjects.includes(subjectFilter);
        
        // Verificar type en el idioma actual
        const currentType = getLocalizedText(tool.type);
        const matchesType = !typeFilter || currentType === typeFilter;

        return matchesSearch && matchesSubject && matchesType;
    });

    sortTools(currentSort);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    
    // Actualizar todos los elementos con data-es y data-en (excepto el título)
    document.querySelectorAll('[data-es][data-en]:not(.title-word)').forEach(element => {
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = element.getAttribute(`data-placeholder-${currentLanguage}`);
        } else {
            element.textContent = element.getAttribute(`data-${currentLanguage}`);
        }
    });
    
    // Actualizar el título principal con animación letra por letra
    const titleWord = document.querySelector('.title-word');
    const newTitle = titleWord.getAttribute(`data-${currentLanguage}`);
    
    // Limpiar título actual con animación
    const currentLetters = titleWord.querySelectorAll('.title-letter, br');
    currentLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(50px) rotate(180deg)';
        }, index * 20);
    });
    
    // Después de la animación de salida, crear nuevo título
    setTimeout(() => {
        handleMobileTitle();
        
        // Animar entrada del nuevo título
        const newLetters = titleWord.querySelectorAll('.title-letter');
        newLetters.forEach((letter, index) => {
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(-50px) rotate(180deg)';
            
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0) rotate(0deg)';
                letter.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, index * 50);
        });
    }, currentLetters.length * 20 + 200);
    
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
    
    // Actualizar tooltips del botón de tema
    const themeBtn = document.getElementById('themeBtn');
    if (currentLanguage === 'es') {
        themeBtn.setAttribute('data-tooltip-light', 'Cambiar a modo oscuro');
        themeBtn.setAttribute('data-tooltip-dark', 'Cambiar a modo claro');
    } else {
        themeBtn.setAttribute('data-tooltip-light', 'Switch to dark mode');
        themeBtn.setAttribute('data-tooltip-dark', 'Switch to light mode');
    }
    updateThemeButton();
    
    // Actualizar el título de la página
    document.title = currentLanguage === 'es' ? 
        'Herramientas para Aprender Español - Universidad de Hong Kong' : 
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
document.getElementById('themeBtn').addEventListener('click', toggleTheme);

// Inicializar la página
async function initApp() {
    // Mostrar loading
    showLoading();
    
    // Cargar tema guardado
    loadSavedTheme();
    
    // Inicializar título
    initializeTitle();
    
    // Cargar herramientas desde JSON
    const success = await loadTools();
    
    if (!success) {
        console.error('❌ No se pudieron cargar las herramientas');
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
