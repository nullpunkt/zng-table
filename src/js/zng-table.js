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
            
            $scope.sort = function(index) {
                if(!$scope.config.fields[index].isSortable()) {
                    return;
                }
                var toggled = ($scope.config.order.direction==='ASC') ? 'DESC' : 'ASC';
                $scope.config.order.direction = ($scope.config.order.index!==index) ? 'ASC' : toggled;
                $scope.config.order.index = index;
            };
            
            $scope.clazz = {
                th: function(index) {
                    return angular.extend({
                        sortable: $scope.config.fields[index].isSortable(),
                        'sort-asc': $scope.config.order.index===index ? $scope.config.order.direction==='ASC' : false,
                        'sort-desc': $scope.config.order.index===index ? $scope.config.order.direction==='DESC' : false
                    }, $scope.columns[index].clazz);
                }
            };
            
            $scope.$watch('config.settings', function(cfg) {
                console.log("settings changed");
                update();
            }, true);
            $scope.$watch('config.fields', function(cfg) {
                console.log("fields changed");
                update();
            }, true);
            $scope.$watch('config.data', function(cfg) {
                console.log("data changed");
                update();
            }, true);
            $scope.$watch('config.order', function(cfg) {
                if($scope.config.handler !== null) {
                    $scope.config.handler.update();
                }
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
        templateUrl: function(e, attrs) {
            var template = (typeof(attrs.template)!=='undefined') 
                ? attrs.template : '/template/zng-table/pagination.html';
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
    
    var srv = this;
    
    return {
        create: function(settings) {
            var that = this;
            if(!angular.isObject(settings)) {
                settings = {};
            }
            return {
                
                handler: null,
                
                settings: settings,
                
                fields: [],
                data: [],
                
                order: {
                    index: -1,
                    direction: 'ASC'        
                },
                setOrder: function(order) {
                    this.order.index = order;
                    return this;
                },
                addField: function(caption, index, order) {
                    this.fields.push(that.field(caption, index, order));
                    return this;
                },
                setData: function(data) {
                    this.data = data;
                    return this;
                },
                setDataHandler: function(handler) {
                    this.handler = handler;
                    this.handler.setConfig(this);
                    return this;
                }
            };
        },

        field: function(caption, index, order) {
            return {
                caption: caption,
                index: index,
                order: (typeof(order) !== 'undefined') ? order : null,

                isSortable: function() {
                    return this.order!==null;
                },

                toHeading: function() {
                    return {
                        value: caption,
                        clazz: {
                        }
                    };
                },

                toCell: function(rowData) {
                    return {
                        value: rowData[this.index],
                        order: rowData[this.order],
                        clazz: {}
                    };
                }
            };
        },
        
        dataHandler: function() {
            
            return {
                config: null,
                
                update: function() {
                    console.log('hi');
                },
                
                setConfig: function(config) {
                    this.config = config;
                }
            };
        },
        
        basicDataHandler: function(data) {
            return angular.extend(this.dataHandler(), {
                
                data: data,
                
                update: function() {
                    this.config.setData(data);
                    
                    
                    
                    console.log(this.config);
                }
                
//                data: data
                
                
            });
        }
    };
});