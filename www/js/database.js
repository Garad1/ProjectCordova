class Database{
	//Initialisation de la base de donnée
	constructor(){
		this.db = window.openDatabase("Database", "1.0", "Event", 200000);
        this.db.transaction(populateDB, null , successCB, errorCB);
    
        // Populate the database
        function populateDB(tx) {
            //CREATION DE LA TABLE
            tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, \'LOCALTIME\')), eventType VARCHAR(20), eventName VARCHAR(255), description VARCHAR(2048))', [], function(tx, result){
                console.log(result);
            }, function(tx, err){
                console.log(err);
            });
            
            //TEST INSERTION DONNEES
            /*tx.executeSql("INSERT INTO EVENT (date,eventType,eventName,description) VALUES ('2017-12-12T22:31', 'autre' ,'Yxgxf' , 'hrjbgkiyn')", [], function(tx, result){
                console.log(result);
            }, function(tx, err){
                console.log(err);
            });*/
        }

        // Transaction error callback
        function errorCB(tx, err) {
            console.log("Error processing SQL: "+err);
        }

        // Transaction success callback
        function successCB() {
            console.log("success");
        }
    }

    insertEvent(eventNew){
        //AddEvent.js/html
        this.db.transaction(populateDB, null , successCB, errorCB);
        console.log(eventNew);

        function populateDB(tx) {
            //"INSERT INTO EVENT (date,eventType,eventName,description) VALUES ('2017-12-12T22:31', 'autre' ,'Yxgxf' , 'hrjbgkiyn')"
            //console.log("INSERT INTO EVENT (date,eventType,eventName,description) VALUES (" + eventNew['date'] + ", " + eventNew['eventType'] + ", " + eventNew['eventName'] + ", " + eventNew['description'] + ")");
            tx.executeSql("INSERT INTO EVENT (date,eventType,eventName,description) VALUES ('" + eventNew['date'] + "', '" + eventNew['eventType'] + "', '" + eventNew['eventName'] + "', '" + eventNew['description'] + "')", [], function(tx, result){
                console.log(result);
                document.location.href="index.html";
            }, function(tx, err){
                console.log(err);
            });
            
        }

        // Transaction error callback
        function errorCB(tx, err) {
            console.log("Error processing SQL: "+err);
        }

        // Transaction success callback
        function successCB() {
            console.log("success");
            //document.location.href="index.html";
        }
    }

    selectAllData(callback){
        //index.js/html : pour avoir l'ensemble de tes events quand tu lances l'appli
        this.db.transaction(populateDB, null);

        // Populate the database
        function populateDB(tx) {
            var sql = "SELECT * FROM EVENT";
            console.log(sql);
            tx.executeSql(sql, [], callback, errorCB);
        }

        // Transaction error callback
        function errorCB(tx, err) {
            console.log("Error processing SQL: "+err);
        }

        function successCB() {
            console.log("success");
        }
    }

    selectData(name, type, callback){
        //index.js/html : pour avoir l'ensemble de tes events quand tu lances l'appli
        this.db.transaction(populateDB, null);

        // Populate the database
        function populateDB(tx) {
            // C'est horrible mais nous refactorerons un jour
            if (name == ''){
                if(type == 'all'){
                    var sql = "SELECT * FROM EVENT";
                } else {
                    var sql = "SELECT * FROM EVENT e WHERE e.eventType = '" + type + "';";
                }
            } else {
                if(type == 'all'){
                    var sql = "SELECT * FROM EVENT e WHERE e.eventName LIKE %" + name + "% ;"
                } else {
                    var sql = "SELECT * FROM EVENT e WHERE e.eventType = '" + type + "' AND e.eventName LIKE %" + name + "% ;"
                }
            }
            console.log(sql)
            tx.executeSql(sql, [], callback, errorCB);
        }

        // Transaction error callback
        function errorCB(tx, err) {
            console.log("Error processing SQL: "+err);
        }

        function successCB() {
            console.log("success");
        }
    }
}
