
import 'bootstrap/dist/css/bootstrap.css';
import './expresspoll.css';
import angular from 'angular';
require ('angular-route');
require ('angular-resource');
// import schemaForm from '../bower_components/angular-schema-form/dist/schema-form.js';
require ('schemaForm') ; // schemaForm from '../bower_components/angular-schema-form/dist/schema-form.js';
import bootstrapDecorator from '../bower_components/angular-schema-form/dist/bootstrap-decorator.js';


// ontoModule.controller('ObjectViewController',objectViewController);

import routeConfig from './routeConfig';
import tabController from './tab-controller';
import userservice from './userservice';
import pollservice from './pollservice';
import adminservice from './adminservice';

import userController from './user';

import adminController from './admin';
import resultsController from './results';


var expoll = angular.module('express-poll', ['ngRoute','schemaForm','ngResource']);
expoll.config(routeConfig);

expoll.controller('UserController',userController);
expoll.factory('userservice',userservice);
expoll.factory('pollservice',pollservice);
expoll.factory('adminservice',adminservice);

expoll.controller('TabCtrl',tabController);


expoll.controller('AdminCtrl',adminController);
expoll.controller('ResultsCtrl',resultsController);


