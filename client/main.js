import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularRouter from 'angular-ui-router';
import angularLocalStorage from 'angular-local-storage';
import routes from './common/routes';
import run from './common/run';
import todosList from '../imports/components/todoList/todoList';
import createSession from '../imports/components/createSession/createSession';
import session from '../imports/components/session/session';

let app = angular.module('quiver', [
  angularMeteor,
  angularRouter,
  angularLocalStorage,
  todosList.name,
  createSession.name,
  session.name
])
  .config(routes)
  .run(run);

export default app;