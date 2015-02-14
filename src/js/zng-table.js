'use strict';

if(typeof zng === 'undefined') {
    var zng = {};
}
zng.table =  {
    ORDER_DIRECTION_ASC: 'tableOrderAsc',
    ORDER_DIRECTION_DESC: 'tableOrderDesc'
};

var table = angular.module('zng.table', []);

table.directive('zngTable', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function(elem, attrs) {
            return attrs.template || '/template/zng-table/table.html'
        },
        scope: {
            table: "=table"
        },
        
        link: function(scope, element) {
            scope.$watch(function() {
                scope.__width = element.prop('offsetWidth');
            }, true);
        },
        
        controller: function($scope) {
            $scope.$watch('table', function(table) {
                //console.log("detected new table");
                $scope.config = $scope.table.config;
            });
            $scope.$watch('table.handler.oos', function(oos) {
//                console.log("detected out of sync");
                $scope.table.handler.update();
            });
            $scope.$watch('table.pagination', function(pagination) {
                if(typeof pagination === 'undefined')return;
//                console.log("detected pagination");
                $scope.table.handler.update();
            }, true);
            $scope.$watch('__width', function(width) {
//                console.log(width);
            });

            $scope.sort = function(index) {
                if(!$scope.table.handler.fields[index].sortable)return;
                $scope.config.sort = {
                    direction: (index===$scope.config.sort.index)
                        ? ($scope.config.sort.direction===zng.table.ORDER_DIRECTION_ASC)
                        ? zng.table.ORDER_DIRECTION_DESC
                        : zng.table.ORDER_DIRECTION_ASC
                        : zng.table.ORDER_DIRECTION_ASC,
                    index: index
                };
                $scope.table.handler.update();
            };

            $scope.styles =  {
                table: function() {
                    var ret = {};
                    if($scope.config.autoWidth) {
                        ret.width = $scope.__width+"px"
                    };
                    return ret;
                }
            };
        }
    };
});


table.service('zngTable', function() {
    
    return {
        create: function(handlerFunc, handlerOptions, cfg) {
            cfg = angular.extend({
                displayHeadline: true,
                autoWidth: true,
                styles: {
                    table: null
                },
                sort: {
                    index: 0,
                    direction: zng.table.ORDER_DIRECTION_ASC
                },
                pagination: {
                }
            }, cfg);

            var ret = {
                config: cfg,
                
                headline: [],
                data: [],
                handler: null,
                
                pagination: angular.extend({
                    max: 0,
                    perPage: 25,
                    page: 1,
                    display: true,
                    perPageOptions: [10, 25, 50, 100],

                    startIndex: function() {
                        return (this.page-1)*this.perPage;
                    },

                    endIndex: function() {
                        var ret = this.startIndex()+(this.perPage-1);
                        var max = this.max-1;
                        if(ret>max)ret = max;
                        return ret;
                    },
                    
                    firstItemNumber: function() {
                        return this.startIndex()+1;
                    },
                    
                    lastItemNumber: function() {
                        return this.endIndex()+1;
                    },
                    
                    offset: function() {
                        return this.startIndex();
                    },
                    
                    changePage: function(direction) {
                        this.page += direction;
                        if(this.page<1)this.page = 1;
                        if(this.page>this.lastPage())this.page = this.lastPage();
                    },
                    
                    lastPage: function() {
                        return Math.ceil(this.max/this.perPage);
                    },
                    
                    changePerPage: function(perPage) {
                        this.page = 1;
                        this.perPage = perPage;
                    }
                }, cfg.pagination),
                
                addField: function(topic, index, sortable) {
                    ret.handler.addField(topic, index, sortable);
                    return this;
                }
            };
            ret.handler = new handlerFunc(ret);
            ret.handler.initialize(handlerOptions);
            return ret;
        }
    };
});

zng.table.handler = {
    AbstractHandler: function(zngTable) {
        if(typeof zngTable === 'undefined') {
            throw 'Please insert zngTable as first argument in handler function.';
        }

        this.oos = true;

        // abstract
        this.initialize = function(options) {};
        this.getHeadline = function() {};
        this.getData = function() {};

        this.setOutOfSync = function() {
            this.oos = true;
        };

        this.synchronize = function() {
            if(this.oos) {
                this.update();
            }
        };

        this.update = function() {
            zngTable.headline = this.getHeadline();
            zngTable.data = this.getData();
            this.oos = false;
        };
    },
    
    BasicHandler: function(zngTable) {
        
        angular.extend(this, new zng.table.handler.AbstractHandler(zngTable));
                
        this.base = null;
        this.fields = [];
        
        this.initialize = function(options) {
            if(angular.isArray(options)) {
                this.setBase(options);
            }
        };
        
        this.setBase = function(base) {
            this.base = base;
            zngTable.pagination.max = this.base.length;
            this.setOutOfSync();
        };

        this.addField = function(topic, index, options) {
            // options is boolean so use it as sortable indicator
            if(options===true||options===false) {
                options = {
                    sortable: options
                };
            }
            options = angular.extend({
                sortable: false,
                sortIndex: null,
                clazz: []
            }, options);
            this.fields.push({
                topic: topic,
                index: index,
                sortable: options.sortable,
                sortIndex: options.sortIndex,
                clazz: options.clazz,
            });
            return this;
        };
        
        this.resetFields = function() {
            this.fields.length = 0;
        };
                
        this.getHeadline = function() {
            var sort = zngTable.config.sort;
            var ret = {
                fields: []
            };
            angular.forEach(this.fields, function(field, index) {
                var clazz = [];
                if(field.sortable) {
                    clazz.push('sortable');
                    if(sort.index===index&&sort.direction===zng.table.ORDER_DIRECTION_ASC) {
                        clazz.push('sort-asc');
                    }
                    if(sort.index===index&&sort.direction===zng.table.ORDER_DIRECTION_DESC) {
                        clazz.push('sort-desc');
                    }
                }
                angular.forEach(field.clazz, function(cl) {
                    clazz.push(cl);
                });
                ret.fields.push({
                    value: field.topic,
                    clazz: clazz
                });
            });
            return ret;
        };
                
        this.getData = function() {
            
            if(this.fields.length===0) {
                return [];
            }
            
            var ret = [],
                that = this,
                pagination = zngTable.pagination,
                sort = zngTable.config.sort;
        
            angular.forEach(this.base, function(row) {
                var tmp = {
                    id: angular.isDefined(row.id) ? row.id : null,
                    fields: []
                };
                angular.forEach(that.fields, function(field) {
                    var idx = (field.sortIndex===null) ? field.index : field.sortIndex;
                    tmp.fields.push({
                        value: row[field.index],
                        order: row[idx],
                        clazz: []
                    });
                });
                ret.push(tmp);
            });
            
            ret = ret.sort(function(a,b) {
                var av = a.fields[sort.index].order,
                    bv = b.fields[sort.index].order,
                    desc = sort.direction === zng.table.ORDER_DIRECTION_DESC;
                return (av < bv) ? (desc ? 1 : -1) : (desc ? -1 : 1);
            });
            
            return ret.slice(pagination.startIndex(), pagination.endIndex());
        };
    }
};


table.directive('zngPagination', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function(elem, attrs) {
            return attrs.template || '/template/zng-table/pagination.html'
        },
        scope: {
            pagination: "=config"
        },
        
        link: function(scope, element) {
        },
        
        controller: function($scope) {
        }
    };
});