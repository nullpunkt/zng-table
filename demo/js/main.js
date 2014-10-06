window.zi = 0;
var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);
app.controller('DemoCtrl', function($scope, zngTable){

    $scope.newObjName = "";

    var objData = function(){
        var names = ["Horst", "Hans", "Vivi", "Kate", "Klaas", "Carol", "Peet", "Sevjin", "Sengir",
                        "Laura", "Fynn", "Samir", "Michael", "Steph", "Yoko", "Lebensform", "Hanna",
                        "Orko", "Tristan", "Isolde", "Ernie", "Bert"],
            data = [];
        angular.forEach(names, function(name) { data.push(toObjData(name)) });
        return data;
    }();

    $scope.objTable = zngTable.create(zng.table.handler.BasicHandler, [objData], {
        styles: {
            table: [
                'table',
                'table-striped'
            ]
        }
    })
        .addField("Name", "name", true)
        .addField("Mail", "mail")
        .addField("Web", "web")
        .addField("Visits", "visits", true)
    ;
    
    // handler = function, zngTable creates instance of handler and passes in "this"
    
//    console.log(zngTable.create().setDataHandler());
//    
//    console.log(zngTable.create().setDataHandler(zngTable.basicDataHandler(objData)
//        .addField("Name", "name")
//        .addField("Name2", "name")
//    ));
    
//    {
//        styles: {
//            clazz: [
//                'table',
//                'table-striped'
//            ]
//        }
//    }

    $scope.addObjData = function() {
        objData.push(toObjData($scope.newObjName));
        $scope.objTable.handler.setBase(objData);
        
//        objData.push(objData($scope.newObjName));
//        $scope.objTable.setData($scope.objData);
        $scope.newObjName = "";
    };
    
    function toObjData(name) {
        return {
            id: ++window.zi,
            name: name,
            mail: name.toLowerCase()+"@mail.com",
            web: "http://"+name.toLowerCase()+".mywebsite.com",
            visits: Math.abs(Math.floor(Math.sin(window.zi)*100))
        };
    };
});