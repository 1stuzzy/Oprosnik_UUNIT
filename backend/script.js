document.addEventListener('DOMContentLoaded', () => {
    const openDialogButton = document.getElementById('openDialogButton');
    const startSurveyBtn = document.getElementById('startSurvey');
    const surveyDialog = document.getElementById('surveyDialog');
    const questionContainer = document.getElementById('questionContainer');
    const applicationForm = document.getElementById('applicationForm');
    const contactForm = document.getElementById('contactForm');
    const questionText = document.getElementById('questionText');
    const options = document.getElementById('options');
    const questionCount = document.getElementById('questionCount');

    let surveyCompleted = false;

    openDialogButton.addEventListener('click', () => {
        showWelcomeDialog();
        openDialogButton.style.display = 'none';
    });

    function showWelcomeDialog() {
        surveyDialog.style.display = 'block';
        questionContainer.style.display = 'none';
        applicationForm.style.display = 'none';
    }

    startSurveyBtn.addEventListener('click', () => {
        if (!surveyCompleted) {
            startSurvey();
        }
    });

    function startSurvey() {
        surveyDialog.style.display = 'none';
        questionContainer.style.display = 'block';
        showQuestion(0);
    }

    function showQuestion(index) {
        const question = questions[index];
        questionText.textContent = question.text;
        options.innerHTML = '';
        question.options.forEach((option, idx) => {
            const button = document.createElement('button');
            button.textContent = option.label;
            button.addEventListener('click', () => handleAnswer(index, idx));
            options.appendChild(button);
        });
        questionCount.textContent = `Текущий вопрос: ${index + 1} из ${questions.length}`;
    }

    function handleAnswer(questionIndex, optionIndex) {
        const selectedOption = questions[questionIndex].options[optionIndex];
        selectedOption.tags.forEach(tag => {
            specialties[tag] += selectedOption.score;
        });
        if (questionIndex < questions.length - 1) {
            showQuestion(questionIndex + 1);
        } else {
            showResult();
        }
    }
    let selectedSpecialtyName;

    function showResult() {
        surveyCompleted = true;
        questionContainer.style.display = 'none';
        applicationForm.style.display = 'block';

        let maxScore = -Infinity;
        let selectedSpecialtyTag = '';
        for (const specialty in specialties) {
            if (specialties[specialty] > maxScore) {
                maxScore = specialties[specialty];
                selectedSpecialtyTag = specialty;
            }
        }

        selectedSpecialtyName = getSpecialtyName(selectedSpecialtyTag);
        const specialtyMessage = document.createElement('p');
        specialtyMessage.setAttribute('id', 'preSubmitSpecialtyMessage');
        specialtyMessage.textContent = `Ваша специальность: ${selectedSpecialtyName}`;
        applicationForm.insertBefore(specialtyMessage, contactForm);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (surveyCompleted) {
            const name = document.getElementById('nameInput').value;
            const phone = document.getElementById('phoneInput').value;
            const selectedSpecialtyTag = getSpecialtyTagFromName();
            const selectedSpecialtyName = getSpecialtyName(selectedSpecialtyTag);
            const selectedSpecialtyDescription = specialtyDescriptions[selectedSpecialtyTag];

            const data = {
                name: name,
                phone: phone,
                specialization: selectedSpecialtyName
            };


            contactForm.style.display = 'none';
            document.getElementById('applicationHeader').style.display = 'none';

            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Заявка успешно отправлена!";
            successMessage.style.display = 'block';

            const specialtyMessage = document.getElementById('preSubmitSpecialtyMessage');
            successMessage.after(specialtyMessage);

            const descriptionMessage = document.createElement('p');
            descriptionMessage.textContent = selectedSpecialtyDescription;

            successMessage.after(specialtyMessage);
            specialtyMessage.after(descriptionMessage);

            const closeButton = document.createElement('button');
            closeButton.textContent = "Закрыть";
            closeButton.addEventListener('click', () => {
                applicationForm.style.display = 'none';
                openDialogButton.style.display = 'block';
            });
            descriptionMessage.after(closeButton);

            try {
                await fetch('/submitResults', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
            } catch (error) {
                console.error('Ошибка при отправке данных');
            }
        }
    });

    function getSpecialtyName(tag) {
        switch (tag) {
            case "до": return "Дошкольное образование";
            case "но": return "Преподавание в начальных классах";
            case "исп": return "Информационные системы и программирование";
            case "БПЛ": return "Оператор беспилотных летательных аппаратов";
            case "Финансы": return "Финансы";
            case "Оператор ЕДДС": return "Оператор ЕДДС";
            case "Юриспруденция": return "Юриспруденция";
            case "Мехатроники": return "Мехатроника";
            default: return "исп";
        }
    }

    function getSpecialtyTagFromName() {
        let maxScore = -Infinity;
        let selectedSpecialtyTag = '';
        for (const specialty in specialties) {
            if (specialties[specialty] > maxScore) {
                maxScore = specialties[specialty];
                selectedSpecialtyTag = specialty;
            }
        }
        return selectedSpecialtyTag;
    }
});
