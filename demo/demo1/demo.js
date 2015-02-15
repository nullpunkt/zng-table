var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);

app.controller('MyCtrl', ['$scope', 'zngTable', function($scope, zngTable) {
    $scope.table = zngTable.create(zng.table.handler.BasicHandler, [
        ["Jens", "jens@web.de", "", 12],
        ["Jens", "jens@web.de", "", 12]
    ], {styles: {table: ['table', 'table-striped']}})
        .addField("Name", 0)
        .addField("Mail", 1)
        .addField("Web", 2)
        .addField("Visits", 3)
    ;
}]);
