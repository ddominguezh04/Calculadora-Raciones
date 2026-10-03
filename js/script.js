document.addEventListener('DOMContentLoaded', () => {
    // --- TOAST ---
    function showToast(msg, type = 'success') {
        const toast = document.getElementById('toast');
        const colors = { success: 'hsl(161,80%,40%)', error: 'hsl(0,70%,55%)', info: 'hsl(250,70%,60%)' };
        toast.textContent = msg;
        toast.style.borderColor = colors[type] + '55';
        toast.style.color = type === 'success' ? 'hsl(161,80%,80%)' : type === 'error' ? 'hsl(0,70%,80%)' : 'hsl(250,70%,85%)';
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(80px)';
        }, 2500);
    }

    // --- THEME TOGGLE ---
    const htmlEl  = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    const THEME_COLORS = { dark: '#0d0f1a', light: '#f0f2f7' };

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const thumb = themeBtn.querySelector('.toggle-thumb');
        thumb.textContent = theme === 'dark' ? '🌙' : '☀️';
        if (metaTheme) metaTheme.setAttribute('content', THEME_COLORS[theme]);
    }

    // Load saved or system preference
    const saved = localStorage.getItem('theme');
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(preferred);

    themeBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    const ffSelect = document.getElementById('fastfood-select');


fastFoods.forEach(food => {
    const option = document.createElement('option');
    option.value = food.id;
    option.textContent = `${food.brand} - ${food.name}`;
    ffSelect.appendChild(option);
});

    // --- TABS LOGIC ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // --- MENU STATE ---
    let mealList = [];
    const menuCountBadge = document.getElementById('menu-count-badge');
    const menuListEl = document.getElementById('menu-list');
    const menuTotalRations = document.getElementById('menu-total-rations');
    const menuTotalCarbs = document.getElementById('menu-total-carbs');
    const btnClearMenu = document.getElementById('btn-clear-menu');

    function addToMenu(item) {
        mealList.push(item);
        updateMenuUI();
        const badgeBtn = document.querySelector('.tab-btn[data-tab="menu"]');
        badgeBtn.classList.add('pulse');
        setTimeout(() => badgeBtn.classList.remove('pulse'), 350);
        showToast(`✅ ${item.name} añadido al menú`, 'success');
    }

    function removeFromMenu(index) {
        mealList.splice(index, 1);
        updateMenuUI();
    }

    function updateMenuUI() {
        menuCountBadge.textContent = mealList.length;
        menuListEl.innerHTML = '';
        if (mealList.length === 0) {
            menuListEl.innerHTML = '<div class="empty-state"><p>Tu menú está vacío. Añade alimentos desde las otras pestañas.</p></div>';
        } else {
            mealList.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'menu-item';
                div.innerHTML = `
                    <div class="menu-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.details}</p>
                    </div>
                    <div class="menu-item-stats">
                        <span class="menu-rations">${item.rations.toFixed(1)} R</span>
                        <span class="menu-carbs">${item.carbs.toFixed(1)}g HC</span>
                    </div>
                    <button class="btn-remove" data-index="${index}">×</button>
                `;
                menuListEl.appendChild(div);
            });

            document.querySelectorAll('.btn-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromMenu(parseInt(e.target.dataset.index, 10));
                });
            });
        }

        const totalCarbs = mealList.reduce((sum, item) => sum + item.carbs, 0);
        const totalRations = totalCarbs / 10;
        menuTotalCarbs.textContent = `${totalCarbs.toFixed(1)}g`;
        menuTotalRations.textContent = totalRations.toFixed(1);
    }

    btnClearMenu.addEventListener('click', () => {
        if (mealList.length === 0) return;
        showToast('🗑️ Menú borrado', 'info');
        mealList = [];
        updateMenuUI();
    });

    // --- BASIC FOODS SEARCH & CALC ---
    const basicSearch = document.getElementById('basic-search');
    const basicResults = document.getElementById('basic-results');
    const basicCalculator = document.getElementById('basic-calculator');
    const basicInput = document.getElementById('basic-input');
    const btnAddBasic = document.getElementById('btn-add-basic');

    const basicName = document.getElementById('basic-name');
    const basicCategory = document.getElementById('basic-category');
    const basicResultRations = document.getElementById('basic-result-rations');
    const basicResultCarbs = document.getElementById('basic-result-carbs');
    const basicInfoGrams = document.getElementById('basic-info-grams');
    const basicInfoCarbs = document.getElementById('basic-info-carbs');

    const basicInputLabel = document.querySelector('#basic-calculator label');
    const basicUnitSpan = document.querySelector('#basic-calculator .unit');

    let currentBasicFood = null;

    basicSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            basicResults.classList.add('hidden');
            return;
        }
        const matches = basicFoods.filter(food =>
            food.name.toLowerCase().includes(query)
        );
        renderBasicResults(matches);
    });

    function renderBasicResults(foods) {
        basicResults.innerHTML = '';
        if (foods.length === 0) {
            basicResults.classList.add('hidden');
            return;
        }
        foods.forEach(food => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <span class="item-name">${food.name}</span>
                <span class="item-category">${food.category}</span>
            `;
            div.addEventListener('click', () => selectBasicFood(food));
            basicResults.appendChild(div);
        });
        basicResults.classList.remove('hidden');
    }

    function selectBasicFood(food) {
        currentBasicFood = food;
        basicName.textContent = food.name;
        basicCategory.textContent = food.category;

        const unit = food.unit || 'g';
        if (unit === 'ud') {
            basicInputLabel.textContent = 'Cantidad (Unidades)';
            basicUnitSpan.textContent = 'ud';
            basicInput.placeholder = '1';
            document.querySelector('.info-text').style.display = 'none';
        } else if (unit === 'ml') {
            basicInputLabel.textContent = 'Cantidad (Mililitros)';
            basicUnitSpan.textContent = 'ml';
            basicInput.placeholder = '100';
            document.querySelector('.info-text').style.display = 'none';
        } else {
            basicInputLabel.textContent = `Cantidad (Gramos)`;
            basicUnitSpan.textContent = 'g';
            basicInput.placeholder = '100';
            document.querySelector('.info-text').style.display = 'block';
            basicInfoGrams.textContent = food.gramsPerHCGiven10;
            basicInfoCarbs.textContent = 10;
        }

        basicSearch.value = '';
        basicResults.classList.add('hidden');
        basicCalculator.classList.remove('hidden');
        basicInput.value = '';
        basicResultRations.textContent = '0.0';
        basicResultCarbs.textContent = '0g';
        basicInput.focus();
    }

    function getBasicCalculation() {
        if (!currentBasicFood) return null;
        const amount = parseFloat(basicInput.value) || 0;
        if (amount <= 0) return null;

        const gPorRacion = currentBasicFood.gramsPerHCGiven10;
        if (!gPorRacion || !isFinite(gPorRacion)) return null;

        let totalCarbs = 0;
        let details = '';

        if (currentBasicFood.unit === 'ud' || currentBasicFood.unit === 'ml') {
            totalCarbs = amount * 10 / gPorRacion;
            details = `${amount} ${currentBasicFood.unit}`;
        } else {
            totalCarbs = amount * 10 / gPorRacion;
            details = `${amount} g`;
        }

        const rations = totalCarbs / 10;
        return { amount, totalCarbs, rations, details };
    }

    basicInput.addEventListener('input', () => {
        const calc = getBasicCalculation();
        if (calc) {
            basicResultCarbs.textContent = `${calc.totalCarbs.toFixed(1)}g`;
            basicResultRations.textContent = calc.rations.toFixed(1);
        } else {
            basicResultCarbs.textContent = '0g';
            basicResultRations.textContent = '0.0';
        }
    });

    btnAddBasic.addEventListener('click', () => {
        const calc = getBasicCalculation();
        if (calc) {
            addToMenu({
                name: currentBasicFood.name,
                details: calc.details,
                carbs: calc.totalCarbs,
                rations: calc.rations
            });
            basicInput.value = '';
            basicResultCarbs.textContent = '0g';
            basicResultRations.textContent = '0.0';
        } else {
            showToast('⚠️ Introduce una cantidad válida', 'error');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-section')) {
            basicResults.classList.add('hidden');
        }
    });

    // ============================================================
    //  FASTFOOD CALCULATOR + LIST
    // ============================================================
    let currentFF    = null;
    let ffList       = [];

    const ffCalculator   = document.getElementById('fastfood-calculator');
    const ffNameEl       = document.getElementById('ff-name');
    const ffBrandEl      = document.getElementById('ff-brand');
    const ffInput        = document.getElementById('ff-input');
    const ffResultRations= document.getElementById('ff-result-rations');
    const ffResultCarbs  = document.getElementById('ff-result-carbs');
    const ffComponents   = document.getElementById('ff-components');
    const ffCompList     = document.getElementById('ff-components-list');
    const btnFFAccept    = document.getElementById('btn-ff-accept');
    const btnFFReject    = document.getElementById('btn-ff-reject');
    const ffListEl       = document.getElementById('ff-list');
    const ffListBadge    = document.getElementById('ff-list-badge');
    const ffListActions  = document.getElementById('ff-list-actions');
    const btnFFClear     = document.getElementById('btn-ff-clear-list');
    const btnFFLoad      = document.getElementById('btn-ff-load-menu');

    // --- Select change: show calculator ---
    ffSelect.addEventListener('change', () => {
        const id = ffSelect.value;
        if (!id) { ffCalculator.classList.add('hidden'); currentFF = null; return; }

        currentFF = fastFoods.find(f => String(f.id) === String(id));
        if (!currentFF) return;

        ffNameEl.textContent  = currentFF.name;
        ffBrandEl.textContent = currentFF.brand;
        ffInput.value = 1;

        // Populate ingredient checkboxes
        ffCompList.innerHTML = '';
        if (currentFF.components && currentFF.components.length > 0) {
            ffComponents.classList.remove('hidden');
            currentFF.components.forEach((comp, i) => {
                const label = document.createElement('label');
                label.className = 'component-item';
                label.innerHTML = `
                    <input type="checkbox" ${comp.default ? 'checked' : ''} data-index="${i}">
                    <span class="comp-name">${comp.name}</span>
                    <span class="comp-carbs">${comp.carbs}g HC</span>
                `;
                ffCompList.appendChild(label);
            });
        } else {
            ffComponents.classList.add('hidden');
        }

        calcFF();
        ffCalculator.classList.remove('hidden');
        ffCalculator.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // --- Calculate FF result ---
    function calcFF() {
        if (!currentFF) return;
        const qty = Math.max(1, parseInt(ffInput.value) || 1);
        let totalCarbs = 0;

        if (currentFF.components && currentFF.components.length > 0) {
            ffCompList.querySelectorAll('input[type="checkbox"]').forEach((chk, i) => {
                if (chk.checked) totalCarbs += (currentFF.components[i].carbs || 0);
            });
        }
        totalCarbs *= qty;

        const rations = totalCarbs / 10;
        ffResultCarbs.textContent   = `${totalCarbs.toFixed(1)}g`;
        ffResultRations.textContent = rations.toFixed(1);
    }

    ffInput.addEventListener('input', calcFF);
    ffCompList.addEventListener('change', calcFF);

    // --- ✓ Accept: add to ffList ---
    btnFFAccept.addEventListener('click', () => {
        if (!currentFF) return;
        const qty    = Math.max(1, parseInt(ffInput.value) || 1);
        const carbs  = parseFloat(ffResultCarbs.textContent) || 0;
        const rations= parseFloat(ffResultRations.textContent) || 0;

        // Collect selected components for label
        const selected = [];
        ffCompList.querySelectorAll('input[type="checkbox"]').forEach((chk, i) => {
            if (chk.checked) selected.push(currentFF.components[i].name);
        });

        ffList.push({
            id:      Date.now(),
            name:    `${currentFF.brand} — ${currentFF.name}`,
            details: `${qty} ud · ${selected.join(', ')}`,
            carbs,
            rations
        });

        updateFFList();
        showToast(`✅ ${currentFF.name} añadido a la lista`, 'success');

        // Reset select & hide calculator
        ffSelect.value = '';
        ffCalculator.classList.add('hidden');
        currentFF = null;
    });

    // --- ✕ Reject: dismiss card ---
    btnFFReject.addEventListener('click', () => {
        ffSelect.value = '';
        ffCalculator.classList.add('hidden');
        currentFF = null;
    });

    // --- Render FF list ---
    function updateFFList() {
        ffListBadge.textContent = ffList.length;
        ffListEl.innerHTML = '';

        if (ffList.length === 0) {
            ffListEl.innerHTML = '<div class="empty-state ff-empty"><p>Selecciona productos para añadirlos a tu lista.</p></div>';
            ffListActions.classList.add('hidden');
            return;
        }

        ffList.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'ff-list-item';
            div.innerHTML = `
                <div class="ff-list-item-info">
                    <span class="ff-list-item-name">${item.name}</span>
                    <span class="ff-list-item-detail">${item.details}</span>
                </div>
                <div class="ff-list-item-stats">
                    <span class="ff-list-rations">${item.rations.toFixed(1)} R</span>
                    <span class="ff-list-carbs">${item.carbs.toFixed(1)}g HC</span>
                </div>
                <button class="btn-remove" data-idx="${idx}" aria-label="Eliminar">×</button>
            `;
            ffListEl.appendChild(div);
        });

        // Individual remove
        ffListEl.querySelectorAll('.btn-remove[data-idx]').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                ffList.splice(idx, 1);
                updateFFList();
                showToast('🗑️ Producto eliminado', 'info');
            });
        });

        ffListActions.classList.remove('hidden');
    }

    // --- Borrar lista ---
    btnFFClear.addEventListener('click', () => {
        ffList = [];
        updateFFList();
        showToast('🗑️ Lista borrada', 'info');
    });

    // --- Cargar lista al Menú ---
    btnFFLoad.addEventListener('click', () => {
        if (ffList.length === 0) return;
        const count = ffList.length;
        ffList.forEach(item => addToMenu({
            name:    item.name,
            details: item.details,
            carbs:   item.carbs,
            rations: item.rations
        }));
        ffList = [];
        updateFFList();
        showToast(`✅ ${count} producto${count > 1 ? 's' : ''} cargado${count > 1 ? 's' : ''} al menú`, 'success');
        // Auto-switch to menu tab
        document.querySelector('.tab-btn[data-tab="menu"]')?.click();
    });

});
