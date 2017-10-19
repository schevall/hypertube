import * as user from './controllers/user';
import * as movie from './controllers/movie';
import * as authentication from './controllers/authentication';
import * as picture from './controllers/picture';
import * as search from './controllers/search';
import * as comment from './controllers/comment';
import * as genre from './controllers/scraper/genreCount';
import * as video from './controllers/video';
import deleteOne from './controllers/video/deleter';

const routes = async (app, passport, upload) => {
  /**
   * Authentication routes. (Sign in)
   */
  app.post('/api/signin', authentication.local);
  app.get('/api/auth/42', passport.authenticate('42'));
  app.get('/api/auth/42/callback', authentication.fortytwo);
  app.get('/api/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/api/auth/google/callback', authentication.google);
  app.get('/api/auth/github', passport.authenticate('github'));
  app.get('/api/auth/github/callback', authentication.github);
  app.use('/oauth', (req, res) => {
    res.end();
  });

  /**
   * Unlogged routes.
   */
  app.post('/api/signup/info', user.postSignup);
  app.post('/api/signup/upload', upload.single('imageUploaded'), picture.postSignupPicture);
  app.post('/api/forgot', user.postForgot);
  app.post('/api/reset/:token', user.postReset);
  app.get('/api/movie/create/:idImdb/:hash', video.checker, video.videoStartTorrenter);
  app.get('/api/movie/progress/:idImdb/:hash', video.checker, video.getProgress);
  app.get('/api/movie/stream/:idImdb/:hash', video.checker, video.videoTorrenter);
  app.get('/api/movie/subtitle/:idImdb/:hash', video.getSub);
  app.get('/api/movie/clear/:idImdb', deleteOne);


  /**
   * Logged routes. (Sign in)
   */
  app.use('/api', passport.authenticate('jwt', { session: false }));
  app.get('/api/me', user.getMyAccount);
  app.post('/api/me', user.postUpdateProfile);
  app.delete('/api/me', user.deleteDeleteAccount); // not implemented
  app.post('/api/profile_pic', upload.single('imageUploaded'), picture.newPicture);
  // app.get('/api/profile', user.getAccount);
  app.get('/api/profile/:name', user.getAccount);
  app.get('/api/profile/id/:id', user.getAccountById);
  app.get('/api/movie/info/:idImdb', movie.getInfos);

  app.get('/api/comment/:idImdb', comment.getComment);
  app.post('/api/comment/:idImdb', comment.addComment);

  app.get('/api/genres', genre.getGenreTable);

  app.get('/api/gallery/search', search.getSearch);
};

export default routes;
