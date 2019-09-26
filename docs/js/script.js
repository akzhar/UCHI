'use strict';

(function() {

  const ERROR_LABEL_CLASS = 'answers__label--error';
  const ERROR_SUBMIT_CLASS = 'submit--error';
  const SUCCESS_SUBMIT_CLASS = 'submit--success';
  const SHOW_HINT_CLASS = 'hint--show';
  const TIMEOUT__SMALL = 1000;
  const TIMEOUT__BIG = 1500;
  const TRANSITION_TIME = 1500;
  const MS_PER_SEC = 1000;
  const KEY = + document.querySelector('#key').textContent;

  const testBlock = document.querySelector('.test');
  const checkboxes = testBlock.querySelectorAll('.answers__checkbox');
  const answers = testBlock.querySelectorAll('.answers__label');
  const submitBtn = testBlock.querySelector('.submit');
  const hintBlock = testBlock.querySelector('.hint');

  let atempt = {
    Answers: {
      chosenTotal: 0,
      chosenCorrect: 0,
      correctTotal: 0,
    },
    wrongAnswers: []
  };

  answers.forEach(function(answer) {
    answer.addEventListener('click', function(evt) {
      evt.preventDefault();
      let checkbox = this.previousElementSibling;
      if (!checkbox.disabled) {
        checkbox.checked = (checkbox.checked) ? false : true;
      }
      let haveAnswer = isSomethingChecked();
      submitBtn.disabled = (haveAnswer) ? false : true;
    });
  });

  submitBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    hintBlock.classList.remove(SHOW_HINT_CLASS);
    disableAnswers(true);
    countAtemptAnswers();
    checkAtempt();
  });

  function countAtemptAnswers() {
    resetAtemptAnswers();
    answers.forEach(function(answer) {
      let formula = answer.textContent;
      let isRightAnswer = isFormulaTrue(formula);
      let checkbox = answer.previousElementSibling;
      if (checkbox.checked) {
        atempt.Answers.chosenTotal++;
        if (isRightAnswer) {
          atempt.Answers.chosenCorrect++;
        } else {
          atempt.wrongAnswers.push(answer);
        }
      }
      if (isRightAnswer) {
        atempt.Answers.correctTotal++;
      }
    });
  }

  function checkAtempt() {
    const chosenCorrect = atempt.Answers.chosenCorrect;
    const chosenTotal = atempt.Answers.chosenTotal;
    const correctTotal = atempt.Answers.correctTotal;

    if (chosenTotal !== chosenCorrect) {
      markWrongAnswers();
      wrongAnswerAction('Вычисли x');
      return;
    }

    if (correctTotal !== chosenCorrect) {
      wrongAnswerAction('Это не все правильные ответы');
      return;
    }

    if (chosenTotal === correctTotal && chosenTotal === chosenCorrect) {
      rightAnswerAction();
    }
  }

  function wrongAnswerAction(hintText) {
    submitBtn.classList.add(ERROR_SUBMIT_CLASS);
    hintBlock.textContent = hintText;
    hintBlock.classList.add(SHOW_HINT_CLASS);
    window.setTimeout(getReadyForNextAtempt, TIMEOUT__SMALL);
  }

  function rightAnswerAction() {
    submitBtn.classList.add(SUCCESS_SUBMIT_CLASS);
    hideTestBlock();
  }

  function markWrongAnswers() {
    atempt.wrongAnswers.forEach(function(answer) {
      answer.classList.add(ERROR_LABEL_CLASS);
      window.setTimeout(function() {
        answer.classList.remove(ERROR_LABEL_CLASS);
      }, TIMEOUT__SMALL);
    });
  }

  function hideTestBlock() {
    window.setTimeout(function() {
      testBlock.style = `opacity: 0; transition: ${TRANSITION_TIME / MS_PER_SEC}s;`;
    }, TIMEOUT__BIG);
    window.setTimeout(function() {
      testBlock.style = 'display: none;';
    }, TIMEOUT__BIG + TRANSITION_TIME);
  }

  function getReadyForNextAtempt() {
    submitBtn.classList.remove(ERROR_SUBMIT_CLASS);
    untickAllCheckboxes();
    disableAnswers(false);
    submitBtn.disabled = true;
  }

  function untickAllCheckboxes() {
    answers.forEach(function(answer) {
      let checkbox = answer.previousElementSibling;
      checkbox.checked = false;
    });
  }

  function disableAnswers(boolean) {
    checkboxes.forEach(function(checkbox) {
      checkbox.disabled = boolean;
    });
  }

  function resetAtemptAnswers() {
    for (let key in atempt.Answers) {
      if({}.hasOwnProperty.call(atempt.Answers, key)) {
        atempt.Answers[key] = 0;
      }
    }
    atempt.wrongAnswers = [];
  }

  function isFormulaTrue(formula) {
    formula = formula.replace('=', '===').replace('x', 'KEY');
    return (eval(formula)) ? true : false;
  }

  function isSomethingChecked() {
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        return true;
      }
    }
    return false;
  }

})();

