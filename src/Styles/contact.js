window.onload = function() {
    generateBubbles();

    const form = document.getElementById("formContact");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("mail");

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validateInputs()) {
            const data = {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                user_email: email.value.trim(),
                message: document.getElementById("message").value.trim(),
                option: document.querySelector('input[name="option"]:checked').value
            };

            fetch('/submit', {
                method: "post",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(function(response) {
                return response.text();
            })
            .then(function(message) {
                alert(message);
            });
        }
    });

    function generateBubbles() {
        const bubbleContainer = document.getElementById('bubbleContainer');

        function createBubble() {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Math.random() * 0.2 + 10; // Bubble size between 10px and 60px
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            bubble.style.left = `${Math.random() * 100}vw`; // Random horizontal position
            bubble.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5s and 10s
            
            bubbleContainer.appendChild(bubble);
            
            // Remove the bubble after animation ends
            bubble.addEventListener('animationend', function() {
                bubbleContainer.removeChild(bubble);
            });
        }

        // Create bubbles at intervals
        setInterval(createBubble, 100); // Create a bubble every 100ms
    }

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = "";
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }

    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }

    const isValidEmail = email => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email));
    }

    const isValidName = name => {
        const re = /^[A-Z][a-z]*$/;
        return re.test(String(name));
    }

    const validateInputs = () => {
        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        let isValid = true;

        if (firstNameValue === '') {
            setError(firstName, '*First name is required');
            isValid = false;
        } else if (!isValidName(firstNameValue)) {
            setError(firstName, '*The name must start with a capital letter');
            isValid = false;
        } else {
            setSuccess(firstName);
        }

        if (lastNameValue === '') {
            setError(lastName, '*Last name is required');
            isValid = false;
        } else if (!isValidName(lastNameValue)) {
            setError(lastName, '*The name must start with a capital letter');
            isValid = false;
        } else {
            setSuccess(lastName);
        }

        if (emailValue === '') {
            setError(email, '*Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, '*Provide a valid email address');
            isValid = false;
        } else {
            setSuccess(email);
        }

        return isValid;
    }
};