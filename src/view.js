const createBlock = (blockname) => {
  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('card', 'border-0');
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('card-body');
  blockWrapper.appendChild(headerWrapper);
  const headerTitle = document.createElement('h2');
  headerWrapper.appendChild(headerTitle);
  headerTitle.classList.add('card-title', 'h4');
  headerTitle.textContent = `${blockname}`;
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  blockWrapper.appendChild(list);
  return blockWrapper;
};

const createFeedItem = (feed) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'border-end-0');
  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;
  item.appendChild(title);
  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;
  item.appendChild(description);
  return item;
};

const createPostItem = (post) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const aEl = document.createElement('a');
  aEl.href = post.link;
  aEl.classList.add('fw-bold');
  aEl.rel = 'noopener, noreferrer';
  aEl.dataset.id = post.id;
  aEl.target = '_blank';
  const description = document.createTextNode(post.title);
  aEl.appendChild(description);
  item.appendChild(aEl);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = post.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';
  item.appendChild(button);
  return item;
};

const enableInput = (elements) => {
  elements.addButton.removeAttribute('disabled');
  elements.urlInput.removeAttribute('readonly');
};

const renderFeed = (state, elements) => {
  if (state.data.feeds.length === 1) {
    const feedsBlock = createBlock('Фиды');
    elements.feeds.appendChild(feedsBlock);
    const postsBlock = createBlock('Посты');
    elements.posts.prepend(postsBlock);
  }
  const feedsList = elements.feeds.querySelector('ul');
  const [currentFeed] = state.data.feeds
    .filter((feed) => feed.id === state.data.currentFeedId);
  const feedItem = createFeedItem(currentFeed);
  feedsList.prepend(feedItem);
  const postsList = elements.posts.querySelector('ul');
  const currentPosts = state.data.posts
    .filter((post) => post.feedId === state.data.currentFeedId);
  currentPosts.forEach((post) => {
    const postItem = createPostItem(post);
    postsList.append(postItem);
  });
};

const renderModal = (state, elements) => {
  const readPost = elements.posts.querySelector(`[data-id="${state.data.lastReadPostId}"]`);
  const readPostUrl = readPost.href;
  readPost.classList.remove('fw-bold');
  readPost.classList.add('fw-normal', 'link-secondary');
  const [selectedPost] = state.data.posts
    .filter((post) => post.id === state.data.lastReadPostId);
  const title = elements.modal.querySelector('.modal-title');
  const description = elements.modal.querySelector('.modal-body');
  const readFullPostLink = elements.modal.querySelector('.full-article');
  readFullPostLink.href = readPostUrl;
  title.textContent = selectedPost.title;
  description.textContent = selectedPost.description;
};

const render = (i18nIntance, state, elements) => (path, value) => {
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'error': {
      enableInput(elements);
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.processState.message);
      feedbackEl.classList.add('text-danger');
      feedbackEl.classList.remove('text-success');
      break;
    }
    case 'received': {
      enableInput(elements);
      elements.urlInput.classList.remove('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.processState.message);
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      elements.form.reset();
      elements.urlInput.focus();
      renderFeed(state, elements);
      break;
    }
    case 'receiving': {
      elements.addButton.setAttribute('disabled', '');
      elements.urlInput.setAttribute('readonly', true);
      break;
    }
    case 'completed': {
      const postsList = elements.posts.querySelector('ul');
      state.data.postsToRender.forEach((post) => {
        const postItem = createPostItem(post);
        postsList.prepend(postItem);
      });
      break;
    }
    case 'previewPost': {
      renderModal(state, elements);
      break;
    }
    case 'openPost': {
      const openedPost = elements.posts.querySelector(`a[data-id=${state.data.lastReadPostId}`);
      openedPost.classList.remove('fw-bold');
      openedPost.classList.add('fw-normal', 'link-secondary');
      break;
    }
    default:
      throw new Error(`unknown path: ${path}`);
  }
};

export default render;
