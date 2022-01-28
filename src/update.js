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
        .filter(({ postTitle: title1 }) => !state.data.posts
          .some(({ postTitle: title2 }) => title2 === title1));
      postsToRender.forEach((post) => {
        post.id = _.uniqueId('post_');
        post.feedId = id;
      });
      state.update.postsToRender = postsToRender;
      state.data.posts = state.data.posts.concat(postsToRender);
      watchedState.update.updateState = 'updated';
      state.update.updateState = null;
      state.update.postsToRender = null;
    })
    .catch((error) => {
      console.log('Network error>>>>', error);
    }));

  Promise.all(promises)
    .then(() => setTimeout(() => trackUpdates(state, watchedState), 5000));
};

export default trackUpdates;
