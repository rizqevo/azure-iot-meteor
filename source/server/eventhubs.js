import {
    Random
} from 'meteor/random';
import {
    check
} from 'meteor/check';

Meteor.publish("pubMessages", function(subsHandler) {

    check(subsHandler, Object);

    console.log('subsHandler : ', subsHandler);

    var self = this;

    var EventHubClient = require('azure-event-hubs').Client;
    var connectionString = 'HostName=rizqevoIoTHub01.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=OfQd/6K+25teYfVuuy3UMjQgaywf/jrRVtbW+spClwE=';

    messages = [{
        "messageId": -1,
        "deviceId": "Raspberry Pi Web Client Fake 1",
        "temperature": 24.31399233104477,
        "humidity": 70.89398279765187
    }, {
        "messageId": 0,
        "deviceId": "Raspberry Pi Web Client Fake 1",
        "temperature": 26.31399233104477,
        "humidity": 71.89398279765187
    }];

    var printError = function(err) {
        console.log('print error : ', err.message);
    };

    var printMessage = function() {
        console.log('Message default: ');
        console.log(messages)
        console.log('');
    };

    var addMessages = function(message) {
        self.added('messages', Random.id(), message.body);
        //messages.push(message.body)
    }

    var client = EventHubClient.fromConnectionString(connectionString);
    client.open()
        .then(client.getPartitionIds.bind(client))
        .then(function(partitionIds) {
            return partitionIds.map(function(partitionId) {
                return client.createReceiver('$Default', partitionId, {
                    'startAfterTime': Date.now()
                }).then(function(receiver) {
                    console.log('Created partition receiver: ' + partitionId)
                    receiver.on('errorReceived', printError);
                    receiver.on('message', addMessages);
                });
            });
        })
        .catch(printError);

    printMessage();

    console.log('messages : ', messages);



    //   if (_.isEmpty(subsHandler)) {
    //
    //
    _.each(messages, function(message) {
        self.added('messages', Random.id(), message);
    });
    //
    //     console.log('messages 2 : ', messages);
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // var addMessages = function(message){
    //     self.added('messages', Random.id(), message.body);
    // }
    //
    //
    //
    // //enf of if isEmpty
    //   };

    return self.ready();

});
