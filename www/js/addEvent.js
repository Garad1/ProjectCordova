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
        document.querySelector("input#addLocalisation").addEventListener("click", this.localize);
        document.querySelector("input#addPhoto").addEventListener("click", this.addPicture);
	},

    insertEvent: function(){
        var eventName = document.querySelector("input#eventName").value;
        var eventDateTime = document.querySelector("input#eventDateTime").value;
        var selectType = document.querySelector("select#selectType");
        var eventType = selectType.options[selectType.selectedIndex].value;
        var eventDescription = document.querySelector("textarea#eventDescription").value; 
        var localisation = document.querySelector("input#eventLocalisation").value;
        var photo = document.querySelector("img#photo").src;

        var loc = localisation.split(":");
        var latitude = loc[0];
        var longitude = loc[1];
        
        var notif = 1;

        console.log(eventName);
        console.log(eventDateTime);
        console.log(eventType);
        console.log(eventDescription);     

        var eventNew = {
            "eventName" : eventName,
            "date" : eventDateTime,
            "eventType" : eventType,
            "description" : eventDescription,
            "notification" : notif,
            "latitude": latitude,
            "longitude" : longitude,
            "eventPhoto" : photo
        };

        var db = new Database();
        db.insertEvent(eventNew, function(tx,results){
            console.log(results);
            console.log(results.insertId);
            var date = new Date(eventNew['date']);
            createNotification(results.insertId, eventNew['eventName'], date, eventNew['description']);
            document.location.href="index.html";
        });

        function createNotification(id, nameEvent, date, description){
            console.log(cordova);
            cordova.plugins.notification.local.schedule({
                id: id,
                at: date,
                title: nameEvent,
                text: description,
                smallIcon: 'res://cordova',
            });
        }
    },

    localize: function(){
        console.log("Localisation de l'appareil");
        navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
        console.log("Position en cours de récuo");
        function onSuccess(position){
            console.log(position.coords.latitude + " : " + position.coords.longitude);
            document.querySelector("input#eventLocalisation").value = position.coords.latitude + ":" + position.coords.longitude;
        }

        function onError(error){
            alert('Veuillez activer la localisation');
        }
    },

    addPicture: function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.FILE_URI, targetHeight: 300, targetWidth:300 });

        function onSuccess(imageURI) {
            console.log(imageURI);
            var image = document.querySelector("img#photo");
            image.src = imageURI;
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

};

app.initialize();
