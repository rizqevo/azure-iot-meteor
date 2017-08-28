import angular from 'angular';
import angularMeteor from 'angular-meteor';
import nvd3 from 'angular-nvd3';
import 'nvd3/build/nv.d3.css';

angular.module('iothubexample', [
  angularMeteor,
  nvd3
])
.controller('mainCtrl',['$scope','$reactive',function($scope,$reactive){
  var vm = this;
  vm.title = 'IoT Hub';

  $reactive(vm).attach($scope);

  messages = new Mongo.Collection('messages');

  vm.subscribe('pubMessages');

  vm.helpers({
    messageData() {
      return messages.find({}, { sort: { messageId: -1 } });
    }
  });
// , { sort: { messageId: -1 } }
  //console.log(vm.messageData);


  $scope.nvd3Chart = {};

  $scope.$watchCollection('vm.messageData', function(msg) {
    console.log("change to the messageData! ", JSON.stringify(msg[0]));

    vm._messages = msg[0];

    if (vm._messages)
    {
      //$scope.nvd3Chart.api.updateWithData(vm._messages);
      $scope.data =
        [{
           "key": "temperature",
           "color": "#d62728",
           "values": [{
             "value": vm._messages.temperature
           }]
        }, {
           "key": "humidity",
           "color": "#1f77b4",
           "values": [{
             "value": vm._messages.humidity
           }]
        }];

        $scope.nvd3Chart.api.refresh();
    }
  });



  vm._messages =
  // [
    //{"messageId":-1,"deviceId":"Raspberry Pi Web Client Fake 1","temperature":24.31399233104477,"humidity":70.89398279765187},
    {"messageId":0,"deviceId":"Raspberry Pi Web Client Fake 1","temperature":26.31399233104477,"humidity":71.89398279765187};
  //];

  $scope.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 300,
        x: function(d) {
          return d.label;
        },
        y: function(d) {
          return d.value;
        },
        showControls: true,
        showValues: true,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Values',
          tickFormat: function(d) {
            return d3.format(',.2f')(d);
          }
        }
         ,
        // visible: true, // default: true
        // extended: false, // default: false
        // disabled: false, // default: false
        // refreshDataOnly: true//, // default: true
        // deepWatchOptions: true, // default: true
        // deepWatchData: true, // default: true
        // deepWatchDataDepth: 1, // default: 2
        // debounce: 10 // default: 10
      }
    };



  // $scope.data =
  //   [{
  //      "key": "temperature",
  //      "color": "#d62728",
  //      "values": [{
  //        "value": vm._messages.temperature
  //      }]
  //   }, {
  //      "key": "humidity",
  //      "color": "#1f77b4",
  //      "values": [{
  //        "value": vm._messages.humidity
  //      }]
  //   }];

}])
