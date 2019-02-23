angular.module('lm.users').config ($routeProvider) ->
    $routeProvider.when '/view/lm/users/schooladmins',
        controller: 'LMUsersSchooladminsController'
        templateUrl: '/lmn_users:resources/partial/schooladmins.html'

angular.module('lm.users').controller 'LMUsersSchooladminsController', ($scope, $http, $location, $route, $uibModal, gettext, notify, messagebox, pageTitle, lmFileEditor, lmEncodingMap) ->
    pageTitle.set(gettext('Schooladmins'))

    $scope.sorts = [
     {
       name: gettext('Login')
       fx: (x) -> x.sAMAccountName
     }
    ]
    $scope.sort = $scope.sorts[0]
    $scope.paging =
     page: 1
     pageSize: 50


    $http.post('/api/lm/sophomorixUsers/schooladmins',{action: 'get-all'}).then (resp) ->
        $scope.schooladmins = resp.data

    $scope.showInitialPassword = (user) ->
       $http.post('/api/lm/users/password', {users: ( x['sAMAccountName'] for x in user ), action: 'get'}).then (resp) ->
          messagebox.show(title: gettext('Initial password'), text: resp.data, positive: 'OK')


    $scope.setInitialPassword = (user) ->
       $http.post('/api/lm/users/password', {users: ( x['sAMAccountName'] for x in user ), action: 'set-initial'}).then (resp) ->
          notify.success gettext('Initial password set')

    $scope.setRandomPassword = (user) ->
       $http.post('/api/lm/users/password', {users: ( x['sAMAccountName'] for x in user ), action: 'set-random'}).then (resp) ->
          notify.success gettext('Random password set')

    $scope.setCustomPassword = (user) ->
       $uibModal.open(
          templateUrl: '/lmn_users:resources/partial/customPassword.modal.html'
          controller: 'LMNUsersCustomPasswordController'
          size: 'mg'
          resolve:
             users: () -> user
       )

    $scope.deleteSchoolAdmin = (user) ->
        messagebox.show(title: gettext('Delete User'), text: gettext("Delete school-administrator "+ ( x['sAMAccountName'] for x in user ) + '?'), positive: 'Delete', negative: 'Cancel').then () ->
            $http.post('/api/lm/users/change-school-admin', {users: ( x['sAMAccountName'] for x in user ), action: 'delete'}).then (resp) ->
                $route.reload()
                notify.success gettext('User deleted')


    $scope.addSchoolAdmin = () ->
            $uibModal.open(
                templateUrl: '/lmn_users:resources/partial/addAdmin.modal.html'
                controller: 'LMNUsersAddAdminController'
                size: 'mg'
                resolve:
                    role: () -> 'school-admin'
            )

    $scope.userInfo = (user) ->
      console.log (user)
      $uibModal.open(
        templateUrl: '/lmn_users:resources/partial/userDetails.modal.html'
        controller: 'LMNUserDetailsController'
        size: 'lg'
        resolve:
          id: () -> user[0]['sAMAccountName']
          role: () -> 'schooladmins'
          )


    $scope.haveSelection = () ->
        if $scope.schooladmins
            for x in $scope.schooladmins
                if x.selected
                    return true
        return false

    $scope.batchSetInitialPassword = () ->
        $scope.setInitialPassword((x for x in $scope.schooladmins when x.selected))

    $scope.batchSetRandomPassword = () ->
        $scope.setRandomPassword((x for x in $scope.schooladmins when x.selected))

    $scope.batchSetCustomPassword = () ->
        $scope.setCustomPassword((x for x in $scope.schooladmins when x.selected))

    $scope.selectAll = (filter) ->
        if !filter?
            filter = ''
        for schooladmin in $scope.schooladmins
            if filter is undefined
                schooladmin.selected = true
            if schooladmin.sn.toLowerCase().includes filter.toLowerCase()
                schooladmin.selected = true
            if schooladmin.givenName.toLowerCase().includes filter.toLowerCase()
                schooladmin.selected = true
            if schooladmin.sophomorixAdminClass.toLowerCase().includes filter.toLowerCase()
                schooladmin.selected = true
            if schooladmin.sAMAccountName.toLowerCase().includes filter.toLowerCase()
                schooladmin.selected = true




