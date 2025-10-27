// Navegação responsiva
function toggleMenu() {
	const menu = document.getElementById('navMenu');
	const btn = document.querySelector('.menu-toggle');
	if (!menu) return;
	menu.classList.toggle('open');
	if (btn) {
		const expanded = btn.getAttribute('aria-expanded') === 'true';
		btn.setAttribute('aria-expanded', String(!expanded));
	}
}

// Fechar menu ao clicar em um link (mobile)
document.addEventListener('DOMContentLoaded', () => {
	const menu = document.getElementById('navMenu');
	if (menu) {
		menu.addEventListener('click', (e) => {
			const target = e.target;
			if (target.tagName === 'A' && menu.classList.contains('open')) {
				menu.classList.remove('open');
			}
		});
	}

	// Máscara simples para telefone
	const tel = document.getElementById('telefone');
	if (tel) {
		tel.addEventListener('input', () => {
			let v = tel.value.replace(/\D/g, '');
			if (v.length > 11) v = v.slice(0, 11);
			if (v.length > 6) {
				tel.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
			} else if (v.length > 2) {
				tel.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
			} else if (v.length > 0) {
				tel.value = `(${v}`;
			}
		});
	}

	// Auto-scroll para a galeria (somente na página que possui .gallery)
	const gallerySection = document.querySelector('.gallery');
	if (gallerySection) {
		// Evita autoscroll se o usuário já rolou manualmente nos primeiros 3 segundos
		let userScrolled = false;
		const onWheel = () => { userScrolled = true; window.removeEventListener('wheel', onWheel, { passive: true }); };
		window.addEventListener('wheel', onWheel, { passive: true });

		setTimeout(() => {
			if (userScrolled) return;
			const header = document.querySelector('header');
			const headerH = header ? header.offsetHeight : 0;
			const y = gallerySection.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}, 900);
	}

		// Botão de voltar ao topo (funciona em todas as páginas)
		const backBtn = document.createElement('button');
		backBtn.className = 'back-to-top';
		backBtn.type = 'button';
		backBtn.title = 'Voltar ao topo';
		backBtn.setAttribute('aria-label', 'Voltar ao topo');
		backBtn.innerHTML = '↑';
		document.body.appendChild(backBtn);

		const toggleBackBtn = () => {
			const threshold = 300;
			if (window.scrollY > threshold) backBtn.classList.add('show');
			else backBtn.classList.remove('show');
		};
		toggleBackBtn();

		window.addEventListener('scroll', toggleBackBtn, { passive: true });
		backBtn.addEventListener('click', () => {
			const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (prefersReduced) {
				window.scrollTo(0, 0);
			} else {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
			backBtn.blur();
		});

		// Renderização da página de inscrições
		const app = document.getElementById('volunteersApp');
		if (app) {
			const searchInput = document.getElementById('searchInput');
			const filterArea = document.getElementById('filterArea');
			const filterDisp = document.getElementById('filterDisp');

			const populateFilters = () => {
				const items = getVolunteers();
				const areas = [...new Set(items.map(v => v.areaInteresse).filter(Boolean))].sort();
				const disps = [...new Set(items.map(v => v.disponibilidade).filter(Boolean))].sort();
				filterArea.innerHTML = '<option value="">Todas as áreas</option>' + areas.map(a => `<option value="${a}">${a}</option>`).join('');
				filterDisp.innerHTML = '<option value="">Todas as disponibilidades</option>' + disps.map(d => `<option value="${d}">${d}</option>`).join('');
			};

			populateFilters();

			const reRender = () => renderVolunteers({
				q: searchInput.value.trim().toLowerCase(),
				area: filterArea.value,
				disp: filterDisp.value
			});

			searchInput.addEventListener('input', reRender);
			filterArea.addEventListener('change', reRender);
			filterDisp.addEventListener('change', reRender);

			renderVolunteers();
		}
});

// Envio do formulário com feedback
const STORAGE_KEY = 'volunteerSubmissions';

function getVolunteers() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch (e) {
		console.warn('LocalStorage indisponível ou dados inválidos.', e);
		return [];
	}
}

function saveVolunteer(entry) {
	try {
		const list = getVolunteers();
		list.push(entry);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	} catch (e) {
		console.error('Falha ao salvar no LocalStorage:', e);
	}
}

function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;
	if (!form.checkValidity()) {
		form.reportValidity();
		return false;
	}

		// Coleta dos dados do formulário
		const data = {
			nome: form.nome?.value?.trim() || '',
			email: form.email?.value?.trim() || '',
			telefone: form.telefone?.value?.trim() || '',
			idade: form.idade?.value ? Number(form.idade.value) : null,
			disponibilidade: form.disponibilidade?.value || '',
			areaInteresse: form['area-interesse']?.value || '',
			experiencia: form.experiencia?.value?.trim() || '',
			motivacao: form.motivacao?.value?.trim() || '',
			criadoEm: new Date().toISOString()
		};

		saveVolunteer(data);

		const success = document.getElementById('successMessage');
	if (success) {
		success.style.display = 'block';
		success.setAttribute('role', 'status');
	}
	form.reset();

	// Opcional: esconder mensagem após alguns segundos
	setTimeout(() => {
		if (success) success.style.display = 'none';
	}, 6000);

	return false;
}

// Exportar dados para CSV
function downloadCSV() {
	const items = getVolunteers();
	if (!items.length) {
		alert('Não há cadastros para exportar.');
		return;
	}
	const headers = ['Nome','E-mail','Telefone','Idade','Disponibilidade','Área de Interesse','Experiência','Motivação','Criado Em'];
	const rows = items.map(v => [
		v.nome, v.email, v.telefone, v.idade ?? '', v.disponibilidade, v.areaInteresse, v.experiencia, v.motivacao, v.criadoEm
	]);

	const escapeCSV = (val) => {
		const s = (val ?? '').toString();
		if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
		return s;
	};

	const csv = [headers, ...rows].map(r => r.map(escapeCSV).join(';')).join('\n');
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'cadastros-voluntarios.csv';
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

// Limpar cadastros salvos
function clearVolunteers() {
	const ok = confirm('Tem certeza que deseja apagar todos os cadastros salvos neste navegador?');
	if (!ok) return;
	try {
		localStorage.removeItem(STORAGE_KEY);
		alert('Cadastros apagados.');
	} catch (e) {
		console.error('Falha ao limpar cadastros:', e);
	}
}

// Renderização da tabela de voluntários
function renderVolunteers(filters = {}) {
	const tbody = document.getElementById('volunteersTbody');
	const count = document.getElementById('count');
	if (!tbody) return;
	const items = getVolunteers();
	let list = items.slice();
	const q = (filters.q || '').toLowerCase();
	const area = filters.area || '';
	const disp = filters.disp || '';
	if (q) {
		list = list.filter(v =>
			(v.nome || '').toLowerCase().includes(q) ||
			(v.email || '').toLowerCase().includes(q) ||
			(v.telefone || '').toLowerCase().includes(q)
		);
	}
	if (area) list = list.filter(v => v.areaInteresse === area);
	if (disp) list = list.filter(v => v.disponibilidade === disp);

	if (!list.length) {
		tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Nenhum cadastro encontrado.</td></tr>';
		if (count) count.textContent = '0 cadastro(s) encontrado(s).';
		return;
	}

	const rows = list.map(v => `
		<tr>
			<td>${escapeHTML(v.nome)}</td>
			<td>${escapeHTML(v.email)}</td>
			<td>${escapeHTML(v.telefone)}</td>
			<td>${v.idade ?? ''}</td>
			<td>${escapeHTML(v.disponibilidade)}</td>
			<td>${escapeHTML(v.areaInteresse)}</td>
			<td>${escapeHTML(v.experiencia)}</td>
			<td>${escapeHTML(v.motivacao)}</td>
			<td>${formatDateTime(v.criadoEm)}</td>
		</tr>
	`).join('');
	tbody.innerHTML = rows;
	if (count) count.textContent = `${list.length} cadastro(s) encontrado(s).`;
}

function escapeHTML(str) {
	return (str ?? '').toString()
		.replaceAll('&','&amp;')
		.replaceAll('<','&lt;')
		.replaceAll('>','&gt;')
		.replaceAll('"','&quot;')
		.replaceAll("'",'&#39;');
}

function formatDateTime(iso) {
	try {
		const d = new Date(iso);
		if (isNaN(d)) return iso || '';
		return d.toLocaleString();
	} catch { return iso || ''; }
}

