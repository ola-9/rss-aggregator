import _ from 'lodash';

const parseData = (data) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const id = _.uniqueId('feed_');
  const feed = { title, description, id };
  const posts = [...data.querySelectorAll('item')]
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postUrl = item.querySelector('link').textContent;
      const postId = _.uniqueId('post_');
      return {
        postId, postTitle, postUrl, feedId: id,
      };
    });
  return [feed, posts];
};

export default parseData;
