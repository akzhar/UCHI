(function() {

  const ERROR_LABEL_CLASS = 'answers__label--error';
  const ERROR_SUBMIT_CLASS = 'test__submit--error';
  const SUCCESS_SUBMIT_CLASS = 'test__submit--success';
  const SHOW_TIP_CLASS = 'test__tip--show';
  const TIMEOUT__SMALL = 1000;
  const TIMEOUT__BIG = 1500;
  const TRANSITION_TIME = 2000;
  const MS_PER_SEC = 1000;
  const KEY = + document.querySelector('#key').textContent;

  const test = document.querySelector('.test');
  const options = test.querySelectorAll('.answers__label');
  const submitBtn = test.querySelector('.test__submit');
  const tip = test.querySelector('.test__tip');

  let atempt = {
    Counter: {
      chosenOptions: 0,
      chosenRightOptions: 0,
      rightOptionsTotal: 0,
    },
    wrongOptions: []
  };

  submitBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    tip.classList.remove(SHOW_TIP_CLASS);
    countAtemptOptions();
    checkAtempt();
  });

  function countAtemptOptions() {
    resetCounters();
    options.forEach(function(option) {
      let formula = option.textContent;
      let isRightOption = isFormulaTrue(formula);
      let checkbox = document.querySelector(`#${option.dataset.checkboxid}`);
      if (checkbox.checked) {
        atempt.Counter.chosenOptions++;
        if (isRightOption) {
          atempt.Counter.chosenRightOptions++;
        } else {
          atempt.wrongOptions.push(option);
        }
      }
      if (isRightOption) {
        atempt.Counter.rightOptionsTotal++;
      }
    });
  }

  function checkAtempt() {
    const chosenRightOptions = atempt.Counter.chosenRightOptions;
    const chosenOptions = atempt.Counter.chosenOptions;
    const rightOptionsTotal = atempt.Counter.rightOptionsTotal;

    if (chosenOptions === 0) {
      return;
    }

    if (chosenOptions !== chosenRightOptions) {
      wrongAnswerAction();
      return;
    }

    if (rightOptionsTotal !== chosenRightOptions) {
      notAllAnswersAction();
      return;
    }

    if (chosenOptions === rightOptionsTotal
    && chosenOptions === chosenRightOptions) {
      allAnswersAction();
    }
  }

  function wrongAnswerAction() {
    disableSubmit();
    atempt.wrongOptions.forEach(function(option) {
      option.classList.add(ERROR_LABEL_CLASS);
      window.setTimeout(function() {
        option.classList.remove(ERROR_LABEL_CLASS);
      }, TIMEOUT__SMALL);
    });
    window.setTimeout(function() {
      getReadyForNextAtempt('Вычисли x');
    }, TIMEOUT__SMALL);
  }

  function notAllAnswersAction() {
    disableSubmit();
    window.setTimeout(function() {
      getReadyForNextAtempt('Это не все правильные ответы');
    },TIMEOUT__SMALL);
  }

  function allAnswersAction() {
    submitBtn.classList.add(SUCCESS_SUBMIT_CLASS);
    tip.classList.remove(SHOW_TIP_CLASS);
    window.setTimeout(function() {
      test.style = `opacity: 0; transition: ${TRANSITION_TIME / MS_PER_SEC}s;`;
    }, TIMEOUT__BIG);
    window.setTimeout(function() {
      test.style = 'display: none;';
    }, TIMEOUT__BIG + TRANSITION_TIME);
  }

  function getReadyForNextAtempt(tipText) {
    unableSubmit();
    untickAllCheckboxes();
    tip.textContent = tipText;
    tip.classList.add(SHOW_TIP_CLASS);
  }

  function untickAllCheckboxes() {
    options.forEach(function(option) {
      let checkbox = document.querySelector(`#${option.dataset.checkboxid}`);
      checkbox.checked = false;
    });
  }

  function resetCounters() {
    for(let counter in atempt.Counter) {
      if({}.hasOwnProperty.call(atempt.Counter, counter)) {
        atempt.Counter[counter] = 0;
      }
    }
    atempt.wrongOptions = [];
  }

  function isFormulaTrue(formula) {
    formula = formula.replace('=', '===');
    formula = formula.replace('x', 'KEY');
    return (eval(formula)) ? true : false;
  }

  function disableSubmit() {
    submitBtn.classList.add(ERROR_SUBMIT_CLASS);
    submitBtn.disabled = true;
  }

  function unableSubmit() {
    submitBtn.classList.remove(ERROR_SUBMIT_CLASS);
    submitBtn.disabled = false;
  }

})();
