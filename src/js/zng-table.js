'use strict';

var table = angular.module('zng.table', []);

table.directive('zngTable', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/template/zng-table/table.html',
        scope: {
            config: "="
        },
        controller: function($scope) {

            $scope.columns = {};
            $scope.rows = {};

            $scope.$watch('config', function(cfg) {
                update();
            }, true);
            function update() {
                var columns = [],
                    rows = [],
                    fields = $scope.config.fields,
                    data = $scope.config.data;
                angular.forEach(fields, function(field) {
                    columns.push(field.toHeading());
                });
                angular.forEach(data, function(rowData) {
                    var row = {
                        id: null,
                        fields: []
                    };
                    angular.forEach(fields, function(field) {
                        row.fields.push(field.toCell(rowData));
                    });
                    rows.push(row);
                });
                $scope.columns = columns;
                $scope.rows = rows;
            }
        }
    };
});

table.directive('zngTablePagination', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attrs) {
            var template = (typeof(attrs.template)!=='undefined') ? attrs.template : '/template/zng-table/pagination.html';
            return template;
        },
        scope: {
            config: "="
        },
        controller: function($scope) {
        }
    }
});

table.service('zngTable', function() {
    return {
        create: function(settings) {
            console.log(['hi', settings]);
            var that = this;
            if(!angular.isObject(settings)) {
                settings = {};
            }
            return function() {
                return {
                    settings: settings,
                    fields: [],
                    data: [],
                    addField: function(caption, index) {
                        this.fields.push(that.field(caption, index));
                        return this;
                    },
                    setData: function(data) {
                        this.data = data;
                        return this;
                    }
                };
                return ret;
            }();
        },

        field: function(caption, index) {

            var _caption = caption;
            var _index = index;

            return {
                caption: function() {
                    return _caption;
                },
                index: function() {
                    return _index;
                },
                toHeading: function() {
                    return {
                        value: _caption,
                        class: {}
                    }
                },
                toCell: function(rowData) {
                    return {
                        value: rowData[_index],
                        class: {}
                    };
                }

            }
        }
    };
});