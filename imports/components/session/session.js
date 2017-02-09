import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './session.html';
import { Sessions } from '../../api/sessions.js';
import { Players } from '../../api/players.js';

class SessionCtrl {
    constructor($scope, $state,$window,localStorageService) {
        $scope.viewModel(this);
        this.scope = $scope;
        this.localStorageService = localStorageService;
        this.session_token = Number($state.params.session);
        let localPlayer = this.localStorageService.get('player');
        if(localPlayer && localPlayer.session_token===this.session_token){
            this.currentPlayer = localPlayer.player_id;
        }
        
        this.helpers({
            session() {
                return Sessions.findOne({ token: this.session_token }, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            players() {
                return Players.find({ session_token: this.session_token });
            }
        });
        $window.onbeforeunload = function(){
            let localPlayer = localStorageService.get('player');
            if(localPlayer){
                Players.remove({_id:localPlayer.player_id});
                localStorageService.remove('player');
            }
        }
    }

    addPlayer(event) {
        let _self = this;
        if (event.keyCode === 13) {
            let exists = Players.find({ name: this.playerName, session_token: this.session_token }).count();
            if (!exists || exists===0) {
                Players.insert({
                    name: this.playerName,
                    organizer: false,
                    session_token: this.session_token
                }, function (error, result) {
                    if (error) {
                        console.log(error);
                    } else if (result) {
                        _self.localStorageService.set('player',{session_token:_self.session_token,player_id:result});
                        _self.currentPlayer = result;
                        _self.scope.$apply();
                    }
                });
            }
        }
    }

    vote(value){
        Players.update({_id:this.currentPlayer},{
            $set:{
                vote: value
            }
        });
    }
    clearVote(){
        Players.find({session_token:this.session_token}).forEach(function(player){
            Players.update({_id:player._id},{$unset:{vote: 1,showVote:1}});
        });
    }
    showVote(){
        Players.find({session_token:this.session_token}).forEach(function(player){
            Players.update({_id:player._id},{$set:{showVote: true}});
        });
    }
}

export default angular.module('session', [
    angularMeteor
])
    .component('session', {
        templateUrl: template,
        controller: ['$scope', '$state','$window','localStorageService', SessionCtrl],
        controllerAs: 'session'
    });