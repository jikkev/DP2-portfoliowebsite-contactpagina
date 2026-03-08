function naiveEmailCheck(email) {
    return /@/.test(email);
}

function setupValidation() {
    const form = document.getElementById('contactForm');
    const hp = document.getElementById('website');
    const email = document.getElementById('Email');
    const name = document.getElementById('Name');
    const subject = document.getElementById('Subject');
    const msg = document.getElementById('Message');
    const status = document.getElementById('liveStatus');

    let validationErrors = [];
    let isSubmitting = false;

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

    [email, name, subject, msg].forEach(el => {
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

            if (el === subject && el.value.length < 2) {
                echo('subjectErr', 'onderwerp moet minimaal 2 tekens zijn');
                validationErrors.push('Onderwerp moet minimaal 2 tekens zijn');
            } else if (el === subject) {
                clearError('subjectErr');
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
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }

        if (hp.value) {
            e.preventDefault();
            status.textContent = 'Spam gedetecteerd (client-side)!';
            alert('Spam gedetecteerd (client-side)!');
            return false;
        }

        
        let hasErrors = false;
        
        if (!name.value || name.value.trim().length < 2) {
            echo('nameErr', 'naam moet minimaal 2 tekens zijn');
            hasErrors = true;
        } else {
            clearError('nameErr');
        }

        if (!email.value || !naiveEmailCheck(email.value)) {
            echo('emailErr', 'e-mailadres is verplicht en moet geldig zijn');
            hasErrors = true;
        } else {
            clearError('emailErr');
        }

        if (!subject.value || subject.value.trim().length < 2) {
            echo('subjectErr', 'onderwerp moet minimaal 2 tekens zijn');
            hasErrors = true;
        } else {
            clearError('subjectErr');
        }

        if (!msg.value || msg.value.trim().length < 5) {
            echo('msgErr', 'bericht moet minimaal 5 tekens zijn');
            hasErrors = true;
        } else {
            clearError('msgErr');
        }

        if (hasErrors) {
            e.preventDefault();
            status.textContent = 'Validatiefouten aanwezig';
            return false;
        }
        
        isSubmitting = true;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Verzenden...';

        return true;
    });
}

window.addEventListener('DOMContentLoaded', setupValidation);