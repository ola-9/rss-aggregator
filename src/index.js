// import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// import i18next from 'i18next';
// import ru from './locales/ru';
import app from './application.js';

// const runApp = () => {
//   const i18nextIntance = i18next.createInstance();
//   i18nextIntance.init({
//     lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//     },
//   }).then(() => app(i18nextIntance));
// };

export default () => app();
// export default runApp;
