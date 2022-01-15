const render = (i18nIntance, state, elements) => (path, value) => {
  // console.log(`path: ${path}`);
  // console.log(`value: ${value}`);
  // console.log(`prevValue: ${prevValue}`);
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'notUnique': {
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.additionProcess.errorDesc);
      break;
    }
    case 'invalid': {
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.additionProcess.errorDesc);
      break;
    }
    case 'valid': {
      elements.urlInput.classList.remove('is-invalid');
      feedbackEl.textContent = '';
      elements.form.reset();
      elements.urlInput.focus();
      break;
    }

    default:
      throw new Error(`unknown state: ${value}`);
  }
};

export default render;
