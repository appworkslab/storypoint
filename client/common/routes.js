let routes = function ($stateProvider, $urlRouterProvider,$locationProvider,localStorageServiceProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'client/modules/home/home.html'
        })
        .state('home.session', {
            url: ':session',
            templateUrl: 'client/modules/session/session.html'
        });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    localStorageServiceProvider.setPrefix('quiver');
};

routes.$inject = ['$stateProvider', '$urlRouterProvider','$locationProvider','localStorageServiceProvider'];
export default routes;