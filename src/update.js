/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import getProxyUrl from './util';
import parseData from './parser';

const trackUpdates = (state, watchedState) => {
  const promises = state.data.urls.map((url) => axios.get(getProxyUrl(url))
    .then((response) => {
      const [{ id }] = state.data.feeds.filter((feed) => feed.url === url);
      const { posts } = parseData(response);
      const postsToRender = posts
        .filter(({ title: title1 }) => !state.data.posts
          .some(({ title: title2 }) => title2 === title1));
      postsToRender.forEach((post) => (
        { ...post, id: _.uniqueId('post_'), feedId: id }
      ));
      state.data.postsToRender = postsToRender;
      state.data.posts = state.data.posts.concat(postsToRender);
      watchedState.processState.updating = 'completed';
      state.processState.updating = 'null';
      state.data.postsToRender = [];
    })
    .catch((error) => {
      state.processState.message = `addRss.${error.name}`;
      watchedState.processState.updating = 'error';
      state.processState.updating = null;
    }));

  Promise.all(promises)
    .then(() => setTimeout(() => trackUpdates(state, watchedState), 5000));
};

export default trackUpdates;
