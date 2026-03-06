﻿function naiveEmailCheck(email) {
    return /@/.test(email);
}

function setupValidation() {
    const form = document.getElementById('contactForm');
    const hp = document.getElementById('website');
    const email = document.getElementById('Email');
    const name = document.getElementById('Name');
    const msg = document.getElementById('Message');
    const status = document.getElementById('liveStatus');

    let validationErrors = [];

    const echo = (id, value) => {
        const errorElement = document.getElementById(id);
        errorElement.innerHTML = `<span>Probleem met: ${value}</span>`;
        errorElement.style.display = 'block';
    };

    const clearError = (id) => {
        const errorElement = document.getElementById(id);
        errorElement.innerHTML = '';
        errorElement.style.display = 'none';
    };

    [email, name, msg].forEach(el => {
        el.addEventListener('input', () => {
            validationErrors = [];

            if (el === email && el.value && !naiveEmailCheck(el.value)) {
                echo('emailErr', 'e-mailadres ongeldig');
                validationErrors.push('E-mailadres is ongeldig');
            } else if (el === email) {
                clearError('emailErr');
            }

            if (el === name && el.value.length < 2) {
                echo('nameErr', 'naam moet minimaal 2 tekens zijn');
                validationErrors.push('Naam moet minimaal 2 tekens zijn');
            } else if (el === name) {
                clearError('nameErr');
            }

            if (el === msg && el.value.length < 5) {
                echo('msgErr', 'bericht moet minimaal 5 tekens zijn');
                validationErrors.push('Bericht moet minimaal 5 tekens zijn');
            } else if (el === msg) {
                clearError('msgErr');
            }

            if (validationErrors.length > 0) {
                status.textContent = 'Validatiefouten: ' + validationErrors.join(', ');
            } else {
                status.textContent = 'Er is clientside validatie uitgevoerd';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        if (hp.value) {
            e.preventDefault();
            status.textContent = 'Spam gedetecteerd (client-side)!';
            alert('Spam gedetecteerd (client-side)!');
            return false;
        }

        return true;
    });
}

window.addEventListener('DOMContentLoaded', setupValidation);