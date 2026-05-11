/**
 * clil-linus-torvalds.js
 * Quiz for CLIL lesson about Linus Torvalds
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- QUIZ (5 questions) --- */
    const quizData = [
        {
            q: "1. What is the fundamental difference between Linus Torvalds and figures like Steve Jobs or Bill Gates?",
            a: ["Linus is a marketer who focused heavily on selling his operating system.", "Jobs and Gates were visionary businessmen building corporate monopolies, while Linus is a practical engineer who writes code 'just for fun' and gives it away.", "Jobs and Gates wrote open source code, while Linus strictly patented all of his inventions.", "There is no difference, they all started huge companies."],
            c: 1
        },
        {
            q: "2. Why did Linus initially create the Linux kernel in 1991?",
            a: ["He wanted to destroy Microsoft.", "He was hired by the Finnish government to build a super-weapon.", "He simply wanted a personal operating system for his own computer as a hobby, because he couldn't afford a commercial UNIX system.", "He wanted to become the richest man in the world quickly."],
            c: 2
        },
        {
            q: "3. What is the technical difference between \'Git\' and \'GitHub\'?",
            a: ["Git is the version control technology programmed by Linus, while GitHub is a commercial platform built by other people to host Git projects online.", "They are exactly the same thing.", "GitHub was created by Linus Torvalds, while Git was created by Microsoft.", "Git is a video game, GitHub is a forum for gamers."],
            c: 0
        },
        {
            q: "4. What is the 'Ultimate Irony' regarding GitHub's recent history?",
            a: ["It was banned by the government.", "It was purchased by Microsoft, the historical champion of proprietary software, meaning Microsoft now owns the biggest platform for Open Source code.", "Linus deleted all the code on it by mistake.", "It was revealed that GitHub servers ran on Windows 95."],
            c: 1
        },
        {
            q: "5. What is the current status of the 'war' between Open Source (Linux) and Proprietary Software?",
            a: ["Proprietary software completely destroyed Linux, which is no longer used.", "It's a tie, no one uses computers anymore.", "Open Source won aggressively: today, even multi-billion dollar companies like Microsoft rely heavily on Linux to run their cloud infrastructures (like Azure).", "Linux is only used by a small group of hackers in Finland."],
            c: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2.5rem";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "12px";
            card.style.background = "rgba(255,255,255,0.02)";
            card.style.border = "1px solid rgba(255,255,255,0.05)";

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff; font-size: 1.1rem;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex";
            optionsGroup.style.flexDirection = "column";
            optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = option;
                btn.style.textAlign = "left";
                btn.style.padding = "1rem";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "white";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.transition = "0.3s";
                btn.style.fontSize = "0.95rem";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) {
                        return; // do nothing
                    }
                    
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Correct!</strong>";
                        
                        if (!card.classList.contains('attempted')) {
                            score++;
                        }
                        
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }
                        
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Final Score: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= (quizData.length - 1) ? "#10B981" : "#F59E0B";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.innerHTML += " <strong>✗ Wrong, try again</strong>";
                        btn.classList.add('picked');
                        btn.style.pointerEvents = "none";
                        card.classList.add('attempted');
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
