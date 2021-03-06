// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lmn.groupmembership', ['core', 'lm.common']);

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  var isValidName,
    indexOf = [].indexOf;

  isValidName = function(name) {
    var regExp, validName;
    regExp = /^[a-z0-9]*$/i;
    validName = regExp.test(name);
    return validName;
  };

  angular.module('lmn.groupmembership').config(function($routeProvider) {
    return $routeProvider.when('/view/lmn/groupmembership', {
      controller: 'LMNGroupMembershipController',
      templateUrl: '/lmn_groupmembership:resources/partial/index.html'
    });
  });

  angular.module('lmn.groupmembership').controller('LMNGroupDetailsController', function($scope, $route, $uibModal, $uibModalInstance, $http, gettext, notify, messagebox, pageTitle, groupType, groupName) {
    $scope.editGroupMembers = function(groupName, groupDetails) {
      return $uibModal.open({
        templateUrl: '/lmn_groupmembership:resources/partial/editMembers.modal.html',
        controller: 'LMNGroupEditController',
        size: 'lg',
        resolve: {
          groupName: function() {
            return groupName;
          },
          groupDetails: function() {
            return groupDetails;
          }
        }
      }).result.then(function(result) {
        if (result.response === 'refresh') {
          return $scope.getGroupDetails([groupType, groupName]);
        }
      });
    };
    $scope.killProject = function(project) {
      return messagebox.show({
        text: `Do you really want to delete '${project}'? This can't be undone!`,
        positive: 'Delete',
        negative: 'Cancel'
      }).then(function() {
        var msg;
        msg = messagebox.show({
          progress: true
        });
        return $http.post('/api/lmn/groupmembership', {
          action: 'kill-project',
          username: $scope.identity.user,
          project: project
        }).then(function(resp) {
          //console.log (resp.data)
          if (resp['data'][0] === 'ERROR') {
            notify.error(resp['data'][1]);
          }
          if (resp['data'][0] === 'LOG') {
            notify.success(gettext(resp['data'][1]));
            return $uibModalInstance.close({
              response: 'refresh'
            });
          }
        }).finally(function() {
          return msg.close();
        });
      });
    };
    $scope.getGroupDetails = function(group) {
      groupType = group[0];
      groupName = group[1];
      return $http.post('/api/lmn/groupmembership/details', {
        action: 'get-specified',
        groupType: groupType,
        groupName: groupName
      }).then(function(resp) {
        $scope.groupName = groupName;
        return $scope.groupDetails = resp.data;
      });
    };
    $scope.groupType = groupType;
    $scope.getGroupDetails([groupType, groupName]);
    return $scope.close = function() {
      return $uibModalInstance.dismiss();
    };
  });

  angular.module('lmn.groupmembership').controller('LMNGroupEditController', function($scope, $route, $uibModal, $uibModalInstance, $http, gettext, notify, messagebox, pageTitle, groupName, groupDetails) {
    var groupDN;
    $scope.sorts = [
      {
        name: gettext('Given name'),
        fx: function(x) {
          return x.givenName;
        }
      },
      {
        name: gettext('Name'),
        fx: function(x) {
          return x.sn;
        }
      },
      {
        name: gettext('Membership'),
        fx: function(x) {
          return x.membership;
        }
      },
      {
        name: gettext('Class'),
        fx: function(x) {
          return x.sophomorixAdminClass;
        }
      }
    ];
    $scope.sort = $scope.sorts[2];
    $scope.groupName = groupName;
    $scope.sortReverse = true;
    $scope.checkInverse = function(sort, currentSort) {
      if (sort === currentSort) {
        return $scope.sortReverse = !$scope.sortReverse;
      } else {
        return $scope.sortReverse = false;
      }
    };
    $scope.setMembers = function(members) {
      var msg;
      msg = messagebox.show({
        progress: true
      });
      return $http.post('/api/lmn/groupmembership/details', {
        action: 'set-members',
        username: $scope.identity.user,
        members: members,
        groupName: groupName
      }).then(function(resp) {
        if (resp['data'][0] === 'ERROR') {
          notify.error(resp['data'][1]);
        }
        if (resp['data'][0] === 'LOG') {
          notify.success(gettext(resp['data'][1]));
          return $uibModalInstance.close({
            response: 'refresh'
          });
        }
      //$scope.resetClass()
      }).finally(function() {
        return msg.close();
      });
    };
    groupDN = groupDetails[groupName]['dn'];
    return $http.post('/api/lm/sophomorixUsers/students', {
      action: 'get-all'
    }).then(function(resp) {
      var i, len, student, students;
      students = resp.data;
      $scope.students = students;
      for (i = 0, len = students.length; i < len; i++) {
        student = students[i];
        if (indexOf.call(student['memberOf'], groupDN) >= 0) {
          student['membership'] = true;
        } else {
          student['membership'] = false;
        }
      }
      return $scope.close = function() {
        return $uibModalInstance.dismiss();
      };
    });
  });

  angular.module('lmn.groupmembership').controller('LMNGroupMembershipController', function($scope, $http, $uibModal, gettext, notify, pageTitle, messagebox) {
    pageTitle.set(gettext('Group Membership'));
    $scope.types = {
      schoolclass: {
        typename: gettext('Schoolclass'),
        name: gettext('Groupname'),
        checkbox: true,
        type: 'schoolclass'
      },
      printergroup: {
        typename: gettext('Printer'),
        checkbox: true,
        type: 'printergroup'
      },
      project: {
        typename: gettext('Projects'),
        checkbox: true,
        type: 'project'
      }
    };
    $scope.sorts = [
      {
        name: gettext('Groupname'),
        fx: function(x) {
          return x.groupname;
        }
      },
      {
        name: gettext('Membership'),
        fx: function(x) {
          return x.membership;
        }
      }
    ];
    $scope.sort = $scope.sorts[0];
    $scope.sortReverse = false;
    $scope.paging = {
      page: 1,
      pageSize: 20
    };
    $scope.isActive = function(group) {
      if (group.type === 'printergroup') {
        if ($scope.types.printergroup.checkbox === true) {
          return true;
        }
      }
      if (group.type === 'schoolclass') {
        if ($scope.types.schoolclass.checkbox === true) {
          return true;
        }
      }
      if (group.type === 'project') {
        if ($scope.types.schoolclass.checkbox === true) {
          return true;
        }
      }
      return false;
    };
    $scope.checkInverse = function(sort, currentSort) {
      if (sort === currentSort) {
        return $scope.sortReverse = !$scope.sortReverse;
      } else {
        return $scope.sortReverse = false;
      }
    };
    $scope.resetClass = function() {
      var group, i, len, ref, result;
      // reset html class back (remove changed) so its not highlighted anymore
      result = document.getElementsByClassName("changed");
      while (result.length) {
        result[0].className = result[0].className.replace(/(?:^|\s)changed(?!\S)/g, '');
      }
      ref = $scope.groups;
      // reset $scope.group attribute back not not changed so an additional enroll will not set these groups again
      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        group['changed'] = false;
      }
    };
    $scope.groupChanged = function(item) {
      var group, i, len, ref;
      ref = $scope.groups;
      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        if (group['groupname'] === item) {
          if (group['changed'] === false) {
            group['changed'] = true;
          } else {
            group['changed'] = false;
          }
        }
      }
      // set html class
      if (document.getElementById(item).className.match(/(?:^|\s)changed(?!\S)/)) {
        return document.getElementById(item).className = document.getElementById(item).className.replace(/(?:^|\s)changed(?!\S)/g, '');
      } else {
        return document.getElementById(item).className += " changed";
      }
    };
    $scope.getGroups = function(username) {
      return $http.post('/api/lmn/groupmembership', {
        action: 'list-groups',
        username: username
      }).then(function(resp) {
        var group, i, j, k, len, len1, len2, printergroupCount, projectCount, ref, ref1, ref2, schoolclassCount;
        $scope.groups = resp.data;
        schoolclassCount = 0;
        printergroupCount = 0;
        projectCount = 0;
        ref = $scope.groups;
        for (i = 0, len = ref.length; i < len; i++) {
          group = ref[i];
          if (group.type === 'schoolclass') {
            schoolclassCount = schoolclassCount + 1;
          }
        }
        ref1 = $scope.groups;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          group = ref1[j];
          if (group.type === 'printergroup') {
            printergroupCount = printergroupCount + 1;
          }
        }
        ref2 = $scope.groups;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          group = ref2[k];
          if (group.type === 'project') {
            projectCount = projectCount + 1;
          }
        }
        $scope.schoolclassCount = schoolclassCount;
        $scope.printergroupCount = printergroupCount;
        return $scope.projectCount = projectCount;
      });
    };
    $scope.setGroups = function(groups) {
      return $http.post('/api/lmn/groupmembership', {
        action: 'set-groups',
        username: $scope.identity.user,
        groups: groups
      }).then(function(resp) {
        if (resp['data'][0] === 'ERROR') {
          notify.error(resp['data'][1]);
        }
        if (resp['data'][0] === 'LOG') {
          notify.success(gettext(resp['data'][1]));
          $scope.resetClass();
        }
        if (resp.data === 0) {
          return notify.success(gettext("Nothing changed"));
        }
      });
    };
    $scope.createProject = function() {
      return messagebox.prompt(gettext('Project Name'), '').then(function(msg) {
        if (!msg.value) {
          return;
        }
        if (!isValidName(msg.value)) {
          notify.error(gettext('Not a valid name! Only alphanumeric characters are allowed!'));
          return;
        }
        return $http.post('/api/lmn/groupmembership', {
          action: 'create-project',
          username: $scope.identity.user,
          project: msg.value
        }).then(function(resp) {
          notify.success(gettext('Project Created'));
          return $scope.getGroups($scope.identity.user);
        });
      });
    };
    $scope.showGroupDetails = function(index, groupType, groupName) {
      return $uibModal.open({
        templateUrl: '/lmn_groupmembership:resources/partial/groupDetails.modal.html',
        controller: 'LMNGroupDetailsController',
        size: 'lg',
        resolve: {
          groupType: function() {
            return groupType;
          },
          groupName: function() {
            return groupName;
          }
        }
      }).result.then(function(result) {
        if (result.response === 'refresh') {
          return $scope.getGroups($scope.identity.user);
        }
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
      // $scope.identity.user = 'hulk'
      $scope.getGroups($scope.identity.user);
    });
  });

}).call(this);

