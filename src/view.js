const render = (state, elements) => (path, value) => {
  // console.log(`path: ${path}`);
  // console.log(`value: ${value}`);
  // console.log(`prevValue: ${prevValue}`);
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'error': {
      elements.urlInput.classList.add('is-invalid');
      // const text = document.createTextNode(state.additionProcess.errorDesc);
      feedbackEl.textContent = state.additionProcess.errorDesc;
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
