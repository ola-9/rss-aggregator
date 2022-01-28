const parseData = (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'text/xml');
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const feed = { title, description };
  const posts = [...data.querySelectorAll('item')]
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const postDesc = item.querySelector('description').textContent;
      return { postTitle, link, postDesc };
    });
  return { feed, posts };
};

export default parseData;
