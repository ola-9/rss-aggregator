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
  aEl.href = post.postUrl;
  aEl.classList.add('fw-bold');
  aEl.rel = 'noopener, noreferrer';
  aEl.dataset.id = 2;
  aEl.target = '_blank';
  const description = document.createTextNode(post.postTitle);
  aEl.appendChild(description);
  item.appendChild(aEl);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = 2; // example;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';
  item.appendChild(button);
  return item;
};

const render = (i18nIntance, state, elements) => (path, value) => {
  // console.log(`path: ${path}`);
  // console.log(`value: ${value}`);
  // console.log(`prevValue: ${prevValue}`);
  const feedbackEl = elements.feedback;
  switch (value) {
    case 'invalid': {
      elements.urlInput.classList.add('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.additionProcess.errorDescPath);
      feedbackEl.classList.add('text-danger');
      feedbackEl.classList.remove('text-success');
      break;
    }
    case 'valid': {
      elements.urlInput.classList.remove('is-invalid');
      feedbackEl.textContent = i18nIntance.t(state.additionProcess.successDescPath);
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      elements.form.reset();
      elements.urlInput.focus();
      if (state.feedsData.feeds.length === 1) {
        // console.log('!!!', state.feedsData.feeds.length);
        const feeds = createBlock('Фиды');
        elements.feeds.appendChild(feeds);
        const posts = createBlock('Посты');
        elements.posts.appendChild(posts);
      }
      const feedsList = elements.feeds.querySelector('ul');
      const [currentFeed] = state.feedsData.feeds
        .filter((feed) => feed.id === state.feedsData.currentFeedId);
      const feedItem = createFeedItem(currentFeed);
      feedsList.appendChild(feedItem);
      const postsList = elements.posts.querySelector('ul');
      const currentPosts = state.feedsData.posts
        .filter((post) => post.feedId === state.feedsData.currentFeedId);
      currentPosts.forEach((post) => {
        const postItem = createPostItem(post);
        postsList.append(postItem);
      });
      break;
    }
    default:
      throw new Error(`unknown path: ${path}`);
  }
};

export default render;
