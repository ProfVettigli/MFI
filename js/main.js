// main.js - Script globale per l'indice e le animazioni
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona tutte le card per l'animazione di apparizione
    const cards = document.querySelectorAll('.card');
    
    // Configura l'Intersection Observer per far comparire le card quando si scorre
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Smette di osservare la card una volta apparsa
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // La card appare quando almeno il 10% è visibile
    });

    cards.forEach((card, index) => {
        // Applica stili iniziali di partenza
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Calcola un piccolo ritardo sfalsato in base all'indice (fino ad un max)
        const delay = (index % 3) * 0.1; 
        card.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, box-shadow 0.3s ease, background 0.3s ease`;
        
        // Osserva la card
        observer.observe(card);
    });
});
