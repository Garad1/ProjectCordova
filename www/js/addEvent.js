/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.querySelector("input#create").addEventListener("click", this.insertEvent);
        document.querySelector("input#cancel").addEventListener("click", function(){
            console.log("yolo");
            document.location.href="index.html";
		});
	},

    insertEvent: function(){
        var eventName = document.querySelector("input#eventName").value;
        var eventDateTime = document.querySelector("input#eventDateTime").value;
        var selectType = document.querySelector("select#selectType");
        var eventType = selectType.options[selectType.selectedIndex].value;
        var eventDescription = document.querySelector("textarea#eventDescription").value;
        var notification = document.querySelector("#eventNotif").checked; //True or false
        console.log(notification);
        if(notification == true){
            var notif = 1;
        } else {
            var notif = 0;
        }
        console.log(eventName);
        console.log(eventDateTime);
        console.log(eventType);
        console.log(eventDescription);
        console.log(notification);       

        var eventNew = {
            "eventName" : eventName,
            "date" : eventDateTime,
            "eventType" : eventType,
            "description" : eventDescription,
            "notification" : notif
        };

        var db = new Database();
        db.insertEvent(eventNew, function(tx,results){
            console.log(results);
            //var eventDate = eventNew['date'].split("T");
            //var date = eventDate[0] + " " + eventDate[1];
            var date = new Date(eventNew['date']);
            if(eventNew['notification'] == 1) {
                console.log(results.insertId);
                createNotification(results.insertId, eventNew['eventName'], eventNew['date'], eventNew['description']);
            }
            document.location.href="index.html";
        });

        function createNotification(id, nameEvent, date, description){
            console.log(cordova);
            cordova.plugins.notification.local.schedule({
                id: id,
                at: new Date(date),
                title: nameEvent,
                text: description,
                autoClear  : false,   
            });
        }
    },

};

app.initialize();
