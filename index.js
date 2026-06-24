document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. BASE DE CONNAISSANCE (Système Expert) ---
    const legalKnowledgeBase = {
        "licenciement": {
            article: "Art. 61-65",
            keywords: ["procédure", "faute", "entretien", "lettre", "licenciement"],
            advice: "Le licenciement est strictement encadré par le Code du Travail. Vérifiez si vous avez reçu une convocation écrite et si la procédure de conciliation a été respectée."
        },
        "salaire": {
            article: "Art. 184",
            keywords: ["bulletin", "virement", "retard", "impayé", "salaire"],
            advice: "Le non-paiement est une infraction grave. Le Code du Travail impose un paiement régulier. Conservez vos bulletins de paie et relevés bancaires."
        },
        "contrat": {
            article: "Art. 19",
            keywords: ["avenant", "signature", "modification", "contrat"],
            advice: "Toute modification substantielle du contrat nécessite votre accord écrit. Une modification unilatérale peut être considérée comme une rupture abusive."
        }
    };

    // --- 2. GESTION DES ONGLETS ---
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

    document.getElementById('btn-start')?.addEventListener('click', () => {
        showTab('tab-calc', navItems[1]);
    });

    // --- 3. SIMULATEUR AVANCÉ ---
    document.getElementById('btn-calc')?.addEventListener('click', () => {
        const s = parseFloat(document.getElementById('salary').value);
        const y = parseFloat(document.getElementById('seniority').value);
        const h_days = parseFloat(document.getElementById('holidays').value) || 0;
        const r = document.getElementById('reason').value;
        const status = document.getElementById('status').value;
        const res = document.getElementById('res-calc');

        if(!s || !y) return alert("Veuillez remplir le salaire et l'ancienneté.");

        res.style.display = "block";
        const dailySalary = s / 26; 
        const holidayPay = dailySalary * h_days;

        if(r === "demission") {
            res.innerHTML = `<strong>TOTAL : ${Math.round(holidayPay).toLocaleString()} MAD</strong>`;
        } else {
            const hourlyRate = s / 191;
            let legalIndemnity = (y <= 5) ? (96*hourlyRate*y) : (y <= 10) ? (96*hourlyRate*5 + 144*hourlyRate*(y-5)) : (96*hourlyRate*5 + 144*hourlyRate*5 + 192*hourlyRate*(y-10));
            const noticeMonths = (status === 'cadre') ? ((y < 1) ? 1 : (y <= 5) ? 2 : 3) : ((y < 1) ? 0.25 : (y <= 5) ? 1 : 2);
            const noticePay = s * noticeMonths;
            const damagesPay = s * Math.min(y * 1.5, 36);
            const total = legalIndemnity + noticePay + damagesPay + holidayPay;

            res.innerHTML = `
                <div style="text-align: left; font-size: 0.8rem;">
                    • Indemnité légale : ${Math.round(legalIndemnity).toLocaleString()} MAD<br>
                    • Préavis : ${Math.round(noticePay).toLocaleString()} MAD<br>
                    • Dommages & Intérêts : ${Math.round(damagesPay).toLocaleString()} MAD
                </div>
                <br><strong>TOTAL : ${Math.round(total).toLocaleString()} MAD</strong>`;
        }
    });

    // --- 4. AUDIT IA (Moteur de règles intégré) ---
    document.getElementById('btn-advice')?.addEventListener('click', () => {
        const category = document.getElementById('ai-category').value;
        const details = document.getElementById('ai-question').value;
        const res = document.getElementById('res-advice');
        
        if(!details || details.length < 15) return alert("Veuillez fournir plus de détails sur votre situation.");

        res.style.display = "block";
        res.innerHTML = "<em>Analyse de conformité en cours...</em>";
        
        setTimeout(() => {
            const rule = legalKnowledgeBase[category];
            const foundKeywords = rule.keywords.filter(word => details.toLowerCase().includes(word));
            
            let output = `<strong>Diagnostic (${rule.article}) :</strong><br>${rule.advice}<br><br>`;
            output += foundKeywords.length > 0 ? `<em>Éléments détectés : ${foundKeywords.join(', ')}</em>` : "<em>Conseil : Assurez-vous d'inclure des détails précis sur vos preuves.</em>";
            
            res.innerHTML = output;
        }, 1200);
    });

    // --- 5. GÉNÉRATION DE PDF ---
    document.getElementById('btn-doc')?.addEventListener('click', () => {
        const n = document.getElementById('user-name').value;
        if(!n) return alert("Nom requis.");
        document.getElementById('pdf-name').innerText = n.toUpperCase();
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('fr-FR');
        const template = document.getElementById('pdf-template');
        template.style.display = 'block';
        html2pdf().from(template).save().then(() => { template.style.display = 'none'; });
    });
});
