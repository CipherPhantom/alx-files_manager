import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import basicAuthentication from '../middlewares/BasicAuthentication';
import xTokenAuthentication from '../middlewares/XTokenAuthentication';

const routes = Router();

routes.get('/status', AppController.getStatus);
routes.get('/stats', AppController.getStats);

routes.post('/users', UsersController.postNew);
routes.get('/users/me', xTokenAuthentication, UsersController.getMe);

routes.get('/connect', basicAuthentication, AuthController.getConnect);
routes.get('/disconnect', xTokenAuthentication, AuthController.getDisconnect);

export default routes;
