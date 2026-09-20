/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");


menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});



/* =========================================
   CLOSE MOBILE MENU AFTER CLICKING LINK
========================================= */

const navigationLinks =
    document.querySelectorAll(".nav-links a");


navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});



/* =========================================
   CONTACT FORM VALIDATION
========================================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();


    const email =
        document.getElementById("email").value.trim();


    const message =
        document.getElementById("message").value.trim();


    const nameError =
        document.getElementById("nameError");


    const emailError =
        document.getElementById("emailError");


    const messageError =
        document.getElementById("messageError");


    const formMessage =
        document.getElementById("formMessage");


    // Clear previous errors

    nameError.textContent = "";

    emailError.textContent = "";

    messageError.textContent = "";

    formMessage.textContent = "";


    let isValid = true;



    /* NAME VALIDATION */

    if (name === "") {

        nameError.textContent =
            "Please enter your name.";

        isValid = false;

    }


    /* EMAIL VALIDATION */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email === "") {

        emailError.textContent =
            "Please enter your email.";

        isValid = false;

    }

    else if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        isValid = false;

    }



    /* MESSAGE VALIDATION */

    if (message === "") {

        messageError.textContent =
            "Please enter your message.";

        isValid = false;

    }

    else if (message.length < 10) {

        messageError.textContent =
            "Message should contain at least 10 characters.";

        isValid = false;

    }



    /* SUCCESS */

    if (isValid) {

        formMessage.textContent =
            "Message validated successfully!";

        formMessage.style.color = "#16a34a";

        contactForm.reset();

    }

});



/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach((element) => {

    observer.observe(element);

});



/* =========================================
   CURRENT YEAR
========================================= */

const yearElement =
    document.getElementById("year");


yearElement.textContent =
    new Date().getFullYear();