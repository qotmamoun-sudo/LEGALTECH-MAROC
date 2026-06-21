document.addEventListener("DOMContentLoaded", () => {
    
    // --- GESTION DES ONGLETS ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId, element) {
        tabContents.forEach(t => t.classList.remove('active-section'));
        navItems.forEach(n => n.classList.remove('active'));
        document.getElementById(tabId).classList.add('active-section');
        if(element) element.classList.add('active');
        window.scrollTo(0,0);
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            showTab(this.getAttribute('data-target'), this);
        });
    });

    document.getElementById('btn-start').addEventListener('click', () => {
        showTab('tab-calc', navItems[1]);
    });

    // --- SIMULATEUR AVANCÉ (Code du Travail Marocain) ---
    document.getElementById('btn-calc').addEventListener('click', () => {
        const s = parseFloat(document.getElementById('salary').value);
        const y = parseFloat(document.getElementById('seniority').value);
        const h_days = parseFloat(document.getElementById('holidays').value) || 0;
        const r = document.getElementById('reason').value;
        const status = document.getElementById('status').value;
        const res = document.getElementById('res-calc');

        if(!s || !y) return alert("Veuillez remplir le salaire et l'ancienneté.");

        res.style.display = "block";
        
        // Calcul des congés payés (salaire journalier * jours)
        const dailySalary = s / 26; 
        const holidayPay = dailySalary * h_days;

        if(r === "demission") {
            // Seuls les congés payés sont dus en cas de démission
            res.innerHTML = `
                <span style="font-size: 0.6rem; color: var(--gold); letter-spacing: 2px;">RÉSULTAT DÉMISSION</span><br><br>
                <p>Aucune indemnité de licenciement n'est due.</p>
                <p>Indemnité compensatrice de congés payés : <strong>${Math.round(holidayPay).toLocaleString()} MAD</strong></p>
                <br><span style="font-size: 1.2rem; font-weight: 700;">TOTAL : ${Math.round(holidayPay).toLocaleString()} MAD</span>`;
        } else {
            // Calcul Licenciement abusif (Indemnité légale + Préavis + Congés + Dommages-intérêts)
            const hourlyRate = s / 191;
            
            // 1. Indemnité légale (Heures de salaire par année)
            let legalIndemnity = (y <= 5) ? (96*hourlyRate*y) : 
                                 (y <= 10) ? (96*hourlyRate*5 + 144*hourlyRate*(y-5)) : 
                                 (96*hourlyRate*5 + 144*hourlyRate*5 + 192*hourlyRate*(y-10));
            
            // 2. Préavis (dépend du statut et de l'ancienneté - Simplifié)
            let noticeMonths = 0;
            if(status === 'cadre') {
                noticeMonths = (y < 1) ? 1 : (y <= 5) ? 2 : 3;
            } else {
                noticeMonths = (y < 1) ? 0.25 : (y <= 5) ? 1 : 2;
            }
            const noticePay = s * noticeMonths;

            // 3. Dommages et intérêts (1.5 mois par année, plafonné à 36 mois)
            const damagesMonths = Math.min(y * 1.5, 36);
            const damagesPay = s * damagesMonths;

            const total = legalIndemnity + noticePay + damagesPay + holidayPay;

            res.innerHTML = `
                <span style="font-size: 0.6rem; color: var(--gold); letter-spacing: 2px;">AUDIT TERMINÉ</span><br><br>
                <div style="text-align: left; font-size: 0.8rem; margin-bottom: 15px; color: var(--slate);">
                    • Indemnité légale : ${Math.round(legalIndemnity).toLocaleString()} MAD<br>
                    • Préavis (${noticeMonths} mois) : ${Math.round(noticePay).toLocaleString()} MAD<br>
                    • Dommages & Intérêts : ${Math.round(damagesPay).toLocaleString()} MAD<br>
                    • Congés payés : ${Math.round(holidayPay).toLocaleString()} MAD
                </div>
                <span style="font-size: 1.5rem; font-weight: 700; color: var(--navy);">TOTAL ESTIMÉ : ${Math.round(total).toLocaleString()} MAD</span>`;
        }
    });

    // --- CONNEXION IA (Préparé pour Hugging Face API) ---
    document.getElementById('btn-advice').addEventListener('click', async () => {
        const question = document.getElementById('ai-question').value;
        const res = document.getElementById('res-advice');
        
        if(!question) return alert("Veuillez décrire la situation.");

        res.style.display = "block";
        res.innerHTML = "<i class='fas fa-spinner fa-spin' style='color: var(--gold);'></i> <em>Interrogation du modèle juridique...</em>";
        
        // --- C'est ici que vous intégrerez votre token Hugging Face ---
        /* 
        try {
            const response = await fetch("URL_DE_VOTRE_MODELE_HUGGINGFACE", {
                headers: { Authorization: "Bearer VOTRE_TOKEN" },
                method: "POST",
                body: JSON.stringify({ inputs: question }),
            });
            const result = await response.json();
            res.innerHTML = `<p style='text-align:justify;'><strong>Pré-Analyse de l'IA :</strong> ${result[0].generated_text}</p>`;
        } catch(err) {
            console.error("Erreur API :", err);
        }
        */

        // Simulation en attendant la connexion de l'API
        setTimeout(() => {
            res.innerHTML = "<p style='text-align:justify;'><strong>Pré-Analyse :</strong> Le respect de l'entretien préalable est un critère de validité majeur. Un manquement procédural (comme décrit dans votre situation) peut entraîner une requalification immédiate du départ par l'inspection du travail.</p>";
        }, 1500);
    });

    // --- GÉNÉRATION DE PDF PRO ---
    document.getElementById('btn-doc').addEventListener('click', () => {
        const n = document.getElementById('user-name').value;
        if(!n) return alert("Nom requis pour générer le document.");
        
        // On remplit le template caché
        document.getElementById('pdf-name').innerText = n.toUpperCase();
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('fr-FR');
        
        const template = document.getElementById('pdf-template');
        template.style.display = 'block'; // On le rend visible un instant pour html2pdf

        const opt = {
            margin:       1,
            filename:     `3ADALA_RAPPORT_${n.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Génère le PDF à partir du template formaté (et non de l'écran entier)
        html2pdf().set(opt).from(template).save().then(() => {
            template.style.display = 'none'; // On recache le template une fois généré
        });
    });

});
