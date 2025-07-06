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
        equipements.forEach(equip => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;">${equip.nom}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;">${equip.reference}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;">${equip.type}</td>
                <td style="padding:0.5rem 0.3rem;border-bottom:1px solid #eee;">${equip.status}</td>
            `;
            equipTableBody.appendChild(tr);
        });
    }

    equipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            nom: equipForm.nom.value,
            reference: equipForm.reference.value,
            type: equipForm.type.value,
            status: equipForm.status.value
        };
        equipements.push(data);
        renderEquipements();
        equipModal.style.display = 'none';
        equipForm.reset();
    });
});
