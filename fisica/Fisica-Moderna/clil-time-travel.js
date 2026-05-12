// CLIL: Time Travel - Interactive Components

// ============================================================================
// TIME MODELS SELECTOR
// ============================================================================

function initTimeModels() {
    const buttons = document.querySelectorAll('.model-btn');
    const contents = document.querySelectorAll('.model-content');

    if (!buttons.length || !contents.length) return;

    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const target = btn.getAttribute('data-model');

            // Update buttons
            buttons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            // Update content panels
            contents.forEach(function(panel) { panel.classList.remove('active'); });
            var targetPanel = document.getElementById('model-' + target);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

// ============================================================================
// TIME DILATION CALCULATOR (Lorentz factor)
// ============================================================================

function initDilationCalc() {
    var slider = document.getElementById('velocity-slider');
    var velDisplay = document.getElementById('velocity-display');
    var velText = document.getElementById('vel-text');
    var travellerTime = document.getElementById('traveller-time');
    var gammaVal = document.getElementById('gamma-val');
    var dilationNote = document.getElementById('dilation-note');

    if (!slider) return;

    var OBSERVER_TIME = 10; // years

    function updateCalc() {
        var pct = parseInt(slider.value, 10);
        var v = pct / 100; // fraction of c

        // Lorentz factor: gamma = 1 / sqrt(1 - v^2/c^2)
        var gamma = 1 / Math.sqrt(1 - v * v);

        // Traveller proper time: tau = t / gamma = t * sqrt(1 - v^2/c^2)
        var tau = OBSERVER_TIME * Math.sqrt(1 - v * v);

        // Update UI
        if (velDisplay) velDisplay.textContent = pct + '%';
        if (velText) velText.textContent = pct + '% c';
        if (travellerTime) travellerTime.textContent = tau.toFixed(3) + ' years';
        if (gammaVal) gammaVal.textContent = gamma.toFixed(3);

        if (dilationNote) {
            var diff = OBSERVER_TIME - tau;
            if (pct === 0) {
                dilationNote.textContent = 'No relative motion — clocks tick at the same rate.';
            } else if (diff < 0.01) {
                dilationNote.textContent = 'Dilation is negligible at this speed.';
            } else {
                var diffFixed = diff.toFixed(3);
                dilationNote.textContent =
                    'The traveller arrives ' + diffFixed + ' years younger than the Earth observer. ' +
                    'This is real forward time travel.';
            }
        }
    }

    slider.addEventListener('input', updateCalc);
    updateCalc();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    var quizData = [
        {
            q: "What does Special Relativity predict about a clock moving at high velocity relative to a stationary observer?",
            options: [
                "The moving clock ticks faster than the stationary one",
                "The moving clock ticks slower than the stationary one",
                "Both clocks tick at the same rate regardless of velocity",
                "The moving clock stops completely above 50% of c"
            ],
            correct: 1
        },
        {
            q: "The Novikov Self-Consistency Principle applies to which model of time travel?",
            options: [
                "Branching Timelines",
                "Block Universe",
                "Fixed Past",
                "Many-Worlds Interpretation"
            ],
            correct: 2
        },
        {
            q: "In the Lorentz time dilation formula τ = t·√(1 − v²/c²), what does τ represent?",
            options: [
                "The time measured by the stationary observer",
                "The speed of the traveller",
                "The proper time elapsed for the traveller",
                "The Lorentz factor gamma"
            ],
            correct: 2
        },
        {
            q: "Which physicist proposed the Chronology Protection Conjecture in 1992?",
            options: [
                "Albert Einstein",
                "Kurt Gödel",
                "Igor Novikov",
                "Stephen Hawking"
            ],
            correct: 3
        },
        {
            q: "In Back to the Future, which model of time does the story most closely follow?",
            options: [
                "Fixed Past — Marty cannot change anything",
                "Block Universe — all times coexist equally",
                "Branching Timelines — changing the past creates an alternate version",
                "Closed Timelike Curves — Marty loops back to the same moment"
            ],
            correct: 2
        },
        {
            q: "Kurt Gödel's 1949 contribution to time travel physics consisted of:",
            options: [
                "Proving that backward time travel is impossible",
                "Finding solutions to Einstein's field equations that contain closed timelike curves",
                "Measuring time dilation with atomic clocks aboard aircraft",
                "Proposing the Many-Worlds Interpretation of quantum mechanics"
            ],
            correct: 1
        }
    ];

    var quizArea = document.getElementById('quiz-area');
    var quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    var answers = {}; // qIndex -> chosen answer index

    quizArea.innerHTML = quizData.map(function(item, i) {
        return '<div class="quiz-item" style="margin-bottom: 2rem;">' +
            '<p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">' +
            (i + 1) + '. ' + item.q +
            '</p>' +
            '<div style="display: grid; gap: 0.8rem;">' +
            item.options.map(function(opt, j) {
                return '<label style="display: flex; align-items: center; cursor: pointer; padding: 0.8rem; background: rgba(0,0,0,0.2); border-radius: 8px; transition: all 0.3s;">' +
                    '<input type="radio" name="q' + i + '" value="' + j + '" style="margin-right: 1rem; cursor: pointer;" onchange="checkQuizAnswer(' + i + ',' + j + ',' + item.correct + ')">' +
                    '<span>' + opt + '</span>' +
                    '</label>';
            }).join('') +
            '</div>' +
            '</div>';
    }).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        answers[qIndex] = { chosen: ansIndex, correct: correctIndex };

        // Count correct answers
        var total = 0;
        Object.keys(answers).forEach(function(k) {
            if (answers[k].chosen === answers[k].correct) total++;
        });

        if (quizScore) {
            if (Object.keys(answers).length === quizData.length && total === quizData.length) {
                quizScore.textContent = '✓ Excellent! You answered all ' + quizData.length + ' questions correctly!';
                quizScore.style.color = '#a855f7';
            } else if (Object.keys(answers).length === quizData.length) {
                quizScore.textContent = 'Score: ' + total + ' / ' + quizData.length + '. Review the sections above and try again!';
                quizScore.style.color = 'var(--text-muted)';
            }
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initTimeModels();
    initDilationCalc();
    if (document.getElementById('quiz-area')) initQuiz();
});
