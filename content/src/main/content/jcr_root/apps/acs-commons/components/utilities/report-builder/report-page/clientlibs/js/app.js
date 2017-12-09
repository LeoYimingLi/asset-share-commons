/*
 * #%L
 * ACS AEM Commons Package
 * %%
 * Copyright (C) 2013 Adobe
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
/*global angular: false */
angular.module('acs-commons-report-page-app', ['acsCoral', 'ACS.Commons.notifications'])
    .controller('MainCtrl', ['$scope', '$http', '$timeout', 'NotificationsService',
    function ($scope, $http, $timeout, NotificationsService) {
    	
    	var loadResults = function(params){
			var dfd = jQuery.Deferred();
    		var start = new Date().getTime();
			NotificationsService.running(true);
			$('input,select,coral-select').attr('disabled','disabled');
			$('.report__result').html('');
			$scope.result = {};
			
			$http({
				method: 'GET',
				url: $scope.app.uri+ '?'+ params
			}).success(function (data, status, headers, config) {
				window.location.hash = '#' + params;
				var time = new Date().getTime() - start;
				data.time=time;
				$('.report__result').html(data);
				$('.report__result .pagination__link').click(function(){
					$scope.run($(this).data('page'));
					return false;
				});
				NotificationsService.running(false);
				NotificationsService.add('success', 'SUCCESS', 'Ran report in '+time+'ms!');
				$('input,select,coral-select').removeAttr('disabled');
				dfd.resolve();
			}).error(function (data, status, headers, config) {
				NotificationsService.running(false);
				NotificationsService.add('error', 'ERROR', 'Unable to run report due to error!');
				$('input,select,coral-select').removeAttr('disabled');
				dfd.resolve();
			});
			return dfd.promise();
    	}

        $scope.app = {
		};

        $scope.init = function () {
        	$(document).ready(function(){
        		
        		if(window.location.hash !== '' && window.location.hash !== '#'){
            		var params = window.location.hash.substr(1);
            		loadResults(params).done(function(){
            			var url = new URL(window.location.toString().replace('#','?'));
                		url.searchParams.forEach(function(val,key){
                			$('input[name="'+key+'"],coral-select[name="'+key+'"] select').val(val);
                			$('textarea[name="'+key+'"], coral-select[name="'+key+'"] .coral3-Select-label').html(val);
                		});
            		});
            	}
        	});
        	
        };
        
        $scope.run = function(page) {
        	var params = $('#report--form').serialize()+'&page='+page;
        	loadResults(params);
        };
    }]);


