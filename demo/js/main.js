window.zi = 0;
var app = angular.module('demo', ['zng.table']);
app.controller('DemoCtrl', function($scope, zngTable){

    $scope.newObjName = "";

    $scope.objData = function(){
        var names = ["Horst", "Hans", "Vivi", "Kate", "Klaas", "Carol", "Peet"],
            data = [];
        angular.forEach(names, function(name) { data.push(objData(name)) });
        return data;
    }();

    $scope.objTable = zngTable.create({
        css: {
            table: [
                'table',
                'table-striped'
            ]
        }
    })
        .addField("Name", "name")
        .addField("Mail", "mail")
        .addField("Web", "web")
        .addField("Visits", "visits")
        .setData($scope.objData)
    ;
//    {
//        styles: {
//            clazz: [
//                'table',
//                'table-striped'
//            ]
//        }
//    }
    $scope.addObjData = function() {
        $scope.objData.push(objData($scope.newObjName));
        $scope.objTable.setData($scope.objData);
        $scope.newObjName = "";
    };
    
    function objData(name) {
        return {
            id: ++window.zi,
            name: name,
            mail: name.toLowerCase()+"@mail.com",
            web: "http://"+name.toLowerCase()+".mywebsite.com",
            visits: Math.abs(Math.floor(Math.sin(window.zi)*100))
        };
    };
});