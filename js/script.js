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
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const authModal = document.getElementById('auth-modal');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authToggleMode = document.getElementById('auth-toggle-mode');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authNameField = document.getElementById('auth-name-field');
    const authForm = document.getElementById('auth-form');
    const authName = document.getElementById('auth-name');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const userAvatar = document.querySelector('.user-avatar');
    const userNameEl = document.querySelector('.user-meta strong');
    const appShell = document.querySelector('.app-shell');
    const ffSelect = document.getElementById('fastfood-select');
    const menuCountBadge = document.getElementById('menu-count-badge');
    const menuListEl = document.getElementById('menu-list');
    const menuTotalRations = document.getElementById('menu-total-rations');
    const menuTotalCarbs = document.getElementById('menu-total-carbs');
    const btnClearMenu = document.getElementById('btn-clear-menu');
    const btnSaveMenu = document.getElementById('btn-save-menu');
    const graphWeekSelect = document.getElementById('graph-week-select');
    const chartBarsEl = document.getElementById('chart-bars');
    const chartTotalEl = document.getElementById('chart-total');
    const chartAverageEl = document.getElementById('chart-average');
    const dailySummaryDate = document.getElementById('daily-summary-date');
    const dailySummaryRations = document.getElementById('daily-summary-rations');
    const dailySummaryCarbs = document.getElementById('daily-summary-carbs');
    const dailySummaryList = document.getElementById('daily-summary-list');

    let mealList = [];
    let ffList = [];
    let currentWeeklyData = {};

    const THEME_COLORS = { dark: '#0d0f1a', light: '#f0f2f7' };

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const thumb = themeBtn ? themeBtn.querySelector('.toggle-thumb') : null;
        if (thumb) thumb.textContent = theme === 'dark' ? '🌙' : '☀️';
        if (metaTheme) metaTheme.setAttribute('content', THEME_COLORS[theme]);
    }

    function getStoredUser() {
        try {
            return JSON.parse(sessionStorage.getItem('glucare-session') || 'null');
        } catch {
            return null;
        }
    }

    function setSessionUser(user) {
        if (!user) {
            sessionStorage.removeItem('glucare-session');
            return;
        }
        sessionStorage.setItem('glucare-session', JSON.stringify(user));
    }

    function clearSessionUser() {
        sessionStorage.removeItem('glucare-session');
    }

    function getUsersRegistry() {
        try {
            const raw = localStorage.getItem('glucare-users');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function getUserKey(user) {
        const email = (user && user.email ? user.email.trim().toLowerCase() : '').replace(/\s+/g, '');
        if (email) return email;
        const name = (user && user.name ? user.name.trim() : '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return name || 'usuario-anonimo';
    }

    function saveUser(user) {
        const safeUser = {
            ...(user || {}),
            email: (user && user.email ? user.email.trim() : '').toLowerCase(),
            name: (user && user.name ? user.name.trim() : ''),
            provider: user && user.provider ? user.provider : 'local'
        };

        const users = getUsersRegistry();
        const key = getUserKey(safeUser);
        const existing = users[key] || {};
        const mergedUser = {
            ...existing,
            ...safeUser,
            data: {
                ...getDefaultUserData(),
                ...(existing.data || {}),
                ...(safeUser.data || {})
            }
        };

        users[key] = mergedUser;
        localStorage.setItem('glucare-users', JSON.stringify(users));
        setSessionUser(mergedUser);
    }

    function clearUser() {
        clearSessionUser();
    }

    function findUserByCredentials(email, password) {
        const users = getUsersRegistry();
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedPassword = String(password || '');

        for (const key in users) {
            const user = users[key];
            if ((user.email || '').trim().toLowerCase() === normalizedEmail && String(user.password || '') === normalizedPassword) {
                return user;
            }
        }

        return null;
    }

    function getDefaultUserData() {
        return {
            menu: [],
            ffList: [],
            weeklyData: {}
        };
    }

    function getCurrentUserData() {
        const user = getStoredUser();
        if (!user) return getDefaultUserData();

        const registry = getUsersRegistry();
        const key = getUserKey(user);
        const saved = registry[key] || {};

        return {
            ...getDefaultUserData(),
            ...(saved.data || {})
        };
    }

    function loadCurrentUserData(user) {
        const registry = getUsersRegistry();
        const key = getUserKey(user);
        const saved = registry[key] || user || {};
        const data = {
            ...getDefaultUserData(),
            ...(saved.data || {})
        };

        mealList = Array.isArray(data.menu) ? data.menu : [];
        ffList = Array.isArray(data.ffList) ? data.ffList : [];
        currentWeeklyData = data.weeklyData && typeof data.weeklyData === 'object' ? data.weeklyData : {};

        if (typeof updateMenuUI === 'function') updateMenuUI();
        if (typeof updateFFList === 'function') updateFFList();
        if (typeof renderWeekChart === 'function') renderWeekChart(graphWeekSelect ? graphWeekSelect.value : 'current');

        const activeUser = { ...user, data };
        setSessionUser(activeUser);
        registry[key] = { ...registry[key], ...activeUser };
        localStorage.setItem('glucare-users', JSON.stringify(registry));
    }

    function persistCurrentUserData() {
        const user = getStoredUser();
        if (!user) return;

        const registry = getUsersRegistry();
        const key = getUserKey(user);
        const data = {
            menu: mealList,
            ffList,
            weeklyData: currentWeeklyData || {}
        };

        const updatedUser = {
            ...user,
            data
        };

        registry[key] = {
            ...(registry[key] || {}),
            ...updatedUser
        };

        localStorage.setItem('glucare-users', JSON.stringify(registry));
        setSessionUser(updatedUser);
    }

    function syncAuthButton(user) {
        if (!loginBtn) return;
        loginBtn.style.display = user ? 'none' : 'inline-flex';
    }

    function updateUserUI(user) {
        syncAuthButton(user);

        if (!userAvatar || !userNameEl) return;

        if (!user) {
            userAvatar.textContent = 'US';
            userNameEl.textContent = 'Usuario';
            return;
        }

        const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();
        userAvatar.textContent = initial;
        userNameEl.textContent = user.name || user.email.split('@')[0];
    }

    function setAuthMode(mode) {
        const isRegister = mode === 'register';
        authTitle.textContent = isRegister ? 'Crear cuenta' : 'Inicia sesión';
        authSubmitBtn.textContent = isRegister ? 'Registrarse' : 'Entrar';
        authToggleMode.textContent = isRegister ? 'Inicia sesión' : 'Regístrate';
        authSwitchText.textContent = isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?';
        authNameField.classList.toggle('hidden', !isRegister);
        authName.required = isRegister;
    }

    function openAuthModal() {
        authModal.classList.remove('hidden');
        authModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-logged-out');
        if (appShell) appShell.setAttribute('aria-disabled', 'true');
    }

    function closeAuthModal() {
        if (!getStoredUser()) {
            return;
        }
        authModal.classList.add('hidden');
        authModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-logged-out');
        if (appShell) appShell.setAttribute('aria-disabled', 'false');
    }

    function sanitizeDemoAccounts() {
        const users = getUsersRegistry();
        let changed = false;

        Object.keys(users).forEach(key => {
            const user = users[key];
            const email = String(user.email || '').toLowerCase();
            const name = String(user.name || '').toLowerCase();
            const demoLike = email.includes('google@usuario.com') || email.includes('usuario@gmail.com') || name.includes('usuario google') || name.includes('ana garcia');
            if (demoLike) {
                delete users[key];
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem('glucare-users', JSON.stringify(users));
        }
    }

    function ensureAuthGate() {
        const user = getStoredUser();
        if (!user) {
            setAuthMode('login');
            openAuthModal();
            return false;
        }

        loadCurrentUserData(user);
        updateUserUI(user);
        closeAuthModal();
        return true;
    }

    sanitizeDemoAccounts();

    themeBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    loginBtn.addEventListener('click', () => {
        setAuthMode('login');
        openAuthModal();
    });

    logoutBtn.addEventListener('click', () => {
        clearUser();
        updateUserUI(null);
        setAuthMode('login');
        authForm.reset();
        authModal.classList.remove('hidden');
        authModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-logged-out');
        if (appShell) appShell.setAttribute('aria-disabled', 'true');
        showToast('✅ Sesión cerrada', 'success');
    });

    document.querySelectorAll('[data-close-auth="true"]').forEach(el => {
        el.addEventListener('click', () => {
            if (getStoredUser()) {
                closeAuthModal();
            }
        });
    });

    authToggleMode.addEventListener('click', () => {
        const currentMode = authTitle.textContent === 'Crear cuenta' ? 'register' : 'login';
        setAuthMode(currentMode === 'register' ? 'login' : 'register');
    });

    authForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameValue = authName.value.trim();
        const emailValue = authEmail.value.trim();
        const passwordValue = authPassword.value.trim();

        if (!emailValue || !passwordValue) {
            showToast('⚠️ Completa correo y contraseña', 'error');
            return;
        }

        const isRegisterMode = authTitle.textContent === 'Crear cuenta';

        if (isRegisterMode) {
            if (!nameValue) {
                showToast('⚠️ Escribe tu nombre para registrarte', 'error');
                return;
            }

            const registry = getUsersRegistry();
            const existingSaved = registry[getUserKey({ email: emailValue, name: nameValue })] || null;
            const user = {
                name: nameValue,
                email: emailValue,
                password: passwordValue,
                provider: 'local',
                data: {
                    ...getDefaultUserData(),
                    ...(existingSaved?.data || {})
                }
            };

            saveUser(user);
            loadCurrentUserData(user);
            updateUserUI(user);
            showToast('✅ Cuenta creada correctamente', 'success');
            closeAuthModal();
            authForm.reset();
            return;
        }

        const existingUser = findUserByCredentials(emailValue, passwordValue);
        if (!existingUser) {
            showToast('⚠️ Correo o contraseña incorrectos', 'error');
            return;
        }

        setSessionUser(existingUser);
        loadCurrentUserData(existingUser);
        updateUserUI(existingUser);
        showToast('✅ Sesión iniciada con éxito', 'success');
        closeAuthModal();
        authForm.reset();
    });

    document.querySelector('.auth-google').addEventListener('click', () => {
        const registry = getUsersRegistry();
        const savedGoogleUser = Object.values(registry).find(user => user.provider === 'google');

        const safeName = (savedGoogleUser?.name || 'Usuario Google').trim();
        const safeEmail = (savedGoogleUser?.email || `${safeName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`).trim().toLowerCase();

        const googleUser = {
            name: safeName,
            email: safeEmail,
            password: 'google-auth',
            provider: 'google',
            data: {
                ...getDefaultUserData(),
                ...(savedGoogleUser?.data || {})
            }
        };

        saveUser(googleUser);
        setSessionUser(googleUser);
        loadCurrentUserData(googleUser);
        updateUserUI(googleUser);
        showToast(`✅ Hola ${safeName}, has iniciado sesión con Google`, 'success');
        closeAuthModal();
    });

    // Load saved or system preference
    const saved = localStorage.getItem('theme');
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(preferred);
    ensureAuthGate();

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
    function addToMenu(item) {
        mealList.push(item);
        persistCurrentUserData();
        updateMenuUI();
        const badgeBtn = document.querySelector('.tab-btn[data-tab="menu"]');
        badgeBtn.classList.add('pulse');
        setTimeout(() => badgeBtn.classList.remove('pulse'), 350);
        showToast(`✅ ${item.name} añadido al menú`, 'success');
    }

    function removeFromMenu(index) {
        mealList.splice(index, 1);
        persistCurrentUserData();
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
        persistCurrentUserData();
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
    let currentFF = null;

    const ffCalculator = document.getElementById('fastfood-calculator');
    const ffNameEl = document.getElementById('ff-name');
    const ffBrandEl = document.getElementById('ff-brand');
    const ffInput = document.getElementById('ff-input');
    const ffResultRations = document.getElementById('ff-result-rations');
    const ffResultCarbs = document.getElementById('ff-result-carbs');
    const ffComponents = document.getElementById('ff-components');
    const ffCompList = document.getElementById('ff-components-list');
    const btnFFAccept = document.getElementById('btn-ff-accept');
    const btnFFReject = document.getElementById('btn-ff-reject');
    const ffListEl = document.getElementById('ff-list');
    const ffListBadge = document.getElementById('ff-list-badge');
    const ffListActions = document.getElementById('ff-list-actions');
    const btnFFClear = document.getElementById('btn-ff-clear-list');
    const btnFFLoad = document.getElementById('btn-ff-load-menu');

    // --- Select change: show calculator ---
    ffSelect.addEventListener('change', () => {
        const id = ffSelect.value;
        if (!id) { ffCalculator.classList.add('hidden'); currentFF = null; return; }

        currentFF = fastFoods.find(f => String(f.id) === String(id));
        if (!currentFF) return;

        ffNameEl.textContent = currentFF.name;
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
        ffResultCarbs.textContent = `${totalCarbs.toFixed(1)}g`;
        ffResultRations.textContent = rations.toFixed(1);
    }

    ffInput.addEventListener('input', calcFF);
    ffCompList.addEventListener('change', calcFF);

    // --- ✓ Accept: add to ffList ---
    btnFFAccept.addEventListener('click', () => {
        if (!currentFF) return;
        const qty = Math.max(1, parseInt(ffInput.value) || 1);
        const carbs = parseFloat(ffResultCarbs.textContent) || 0;
        const rations = parseFloat(ffResultRations.textContent) || 0;

        // Collect selected components for label
        const selected = [];
        ffCompList.querySelectorAll('input[type="checkbox"]').forEach((chk, i) => {
            if (chk.checked) selected.push(currentFF.components[i].name);
        });

        ffList.push({
            id: Date.now(),
            name: `${currentFF.brand} — ${currentFF.name}`,
            details: `${qty} ud · ${selected.join(', ')}`,
            carbs,
            rations
        });

        persistCurrentUserData();
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
                persistCurrentUserData();
                updateFFList();
                showToast('🗑️ Producto eliminado', 'info');
            });
        });

        ffListActions.classList.remove('hidden');
    }

    // --- Borrar lista ---
    btnFFClear.addEventListener('click', () => {
        ffList = [];
        persistCurrentUserData();
        updateFFList();
        showToast('🗑️ Lista borrada', 'info');
    });

    // --- Cargar lista al Menú ---
    btnFFLoad.addEventListener('click', () => {
        if (ffList.length === 0) return;
        const count = ffList.length;
        ffList.forEach(item => addToMenu({
            name: item.name,
            details: item.details,
            carbs: item.carbs,
            rations: item.rations
        }));
        ffList = [];
        persistCurrentUserData();
        updateFFList();
        showToast(`✅ ${count} producto${count > 1 ? 's' : ''} cargado${count > 1 ? 's' : ''} al menú`, 'success');
        // Auto-switch to menu tab
        document.querySelector('.tab-btn[data-tab="menu"]')?.click();
    });

    // ============================================================
    //  WEEKLY CHART (empty by default until real data exists)
    // ============================================================
    const weekLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    function getSelectedWeekKey() {
        return graphWeekSelect ? graphWeekSelect.value : 'current';
    }

    function getTodayDayIndex() {
        const todayIndex = new Date().getDay();
        return todayIndex === 0 ? 6 : todayIndex - 1;
    }

    function renderDailySummary(weekKey) {
        if (!dailySummaryList) return;

        const storedData = getStoredWeeklyData();
        const entries = Array.isArray(storedData[`${weekKey}-entries`]) ? storedData[`${weekKey}-entries`] : [];
        const todayKey = new Date().toISOString().slice(0, 10);
        const entry = entries.find(item => item.dayKey === todayKey) || null;

        if (!entry) {
            dailySummaryList.innerHTML = '<div class="daily-summary-empty">Todavía no has guardado un menú para este día.</div>';
            if (dailySummaryDate) dailySummaryDate.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            if (dailySummaryRations) dailySummaryRations.textContent = '0.0';
            if (dailySummaryCarbs) dailySummaryCarbs.textContent = '0g';
            return;
        }

        const meals = Array.isArray(entry.items) ? entry.items : [];
        if (dailySummaryDate) dailySummaryDate.textContent = entry.dateLabel || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        if (dailySummaryRations) dailySummaryRations.textContent = Number(entry.totalRations || 0).toFixed(1);
        if (dailySummaryCarbs) dailySummaryCarbs.textContent = `${Number(entry.totalCarbs || 0).toFixed(1)}g`;

        dailySummaryList.innerHTML = meals.length
            ? meals.map(item => `
                <div class="daily-summary-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.details} · ${item.time || entry.hour || '—'}</p>
                    </div>
                    <div class="meal-stats">
                        <span>${Number(item.rations || 0).toFixed(1)} R</span>
                        <span>${Number(item.carbs || 0).toFixed(1)}g HC</span>
                    </div>
                </div>
            `).join('')
            : '<div class="daily-summary-empty">Todavía no hay comidas guardadas.</div>';
    }

    function getStoredWeeklyData() {
        const user = getStoredUser();
        if (!user) return {};

        const registry = getUsersRegistry();
        const key = getUserKey(user);
        const saved = registry[key] || {};
        const data = saved.data || {};

        return data.weeklyData && typeof data.weeklyData === 'object' ? data.weeklyData : {};
    }

    function saveCurrentWeeklyData(data) {
        const user = getStoredUser();
        if (!user) return;

        const registry = getUsersRegistry();
        const key = getUserKey(user);
        const existing = registry[key] || {};
        const updated = {
            ...existing,
            ...user,
            data: {
                ...getDefaultUserData(),
                ...(existing.data || {}),
                ...(user.data || {}),
                weeklyData: data
            }
        };

        registry[key] = updated;
        localStorage.setItem('glucare-users', JSON.stringify(registry));
        localStorage.setItem('glucare-user', JSON.stringify({ ...user, data: updated.data }));
        currentWeeklyData = data;
    }

    function renderWeekChart(key) {
        const storedData = getStoredWeeklyData();
        const values = Array.isArray(storedData[key]) ? storedData[key] : [];

        if (!values.length) {
            chartTotalEl.textContent = '0.0';
            chartAverageEl.textContent = '0.0';
            chartBarsEl.innerHTML = '<div class="chart-empty">Todavía no hay datos<br><small>Cuando registres información real aparecerá aquí.</small></div>';
            renderDailySummary(key);
            return;
        }

        const normalized = values.slice(0, 7).map(value => Number(value) || 0);
        const total = normalized.reduce((sum, value) => sum + value, 0);
        const average = total / normalized.length;

        chartTotalEl.textContent = total.toFixed(1);
        chartAverageEl.textContent = average.toFixed(1);

        chartBarsEl.innerHTML = normalized.map((value, index) => {
            const height = Math.max((value / Math.max(7, Math.max(...normalized))) * 100, 10);
            return `
                <div class="bar-column">
                    <div class="bar-stack">
                        <span class="bar-target" style="height: 100%"></span>
                        <span class="bar-value" style="height: ${height}%" title="${value.toFixed(1)} raciones"></span>
                    </div>
                    <span class="bar-label">${weekLabels[index]}</span>
                </div>
            `;
        }).join('');

        renderDailySummary(key);
    }

    function saveMenuToChart() {
        if (!mealList.length) {
            showToast('⚠️ Primero añade alimentos al menú', 'error');
            return;
        }

        const weekKey = getSelectedWeekKey();
        const storedData = getStoredWeeklyData();
        const weekValues = Array.isArray(storedData[weekKey]) ? [...storedData[weekKey]] : Array(7).fill(0);
        while (weekValues.length < 7) weekValues.push(0);

        const now = new Date();
        const dayIndex = getTodayDayIndex();
        const totalCarbs = mealList.reduce((sum, item) => sum + Number(item.carbs || 0), 0);
        const totalRations = mealList.reduce((sum, item) => sum + Number(item.rations || 0), 0);
        const dayKey = now.toISOString().slice(0, 10);
        const dateLabel = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        const hour = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        weekValues[dayIndex] = Number(totalRations.toFixed(1));
        storedData[weekKey] = weekValues;

        const entries = Array.isArray(storedData[`${weekKey}-entries`]) ? [...storedData[`${weekKey}-entries`]] : [];
        const filteredEntries = entries.filter(item => item.dayKey !== dayKey);
        filteredEntries.push({
            dayKey,
            dateLabel,
            hour,
            totalRations: Number(totalRations.toFixed(1)),
            totalCarbs: Number(totalCarbs.toFixed(1)),
            items: mealList.map(item => ({
                name: item.name,
                details: item.details,
                carbs: Number(item.carbs || 0),
                rations: Number(item.rations || 0),
                time: hour
            }))
        });
        storedData[`${weekKey}-entries`] = filteredEntries;

        saveCurrentWeeklyData(storedData);
        mealList = [];
        persistCurrentUserData();
        updateMenuUI();
        renderWeekChart(weekKey);
        showToast('✅ Menú guardado en el gráfico', 'success');
    }

    if (btnSaveMenu) {
        btnSaveMenu.addEventListener('click', saveMenuToChart);
    }

    if (graphWeekSelect) {
        graphWeekSelect.addEventListener('change', (event) => {
            renderWeekChart(event.target.value);
        });
        renderWeekChart(graphWeekSelect.value);
    }

});
