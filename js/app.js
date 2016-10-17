var app = angular.module('fileStructure', ['directives']);

app.controller('fileController', fileController);
fileController.$inject = ['$scope', '$http'];
function fileController($scope, $http) {
    var json = {};
    $scope.database = {};
    $scope.database.menu = false;
    $scope.database.db_alias = "";
    $scope.param = {};
    $scope.parameter_filter = "DYNAMIC";
    $http.get('http://localhost:9999/publications').success(function(data) {
        $scope.publications = data;

        var modified = {};
        $scope.publications.forEach(function(val) {
            if (val.subject_area !== "" && Object.keys(modified).indexOf(val.subject_area) !== -1) {
                if (val.base_entity !== "" && Object.keys(modified[val.subject_area]).indexOf(val.base_entity) !== -1) {
                    if (Object.keys(modified[val.subject_area][val.base_entity]).indexOf(val.unique_id) !== -1) {
                        modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                    } else {
                        modified[val.subject_area][val.base_entity][val.unique_id] = [];
                        modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                       
                    }
                } else if (val.base_entity !== "") {
                    modified[val.subject_area][val.base_entity] = {
                        'publication_type': val.publication_type,
                        'show': false
                        
                    };
                    if (val.base_entity !== "" && Object.keys(modified[val.subject_area]).indexOf(val.base_entity) !== -1) {
                        if (Object.keys(modified[val.subject_area][val.base_entity]).indexOf(val.unique_id) !== -1) {
                            modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                        } else {
                            modified[val.subject_area][val.base_entity][val.unique_id] = [];
                            modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                        }
                    }
                }
            } else if (val.subject_area !== "") {
                modified[val.subject_area] = {
                    'show': false
                };
                if (val.base_entity !== "" && Object.keys(modified[val.subject_area]).indexOf(val.base_entity) !== -1) {
                    if (Object.keys(modified[val.subject_area][val.base_entity]).indexOf(val.unique_id) !== -1) {
                        modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                    } else {
                        modified[val.subject_area][val.base_entity][val.unique_id] = [];
                        modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                    }
                } else if (val.base_entity !== "") {
                    modified[val.subject_area][val.base_entity] = {
                        'publication_type': val.publication_type,
                        'show': false
                    };
                    if (val.base_entity !== "" && Object.keys(modified[val.subject_area]).indexOf(val.base_entity) !== -1) {
                        if (Object.keys(modified[val.subject_area][val.base_entity]).indexOf(val.unique_id) !== -1) {
                            modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                        } else {
                            modified[val.subject_area][val.base_entity][val.unique_id] = [];
                            modified[val.subject_area][val.base_entity][val.unique_id].push(val);
                        }
                    }
                }
            } else if ((val.subject_area === "" && val.base_entity === "") || (val.publication_type == 'ADVANCED')) {
                if (Object.keys(modified).indexOf('Advanced Publications') !== -1) {
                    modified['Advanced Publications'][val.unique_id] = [val];
                } else {
                    modified['Advanced Publications'] = {};
                    modified['Advanced Publications'][val.unique_id] = [val];
                }
            }
        });
        $scope.fileStructure = modified;
        $scope.keys = [];
        Object.keys(modified).forEach(function(elem) {
            if (elem !== "Advanced Publications") {
                $scope.keys.push(elem);
            }
        });
        $scope.keys.push("Advanced Publications");
    });
    $scope.getKeys = function(fileStructure) {
        return Object.keys(
            fileStructure);
    }
    $scope.toggleStructure = function(val) {

        if (Array.isArray(val)) {
            $scope.fileClick(val[0].guid);
        } else if (typeof val === "object") {
            val.show = val.show ? false : true;
        }
    }
    $scope.parameters = [];
    $scope.fileClick = function(guid) {
        $http.get('http://localhost:9999/publications/' + guid).then(function(res) {
            $scope.param = {};
            $scope.parameter_filter = "DYNAMIC";
            $scope.description = res.data.description;
            $scope.uniqueId = res.data.unique_id;
            $scope.rightPanel=true;
            $scope.parameters = res.data.parameters;
            angular.forEach(res.data.parameters, function(val,key){
                $scope.param[val.unique_id] = val.value;
            });

            $scope.targets = res.data.target_tables;
            $scope.columns = res.data.table_columns;
        });
        // $http.get('http://localhost:9999/databases').then(function(res)
        // {
        //   $scope.databases= res;
        //   console.log(res);
        //   return res;
        // });
        $scope.databases=[{"db_alias":"Single_SANDBOX"},{"db_alias":"ANOTHER_MART"},{"db_alias":"TARGET_DB"},{"db_alias":"PRODUCTION_ENVIRONMENT"},{"db_alias":"IT_DATABASE"}];
    }
    $scope.iconGenerator = function(val) {
        if (Array.isArray(val)) {
            return "custom-icon icon-up small";
        } else if (typeof val === "object") {
            if (val.publication_type === 'EXPRESS_FACT') {
                return "icon-F custom-icon small";
            } else {
                return "icon-plus custom-icon small";
            }


        }
    }
    $scope.activeTabs = [];
    $scope.accordianStatus =[];
    $scope.isOpenTab = function(tab) {
        // check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            // if so, return true
            return true;
        } else {
            // if not, return false
            return false;
        }
    }
    $scope.openTab = function(tab) {
        // check if tab is already open
        if ($scope.isOpenTab(tab)) {
            $scope.accordianStatus[tab] = false;
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            // if it's not, add it!
            $scope.activeTabs.push(tab);
            $scope.accordianStatus[tab] = true;
        }

    }
    $scope.getColumnData = function(){
        return $scope.columns;
    }
    $scope.getCaretStatus = function(tab){
        if($scope.accordianStatus[tab]==true){
            return "fa fa-chevron-down"
        }
        else{
            return "fa fa-chevron-right"
        }
    }
    $scope.change_database = function(database){

        $scope.database.db_alias = database;
        $scope.database.menu = false;
    }
}