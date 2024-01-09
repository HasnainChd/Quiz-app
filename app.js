let currentQuestionIndex = 0;
let score = 0;
let questions;

const quizContainer = document.getElementById('quiz-container');
const nextBtn = document.getElementById('next-btn');
nextBtn.addEventListener('click', nextQuestion);

function startQuiz() {
    axios.get('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => {
            questions = response.data.results;
            displayQuestion(questions[currentQuestionIndex]);
        })
        .catch(error => console.error(error));
}

function displayQuestion(question) {
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>Question ${currentQuestionIndex + 1} of ${questions.length}</h3>
            <p>${question.question}</p>
        </div>
        <ul class="quiz-options">
            ${shuffle([...question.incorrect_answers, question.correct_answer])
                .map(answer => `<li class="quiz-option" onclick="selectAnswer(this)" data-correct="${question.correct_answer}">${answer}</li>`).join('')}
        </ul>
        `;
}

function selectAnswer(selectedOption) {
    if (selectedOption.classList.contains('selected') || selectedOption.classList.contains('correct') || selectedOption.classList.contains('wrong')) {
        // Do nothing if the option has already been selected or the result is displayed
        return;
    }
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    selectedOption.classList.add('selected');

    const isCorrect = selectedOption.innerText === selectedOption.dataset.correct;
    displayResult(isCorrect);
    
    // Disable all options after the user has selected an answer
    options.forEach(option => option.setAttribute('onclick', ''));
}

function displayResult(isCorrect) {
    const selectedOption = document.querySelector('.quiz-option.selected');
    selectedOption.classList.add(isCorrect ? 'correct' : 'wrong');

    const resultMessage = document.createElement('p');
    resultMessage.textContent = isCorrect ? 'Correct!' : 'Wrong!';
    resultMessage.classList.add(isCorrect ? 'correct' : 'wrong');
    quizContainer.appendChild(resultMessage);
}

function nextQuestion() {
    const selectedOption = document.querySelector('.quiz-option.selected');
    if (selectedOption) {
        const isCorrect = selectedOption.innerText === selectedOption.dataset.correct;
        if (isCorrect) {
            score++;
        }
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion(getCurrentQuestion());
    } else {
        endQuiz();
    }
}

function getCurrentQuestion() {
    return questions[currentQuestionIndex];
}

function endQuiz() {
    quizContainer.innerHTML = `
        <h3>Quiz completed! Your score is: ${score} out of ${questions.length}</h3>
        <button class="btn btn-primary" onclick="restartQuiz()">Restart Quiz</button>
    `;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startQuiz();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
// Start the quiz
startQuiz();
