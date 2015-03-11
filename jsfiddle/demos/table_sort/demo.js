var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);

app.controller('MyCtrl', ['$scope', 'zngTable', function($scope, zngTable) {

    $scope.data = [
        ["Jens", "jens@web.de", "", 12, 1],
        ["Hanna", "hanna@web.de", "http://www.focusfeatures.com/hanna", 10, 2],
        ["Jones", "jones@gmx.de", "http://www.jon.es", 54, 3],
        ["Hero", "hero@marvel.com", "http://www.marvel.com", 10, 4],
    ];

    $scope.table = zngTable.create(zng.table.handler.BasicHandler, $scope.data, {styles: {table: ['table', 'table-striped']}, sort: {index: 4}})
        .addField("ID", 4, true)
        .addField("Name", 0, true)
        .addField("Mail", 1, true)
        .addField("Web", 2, true)
        .addField("Visits", 3, true)
    ;

}]);