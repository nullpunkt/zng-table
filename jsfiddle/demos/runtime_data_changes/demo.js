var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);

app.controller('MyCtrl', ['$scope', 'zngTable', function($scope, zngTable) {

    $scope.data = [
        ["Jensx", "jens@web.de", "", 12],
        ["Hanna", "hanna@web.de", "http://www.focusfeatures.com/hanna", 10]
    ];

    $scope.table = zngTable.create(zng.table.handler.BasicHandler, $scope.data, {styles: {table: ['table', 'table-striped']}})
        .addField("Name", 0)
        .addField("Mail", 1)
        .addField("Web", 2)
        .addField("Visits", 3)
    ;

    $scope.name = '';
    $scope.add = function() {
        $scope.data.push([$scope.name, $scope.name+"@mail.com", "", Math.round(Math.random()*100)]);
    }

    $scope.$watch('data', function(data) { $scope.table.handler.setBase(data)}, true);
}]);