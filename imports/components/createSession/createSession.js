import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './createSession.html';
import { Sessions } from '../../api/sessions.js';
import { Players } from '../../api/players.js';

class CreateSessionCtrl {
    constructor($scope,$state,localStorageService) {
        this.state = $state;
        this.localStorageService = localStorageService;
        $scope.viewModel(this);
        this.helpers({
            sessions() {
                return Sessions.find({}, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
        });
    }

    addSession() {
        let _self = this;
        let latestSession = Sessions.findOne({},{sort: {token:-1}});
        let token = latestSession?latestSession.token + 1:1;
        Sessions.insert({
            name: this.sessionName,
            token: token,
            createdAt: new Date
        }, function( error, result) { 
            if ( error ){
                console.log ( error );
            }else if ( result ){ 
                Players.insert({
                    name: _self.organizerName,
                    organizer: true,
                    session_token: token 
                }, function(error, result){
                    if ( error ){
                        console.log ( error );
                    }else if ( result ){ 
                        console.log(result);
                        _self.localStorageService.set('player',{session_token:token,player_id:result});
                        _self.state.go('home.session',{session:token});
                    }
                });
            }
        });
    }
    removeSession(session){
        Sessions.remove(session._id, function( error, result) { 
            if ( error ){
                console.log ( error );
            }else if ( result ){ 
                console.log ( result );
            } //the _id of new object if successful
        });
        Players.find({session_token:session.token}).forEach(function(player){
            Players.remove({_id:player._id});
        });
        
    }
}




export default angular.module('createSession', [
    angularMeteor
])
    .component('createSession', {
        templateUrl: template,
        controller: ['$scope','$state','localStorageService', CreateSessionCtrl],
        controllerAs: 'createSession'
    });