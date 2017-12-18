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
    intervalId: null,
    chrono: null,
    watchId: null,
    nbMeter: 0,
    latitude: null,
    longitude: null,
    isStarted: false,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        document.querySelector("#js-start").addEventListener("click", this.start);
        document.querySelector("#js-stop").addEventListener("click", this.stop);
        document.querySelector("#js-reset").addEventListener("click", this.reset);

        //$('#js-start').on('click', app.start);
        //$('#js-stop').on('click', app.stop);
        //$('#js-reset').on('click', app.reset);
        var plugin = cordova.plugins.backgroundMode;
        plugin.setDefaults({ silent: true });
        plugin.on('activate', app.startBackground);
        plugin.on('deactivate', app.stopBackground);
        //plugin.addEventListener('activate', this.startBackground);
        //plugin.addEventListener('deactivate', this.stopBackground);
        console.log('Test true data');
        var p1 = new LatLon(43.6126935, 3.8746068);
        var p2 = new LatLon(43.6126934, 3.8746058);
        var d = p1.distanceTo(p2); // 404.3 km
        console.log(d);
        console.log('Test fake data');
        var p1a = new LatLon(52.205, 0.119);
        var p2a = new LatLon(48.857, 2.351);
        var da = p1a.distanceTo(p2a); // 404.3 km
        console.log(da);
        app.chrono = new Chrono(function(str){
            console.log(str);
            $('#js-chrono').text(str);
        })
    },

    start: function(){
        if(!app.isStarted){
            console.log('enable');
            app.chrono.play();
            var plugin = cordova.plugins.backgroundMode;
            plugin.setEnabled(true);
            app.setGeolocalisation();
            app.isStarted = true;
        }
    },

    stop: function(){
        console.log('disable');
        app.chrono.pause();
        app.pauseAndResetHandler();
    },

    reset: function(){
        console.log('reset');
        app.chrono.reset();
        $('#js-meter').text('0');
        app.nbMeter = 0;
        app.latitude = null,
        app.longitude = null,
        app.pauseAndResetHandler();

    },

    pauseAndResetHandler: function(){
        var plugin = cordova.plugins.backgroundMode;
        plugin.setEnabled(false);
        navigator.geolocation.clearWatch(app.watchId);
        app.isStarted = false;
    },

    startBackground: function() {
        console.log('startBackgroundService');
        app.chrono.pause();
        navigator.geolocation.clearWatch(app.watchId);
        app.intervalId = setInterval(function () {
            app.chrono.tick();
            console.log('test2');
            navigator.geolocation.getCurrentPosition(app.geolocationSuccess, app.geolocationError, { enableHighAccuracy: true });
        }, 1000);
    },

    stopBackground: function() {
        console.log('stopBackgroundService');
        clearInterval(app.intervalId);
        app.chrono.updateShow();
        app.chrono.play();
        var isActivated = app.setGeolocalisation();
        /*if(!isActivated){
            $('#js-section-chrono').hide();
        }
        else{
            $('#js-section-chrono').show();
        }*/
    },

    geolocationSuccess: function(position){
        console.log('test');
        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;
        console.log(app.latitude);
        console.log(app.longitude);
        console.log(updatedLatitude);
        console.log(updatedLongitude);
        if (updatedLatitude != app.latitude && updatedLongitude != app.longitude) {
            if(app.latitude !== null && app.longitude !== null){
                var result = app.calculDistance(app.latitude, app.longitude, updatedLatitude, updatedLongitude);
                app.nbMeter += result;
                console.log(app.nbMeter.toFixed(2));    
            }
            console.log("MARCHEEEEE")
            app.latitude = updatedLatitude;
            app.longitude = updatedLongitude;
            $('#js-meter').text(app.nbMeter.toFixed(2));
        }
    },

    geolocationError: function(err){
        console.log(err)
    },

    setGeolocalisation: function(){
        cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
            console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
            if(enabled){
                //navigator.getCurrentPosition(app.geolocationSuccess, app.geolocationError, { enableHighAccuracy: true });
                app.watchId = navigator.geolocation.watchPosition(app.geolocationSuccess, app.geolocationError, {maximumAge: 3000, enableHighAccuracy: true });
                
            }
            else{
                cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        });

        function onRequestSuccess(success){
            console.log("Successfully requested accuracy: "+success.message);
            app.watchId = navigator.geolocation.watchPosition(app.geolocationSuccess, app.geolocationError, {maximumAge: 3000, enableHighAccuracy: true });
        }

        function onRequestFailure(error){
            console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
            if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                    cordova.plugins.diagnostic.switchToLocationSettings();
                }
            }
        }
    },

    calculDistance: function(oldLat, oldLong, newLat, newLong){
        oldPos = new LatLon(oldLat, oldLong);
        newPos = new LatLon(newLat, newLong);
        
        //console.log('YOLO');
        
        /*console.log('Test true data');
        var p1 = new LatLon(43.6126935, 3.8746068);
        var p2 = new LatLon(43.6126934, 3.8746058);
        var d = p1.distanceTo(p2); // 404.3 km
        console.log(d);
        console.log('Test fake data');
        var p1a = new LatLon(52.205, 0.119);
        var p2a = new LatLon(48.857, 2.351);
        var da = p1a.distanceTo(p2a); // 404.3 km
        console.log(da);*/
       
        //console.log(oldPos.distanceTo(newPos));

        return oldPos.distanceTo(newPos);
    }

};

app.initialize();