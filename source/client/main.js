import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('iothubexample', [
  angularMeteor
])
.controller('mainCtrl',['$scope',function($scope){
  $scope.title = 'IoT Hub'
}])
