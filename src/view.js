const render = (i18nIntance, state, elements) => (path, value) => {
  // console.log(`path: ${path}`);
  console.log(`value: ${value}`);
  // console.log(`prevValue: ${prevValue}`);
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'invalid': {
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.additionProcess.errorDescPath);
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
      throw new Error(`unknown value: ${value}`);
  }
};

export default render;
