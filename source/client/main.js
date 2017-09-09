import angular from 'angular';
import angularMeteor from 'angular-meteor';
import nvd3 from 'angular-nvd3';
import 'nvd3/build/nv.d3.css';

angular.module('iothubexample', [
        angularMeteor,
        nvd3
    ])
    .controller('mainCtrl', ['$scope', '$reactive', function($scope, $reactive) {
        var vm = this;
        vm.title = 'IoT Hub';

        $reactive(vm).attach($scope);

        messages = new Mongo.Collection('messages');

        vm.subsHandler = {};

        //vm.getReactively('subsHandler');

        vm.subsHandler = vm.subscribe('pubMessages', function() {

            return [vm.subsHandler];
        });



        vm.helpers({
            messageData() {
                return messages.find({}, {
                    sort: {
                        messageId: -1
                    }
                });
            }
        });


        $scope.nvd3Chart = {};

        $scope.$watchCollection('vm.messageData', function(msg) {


            vm._messages = msg[0];

            if (vm._messages) {
                $scope.data = [{
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



        vm._messages = {
            "messageId": 0,
            "deviceId": "Raspberry Pi Web Client Fake 1",
            "temperature": 26.31399233104477,
            "humidity": 71.89398279765187
        };

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
            }
        };

    }])