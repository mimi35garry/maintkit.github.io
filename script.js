document.addEventListener('DOMContentLoaded', function() {
    console.log('Bienvenue sur mon site web !');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
    sidebarToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    // Fermer avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // Gestion de la modale d'ajout d'équipement
    const addEquipBtn = document.getElementById('addEquipBtn');
    const equipModal = document.getElementById('equipModal');
    const closeModal = document.getElementById('closeModal');
    const equipForm = document.getElementById('equipForm');

    addEquipBtn.addEventListener('click', function() {
        equipModal.style.display = 'block';
    });
    closeModal.addEventListener('click', function() {
        equipModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
        if (e.target === equipModal) {
            equipModal.style.display = 'none';
        }
    });

    // Gestion de la liste des équipements
    const equipements = [];
    const equipTableBody = document.getElementById('equipTableBody');

    function renderEquipements() {
        equipTableBody.innerHTML = '';
        equipements.forEach((equip, idx) => {
            const tr = document.createElement('tr');
            if (equip.status === 'Inactif') {
                tr.style.opacity = '0.5';
            }
            tr.innerHTML = `
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;cursor:pointer;${equip.status === 'Inactif' ? 'text-decoration:line-through;' : ''}" class="equip-nom" data-idx="${idx}">${equip.nom}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;${equip.status === 'Inactif' ? 'text-decoration:line-through;' : ''}">${equip.reference}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;${equip.status === 'Inactif' ? 'text-decoration:line-through;' : ''}">${equip.type}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;${equip.status === 'Inactif' ? 'text-decoration:line-through;' : ''}">
                    ${equip.lien ? `<a href="${equip.lien}" target="_blank" rel="noopener" class="marque-link">${equip.marque}</a>` : equip.marque}
                </td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;text-align:center;">
                    <button class="delete-equip-btn" data-idx="${idx}" title="Supprimer" aria-label="Supprimer" style="background:none;border:none;cursor:pointer;font-size:1.2rem;color:#d32f2f;"><span class="delete-icon">🗑️</span></button>
                </td>
            `;
            equipTableBody.appendChild(tr);
        });
        // Ajout des listeners sur les noms
        document.querySelectorAll('.equip-nom').forEach(td => {
            td.addEventListener('click', function() {
                openEditEquipModal(parseInt(td.dataset.idx));
            });
        });
        // Ajout des listeners sur les boutons de suppression
        document.querySelectorAll('.delete-equip-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                if (confirm('Supprimer cet équipement ?')) {
                    equipements.splice(idx, 1);
                    renderEquipements();
                }
            });
        });
    }

    // Gestion de la modale d'édition
    const editEquipModal = document.getElementById('editEquipModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editEquipForm = document.getElementById('editEquipForm');
    let editEquipIndex = null;

    function openEditEquipModal(idx) {
        const equip = equipements[idx];
        editEquipIndex = idx;
        editEquipForm.nom.value = equip.nom;
        editEquipForm.reference.value = equip.reference;
        // Gestion du type : si le type n'est pas dans la liste, sélectionne "autre" et remplit le champ texte
        const typeOptions = Array.from(editEquipType.options).map(opt => opt.value);
        if (typeOptions.includes(equip.type)) {
            editEquipType.value = equip.type;
            editEquipTypeOther.style.display = 'none';
            editEquipTypeOther.required = false;
        } else {
            editEquipType.value = 'autre';
            editEquipTypeOther.style.display = '';
            editEquipTypeOther.required = true;
            editEquipTypeOther.value = equip.type;
        }
        editEquipForm.status.value = equip.status;
        editEquipForm.marque.value = equip.marque;
        editEquipForm.lien.value = equip.lien;
        editEquipModal.style.display = 'block';
    }
    closeEditModal.addEventListener('click', function() {
        editEquipModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
        if (e.target === editEquipModal) {
            editEquipModal.style.display = 'none';
        }
    });
    editEquipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let typeValue = editEquipForm.type.value;
        if (typeValue === 'autre') typeValue = editEquipForm.typeOther.value;
        if (editEquipIndex !== null) {
            equipements[editEquipIndex] = {
                nom: editEquipForm.nom.value,
                reference: editEquipForm.reference.value,
                type: typeValue,
                status: editEquipForm.status.value,
                marque: editEquipForm.marque.value,
                lien: editEquipForm.lien.value
            };
            renderEquipements();
            editEquipModal.style.display = 'none';
            editEquipTypeOther.style.display = 'none';
            editEquipTypeOther.required = false;
        }
    });

    // Gestion du champ type personnalisé (formulaire ajout)
    const equipType = document.getElementById('equipType');
    const equipTypeOther = document.getElementById('equipTypeOther');
    equipType.addEventListener('change', function() {
        if (equipType.value === 'autre') {
            equipTypeOther.style.display = '';
            equipTypeOther.required = true;
        } else {
            equipTypeOther.style.display = 'none';
            equipTypeOther.required = false;
        }
    });
    // Gestion du champ type personnalisé (formulaire édition)
    const editEquipType = document.getElementById('editEquipType');
    const editEquipTypeOther = document.getElementById('editEquipTypeOther');
    editEquipType.addEventListener('change', function() {
        if (editEquipType.value === 'autre') {
            editEquipTypeOther.style.display = '';
            editEquipTypeOther.required = true;
        } else {
            editEquipTypeOther.style.display = 'none';
            editEquipTypeOther.required = false;
        }
    });

    // Exemple d'équipement ajouté par défaut
    equipements.push({
        nom: 'Compresseur',
        reference: 'CMP-2025',
        type: 'Industriel',
        status: 'Actif',
        marque: 'Atlas Copco',
        lien: 'https://www.atlascopco.com/'
    });
    renderEquipements();
});
