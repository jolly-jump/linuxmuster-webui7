// Generated by CoffeeScript 1.12.7
(function() {
  angular.module('lmn.session', ['core', 'lm.common']);

}).call(this);

// Generated by CoffeeScript 1.12.7
(function() {
  angular.module('lmn.session').config(function($routeProvider) {
    return $routeProvider.when('/view/lmn/session', {
      controller: 'LMNSessionController',
      templateUrl: '/lmn_session:resources/partial/session.html'
    });
  });

  angular.module('lmn.session').controller('LMNSessionController', function($scope, $http, $location, $route, $uibModal, gettext, notify, messagebox, pageTitle, lmFileEditor, lmEncodingMap) {
    pageTitle.set(gettext('Session'));
    $scope.currentSession = {
      name: "",
      comment: ""
    };
    $scope.sorts = [
      {
        name: gettext('Login name'),
        fx: function(x) {
          return x.sAMAccountName;
        }
      }, {
        name: gettext('Lastname'),
        fx: function(x) {
          return x.sn;
        }
      }, {
        name: gettext('Firstname'),
        fx: function(x) {
          return x.givenName;
        }
      }, {
        name: gettext('Email'),
        fx: function(x) {
          return x.mail;
        }
      }
    ];
    $scope.fields = {
      sAMAccountName: {
        visible: true,
        name: gettext('Loginname')
      },
      sn: {
        visible: true,
        name: gettext('Lastname')
      },
      givenName: {
        visible: true,
        name: gettext('Firstname')
      },
      examMode: {
        visible: true,
        name: gettext('Exam-Mode')
      },
      wifiaccess: {
        visible: true,
        name: gettext('WifiAccess')
      },
      internetaccess: {
        visible: true,
        name: gettext('Internet')
      },
      intranetaccess: {
        visible: true,
        name: gettext('Intranet')
      },
      webfilter: {
        visible: true,
        name: gettext('Webfilter')
      },
      printing: {
        visible: true,
        name: gettext('Printing')
      }
    };
    $scope.checkboxModel = {
      value1: false,
      value2: true
    };
    $scope.visible = {
      table: 'none',
      sessionname: 'none'
    };
    $scope.info = {
      message: ''
    };
    $scope.killSession = function(username, session) {
      return messagebox.show({
        text: "Delete '" + session + "'?",
        positive: 'Delete',
        negative: 'Cancel'
      }).then(function() {
        return $http.post('/api/lmn/session/sessions', {
          action: 'kill-sessions',
          session: session
        }).then(function(resp) {
          return notify.success(gettext('Session Deleted'));
        });
      });
    };
    $scope.newSession = function(username) {
      return messagebox.prompt(gettext('Session Name'), '---').then(function(msg) {
        if (!msg.value) {
          return;
        }
        return $http.post('/api/lmn/session/sessions', {
          action: 'new-session',
          username: username,
          comment: msg.value
        }).then(function(resp) {
          var sessions;
          $scope["new"] - (sessions = resp.data);
          return notify.success(gettext('Session Created'));
        });
      });
    };
    $scope.showSessions = function(username) {
      return $http.post('/api/lmn/session/sessions', {
        action: 'get-sessions',
        username: username
      }).then(function(resp) {
        $scope.sessions = resp.data;
        return messagebox.show({
          title: gettext('Current Sessions'),
          text: $scope.sessions,
          positive: 'OK'
        });
      });
    };
    $scope.getSessions = function(username) {
      return $http.post('/api/lmn/session/sessions', {
        action: 'get-sessions',
        username: username
      }).then(function(resp) {
        if (resp.data === 0) {
          messagebox.show({
            title: gettext('No Sessions'),
            text: 'No session found! Please create a session first.',
            positive: 'OK'
          });
        }
        return $scope.sessions = resp.data;
      });
    };
    $scope.renameSession = function(username, session, comment) {
      return messagebox.prompt(gettext('Session Name'), comment).then(function(msg) {
        if (!msg.value) {
          return;
        }
        return $http.post('/api/lmn/session/sessions', {
          action: 'rename-session',
          session: session,
          comment: msg.value
        }).then(function(resp) {
          return notify.success(gettext('Session Renamed'));
        });
      });
    };
    $scope.getParticipants = function(username, session) {
      return $http.post('/api/lmn/session/sessions', {
        action: 'get-participants',
        username: username,
        session: session
      }).then(function(resp) {
        $scope.visible.sessionname = 'show';
        if (resp.data === 0) {
          $scope.visible.table = 'none';
          $scope.info.message = 'This session appears to be empty. Start adding users by using the top search bar!';
        } else {
          $scope.info.message = '';
          $scope.visible.table = 'show';
        }
        return $scope.participants = resp.data;
      });
    };
    $scope.findUsers = function(q) {
      return $http.get("/api/lmn/session/user-search?q=" + q).then(function(resp) {
        $scope.users = resp.data;
        return resp.data;
      });
    };
    $scope.$watch('_.addUser', function() {
      if ($scope._.addUser) {
        return messagebox.show({
          title: gettext('No Sessions'),
          text: $scope._.addUser,
          positive: 'OK'
        });
      }
    });
    return $http.get("/api/lmn/session").then(function(resp) {});
  });

}).call(this);
