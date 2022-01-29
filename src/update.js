/* eslint-disable no-param-reassign */
import axios from 'axios';
// import _ from 'lodash';
import getProxyUrl from './util';
import parseData from './parser';
import { getFeedUpdates } from './data';

const trackUpdates = (state, watchedState) => {
  const promises = state.data.feeds.map((feed) => axios.get(getProxyUrl(feed.url))
    .then((response) => {
      const { id } = feed;
      const newPosts = getFeedUpdates(state, id, parseData(response).posts);
      state.data.postsToRender = newPosts;
      state.data.posts = state.data.posts.concat(newPosts);
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
