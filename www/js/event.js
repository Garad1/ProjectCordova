/*
Affichage d'un event pour avoir plus d'infos dessus !
*/

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.querySelector("input#update").addEventListener("click",this.onUpdate);
        document.querySelector("input#delete").addEventListener("click",this.onDelete);
        document.querySelector("input#main").addEventListener("click",function(){
            console.log("yolo");
            document.location.href="index.html";
        });
    },

    onDeviceReady: function() {
    	var id = getGetParams();
    	var db = new Database();
    	db.selectEventByID(id, function(tx, results){
    		var item = results.rows.item(0);
    		console.log(item);
    		document.querySelector("#nameEvent").innerHTML = item.eventName;
            document.querySelector("#dateEvent").innerHTML = item.date;
            document.querySelector("#eventDescription").innerHTML = item.description;
			document.querySelector("#typeEvent").innerHTML = item.eventType;
    	});

    	function getGetParams(){
            var url = new URL(window.location.href);
            return url.searchParams.get("id"); 
		}
    },

    onUpdate: function() {
    	var id = getGetParams();
    	var description = document.querySelector("#eventDescription").value;
    	var notification = document.querySelector("#eventNotif").checked; //True or false
    	var obj = {
            "id": id,
            "description" : description,
            "notification" : notification,
		};

		var db = new Database();
    	db.updateEvent(obj, function(tx, results){
    		console.log("L'event a été mise à jour");
    		document.location.href="index.html";
    	});

    	function getGetParams(){
            var url = new URL(window.location.href);
            return url.searchParams.get("id"); 
		}
    },

    onDelete: function() {
    	var id = getGetParams();
    	var db = new Database();
    	db.deleteEvent(id, function(tx, results){
    		console.log("L'event a été supprimé");
    		document.location.href="index.html";
    	});

    	function getGetParams(){
            var url = new URL(window.location.href);
            return url.searchParams.get("id"); 
		}
    },

};
app.initialize();