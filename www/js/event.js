/*
Affichage d'un event pour avoir plus d'infos dessus !
*/

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.querySelector("input#addLocalisation").addEventListener("click", this.localize);
        document.querySelector("input#addPhoto").addEventListener("click", this.addPicture);
        document.querySelector("input#update").addEventListener("click",this.onUpdate);
        document.querySelector("input#delete").addEventListener("click",this.onDelete);
        document.querySelector("input#startSport").addEventListener("click",this.startSport);
        
    },

    onDeviceReady: function() {
        var id = getGetParams();
    	var db = new Database();
        db.selectEventByID(id, function(tx, results){
            var item = results.rows.item(0);
    		console.log(item);
            var dateTime = item.date.split("T");
            var date = dateTime[0];
            var time = dateTime[1];
    		document.querySelector("#nameEvent").innerHTML = item.eventName;
            document.querySelector("#dateEvent").innerHTML = date + " " + time;
            document.querySelector("#eventDescription").innerHTML = item.description;
            document.querySelector("#typeEvent").innerHTML = item.eventType;


            
            
            if(item.eventPhoto != null){
                var image = document.querySelector("img#photo");
                image.src = item.eventPhoto;
                document.querySelector("input#addPhoto").value = "Changer la photo";
            }
            if(item.latitude != null && item.longitude != null){
                document.querySelector("input#addLocalisation").value = "Changer la position";
                document.querySelector("input#eventLocalisation").value = item.latitude + " : " + item.longitude;
            }
            if(item.eventType == "sport") {
                document.querySelector("input#startSport").style.visibility = "visible";
            }
        });

    	function getGetParams(){
            var url = new URL(window.location.href);
            return url.searchParams.get("id"); 
		}
    },

    onUpdate: function() {
    	var id = getGetParams();
    	var description = document.querySelector("#eventDescription").value;

    	var obj = {
            "id": id,
            "description" : description,
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

    localize: function(){
        console.log("Localisation de l'appareil");
        navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
        console.log("Position en cours de récup");
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