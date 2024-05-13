import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import basicAuthentication from '../middlewares/BasicAuthentication';
import xTokenAuthentication from '../middlewares/XTokenAuthentication';
import FilesController from '../controllers/FilesController';

const routes = Router();

routes.get('/status', AppController.getStatus);
routes.get('/stats', AppController.getStats);

routes.post('/users', UsersController.postNew);
routes.get('/users/me', xTokenAuthentication, UsersController.getMe);

routes.get('/connect', basicAuthentication, AuthController.getConnect);
routes.get('/disconnect', xTokenAuthentication, AuthController.getDisconnect);

routes.post('/files', xTokenAuthentication, FilesController.postUpload);
routes.get('/files', xTokenAuthentication, FilesController.getIndex);
routes.get('/files/:id', xTokenAuthentication, FilesController.getShow);

export default routes;
