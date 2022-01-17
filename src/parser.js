const parseData = (data) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const id = 1;
  const feed = { title, description, id };
  const posts = [...data.querySelectorAll('item')]
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postUrl = item.querySelector('link').textContent;
      const postId = 0;
      return {
        postId, postTitle, postUrl, feedId: id,
      };
    });
  return [feed, posts];
};

export default parseData;
