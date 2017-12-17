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
        document.querySelector("input#search").addEventListener("click",this.onSearch);
    },

    onDeviceReady: function() {
        document.querySelector("input#add").addEventListener("click", function(){
            console.log("yolo");
            document.location.href="addEvent.html";
        });

        var db = new Database();

        db.selectAllEvent(function(tx, results) {
            var element = document.querySelector(".listEvent");
            clear(element);
            var len = results.rows.length;
            console.log(len);
            if(len == 0) {
                noResult(element);
            } else {
                for (i = 0; i < len; i++){

                    listEvent(element, results.rows.item(i));
                }
            }   
        });

        function noResult(element) {
            var p = document.createElement("p");
            p.innerHTML = "No events"
            element.appendChild(p);
        }

        function listEvent(element, item){
            //Mise en place de la liste à revoir
            console.log(item);
            var dateTime = item.date.split("T");
            var date = dateTime[0];
            var time = dateTime[1];

            var a = document.createElement("a");
            a.href= "event.html?id=" + item.id; //A DECOMMENTER QUAND Y AURA LA VUE POUR UN EVENT
            //a.href = "index.html";
            var div = document.createElement("div");
            div.className = "event";
            //var leftDiv = document.createElement("div");
            var eventName = document.createElement("span");
            eventName.className = "eventName";
            eventName.innerHTML = item.eventName;
            var typeEvent = document.createElement("span");
            typeEvent.className = "typeEvent";
            typeEvent.innerHTML = item.eventType;
            var dateEvent = document.createElement("span");
            dateEvent.className = "dateEvent";
            //var dateEv = new Date(item.date);
            dateEvent.innerHTML = date + " " + time;
            div.appendChild(eventName);
            div.appendChild(document.createElement("br"));
            div.appendChild(dateEvent);
            a.appendChild(div);
            element.appendChild(a);
        }

        
        function clear(element){
            while (element.hasChildNodes()){
                element.removeChild(element.lastChild);
            }
        }
        
    },

    onSearch: function() {
        var nameEvent = document.querySelector("input#textSearch").value;
        var selectType = document.querySelector("select#selectType");
        var typeEvent = selectType.options[selectType.selectedIndex].value;
        var db = new Database();
        db.selectEvent(nameEvent, typeEvent, function(tx,results){
            var element = document.querySelector(".listEvent");
            clear(element);
            var len = results.rows.length;
            console.log(len);
            if(len == 0) {
                noResult(element);
            } else {
                for (i = 0; i < len; i++){
                    listEvent(element, results.rows.item(i));
                }
            }   
        });

        function noResult(element) {
            var p = document.createElement("p");
            p.innerHTML = "No events"
            element.appendChild(p);
        }

        function listEvent(element, item){
            //Mise en place de la liste à revoir
            console.log(item);
            var dateTime = item.date.split("T");
            var date = dateTime[0];
            var time = dateTime[1];

            var a = document.createElement("a");
            a.href= "event.html?id=" + item.id; //A DECOMMENTER QUAND Y AURA LA VUE POUR UN EVENT
            //a.href = "index.html";
            var div = document.createElement("div");
            div.className = "event";
            //var leftDiv = document.createElement("div");
            var eventName = document.createElement("span");
            eventName.className = "eventName";
            eventName.innerHTML = item.eventName;
            var typeEvent = document.createElement("span");
            typeEvent.className = "typeEvent";
            typeEvent.innerHTML = item.eventType;
            var dateEvent = document.createElement("span");
            dateEvent.className = "dateEvent";
            //var dateEv = new Date(item.date);
            dateEvent.innerHTML = date + " " + time;
            div.appendChild(eventName);
            div.appendChild(document.createElement("br"));
            div.appendChild(dateEvent);
            a.appendChild(div);
            element.appendChild(a);
        }

        function clear(element){
            while (element.hasChildNodes()){
                element.removeChild(element.lastChild);
            }
        }

    },



};
app.initialize();