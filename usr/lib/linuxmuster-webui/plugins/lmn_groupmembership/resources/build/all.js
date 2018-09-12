// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lmn.groupmembership', ['core', 'lm.common']);

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lmn.groupmembership').config(function($routeProvider) {
    return $routeProvider.when('/view/lmn/groupmembership', {
      controller: 'LMNGroupMembershipController',
      templateUrl: '/lmn_groupmembership:resources/partial/index.html'
    });
  });

  angular.module('lmn.groupmembership').controller('LMNGroupMembershipController', function($scope, $http, $uibModal, gettext, notify, pageTitle) {
    pageTitle.set(gettext('Settings'));
    $scope.getGroups = function(username) {
      return $http.post('/api/lmn/groupmembership', {
        action: 'list-groups',
        username: username
      }).then(function(resp) {
        return $scope.groups = resp.data;
      });
    };
    $scope.setGroups = function(groups) {
      return $http.post('/api/lmn/groupmembership', {
        action: 'set-groups',
        username: $scope.identity.user,
        groups: groups
      }).then(function(resp) {
        return notify.success(gettext('Classes enrolled'));
      });
    };
    return $scope.$watch('identity.user', function() {
      if ($scope.identity.user === void 0) {
        return;
      }
      if ($scope.identity.user === null) {
        return;
      }
      if ($scope.identity.user === 'root') {
        return;
      }
      $scope.getGroups($scope.identity.user);
    });
  });

}).call(this);

