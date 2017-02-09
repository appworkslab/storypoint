import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todoList.html';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.helpers({
            tasks() {
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
        });
    }

    addTask(newTask) {
        // Insert a task into the collection
        Tasks.insert({
            text: newTask,
            token: (new Date()).getTime(),
            createdAt: new Date
        });

        // Clear form
        this.newTask = '';
    }


    setChecked(task) {
        // Set the checked property to the opposite of its current value
        Tasks.update(task._id, {
            $set: {
                checked: !task.checked
            },
        });
    }

    removeTask(task) {
        Tasks.remove(task._id);
    }
}


export default angular.module('todosList', [
    angularMeteor
])
.component('todosList', {
    templateUrl: template,
    controller: ['$scope', TodosListCtrl],
    controllerAs: 'todoList'
});