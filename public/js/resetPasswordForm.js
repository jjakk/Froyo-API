window.addEventListener('load', () => {
    // Event listeners
    document.getElementById('passwordResetForm').addEventListener('submit', onSubmit);
});

const onSubmit = async (event) => {
    event.preventDefault();
    // DOM Elements
    let submitButton = document.querySelector('#passwordResetForm input[type="submit"]');
    let errorMessage = document.querySelector('#error');
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
    
    // Disable the submit button to prevent multiple requests
    const initialSubmitTitle = submitButton.value;
    submitButton.disabled = true;
    submitButton.style.opacity = 0.5;
    submitButton.value = 'loading';

    try {
        // query server
        const response = await fetch(`/auth/reset/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                confirmPassword
            })
        });
        const resText = await response.text();
        errorMessage.innerHTML = resText;
    }
    catch (err) {
        errorMessage.innerHTML = err.message;
    }
    finally {
        // Set button title to original text & re-enable button
        submitButton.disabled = false;
        submitButton.style.opacity = 1;
        submitButton.value = initialSubmitTitle;
    }
};
