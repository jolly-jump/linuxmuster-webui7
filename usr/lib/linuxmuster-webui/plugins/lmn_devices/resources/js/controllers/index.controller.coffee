angular.module('lm.devices').config ($routeProvider) ->
    $routeProvider.when '/view/lm/devices',
        controller: 'LMDevicesController'
        templateUrl: '/lmn_devices:resources/partial/index.html'


angular.module('lm.devices').controller 'LMDevicesApplyModalController', ($scope, $http, $uibModalInstance, gettext, notify) ->
    $scope.logVisible = true
    $scope.isWorking = true
    $scope.showLog = () ->
        $scope.logVisible = !$scope.logVisible

    $http.get('/api/lm/devices/import').then (resp) ->
        $scope.isWorking = false
        notify.success gettext('Import complete')
    .catch (resp) ->
        notify.error gettext('Import failed'), resp.data.message
        $scope.isWorking = false
        $scope.showLog()

    $scope.close = () ->
        $uibModalInstance.close()



angular.module('lm.devices').controller 'LMDevicesController', ($scope, $http, $uibModal, $route, gettext, notify, pageTitle, lmFileEditor, lmFileBackups) ->
    pageTitle.set(gettext('Devices'))

    $scope.findval = (attr, val) ->
        return (dict) ->
            dict[attr] == val

    $scope.isValidMac = (mac) ->
          regExp = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/
          validMac = regExp.test(mac) && ($scope.devices.filter($scope.findval('mac', mac)).length < 2)
          return validMac

    $scope.isValidIP = (ip) ->
          regExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ ## TODO all IPs allowed, and 010.1.1.1
          validIP = regExp.test(ip) && ($scope.devices.filter($scope.findval('ip', ip)).length < 2)
          return validIP

    $scope.isValidHost =(hostname) ->
        regExp = /^[a-zA-Z0-9\-]+$/
        validHostname = regExp.test(hostname) && ($scope.devices.filter($scope.findval('hostname', hostname)).length < 2)
        return validHostname;

    $scope.isValidRoom =(room) ->
        return $scope.isValidHost(room);

    $scope.isValidRole =(role) -> 
        validRole = ['switch','addc','wlan','staffcomputer','mobile','printer','classroom-teachercomputer','server','iponly','faculty-teachercomputer','voip','byod','classroom-studentcomputer','thinclient','router']
        return validRole.indexOf(role) != -1
        
    $scope.sorts = [
        {
            name: gettext('Room')
            fx: (x) -> x.room
        }
        {
            name: gettext('Group')
            fx: (x) -> x.group
        }
        {
            name: gettext('Hostname')
            fx: (x) -> x.hostname
        }
        {
            name: gettext('MAC')
            fx: (x) -> x.mac
        }
        {
            name: gettext('IP')
            fx: (x) -> x.ip
        }
    ]
    $scope.sort = $scope.sorts[0]
    $scope.paging =
        page: 1
        pageSize: 100

    $scope.stripComments = (value) -> !value.room or value.room[0] != '#'

    $scope.add = () ->
        if $scope.devices.length > 0
            $scope.paging.page = Math.floor(($scope.devices.length - 1) / $scope.paging.pageSize) + 1
        $scope.filter = ''
        $scope.devices.push {
            _isNew: true,
            room: '',
            hostname: '',
            group: '',
            mac: '',
            ip: '',
            sophomorixRole: 'classroom-studentcomputer',
            pxeFlag: '1',
        }

    $scope.duplicate = (device) ->
        $scope.devices.push {
            _isNew: true
            room: device.room,
            hostname: device.hostname,
            group: device.group,
            mac: device.mac,
            ip: device.ip,
            officeKey: device.officeKey,
            windowsKey: device.windowsKey,
            dhcpOptions: device.dhcpOptions,
            sophomorixRole: device.sophomorixRole,
            lmnReserved10: device.lmnReserved10,
            pxeFlag: device.pxeFlag,
            lmnReserved12: device.lmnReserved12,
            lmnReserved13: device.lmnReserved13,
            lmnReserved14: device.lmnReserved14,
            sophomorixComment: device.sophomorixComment,
        }

    $scope.fields = {
        room:
            visible: true
            name: gettext('Room')
        hostname:
            visible: true
            name: gettext('Hostname')
        group:
            visible: true
            name: gettext('Group')
        mac:
            visible: true
            name: gettext('MAC')
        ip:
            visible: true
            name: gettext('IP')
        officeKey:
            visible: false
            name: gettext('Office Key')
        windowsKey:
            visible: false
            name: gettext('Windows Key')
        dhcpOptions:
            visible: false
            name: gettext('DHCP-Options')
        sophomorixRole:
            visible: true
            name: gettext('Sophomorix-Role')
        lmnReserved10:
            visible: false
            name: gettext('LMN-Reserved 10')
        pxeFlag:
            visible: true
            name: gettext('PXE')
        lmnReserved12:
            visible: false
            name: gettext('LMN-Reserved 12')
        lmnReserved13:
            visible: false
            name: gettext('LMN-Reserved 13')
        lmnReserved14:
            visible: false
            name: gettext('LMN-Reserved 14')
        sophomorixComment:
            visible: false
            name: gettext('Sophomorix-Comment')
    }

    $http.get('/api/lm/devices').then (resp) ->
        $scope.devices = resp.data

    $scope.remove = (device) ->
        $scope.devices.remove(device)

    $scope.numErrors = () ->
        return document.getElementsByClassName("has-error").length > 0

    $scope.save = () ->
        if $scope.numErrors()
            notify.error('Required data missing')
            return
        return $http.post('/api/lm/devices', $scope.devices).then () ->
            notify.success gettext('Saved')

    $scope.saveAndImport = () ->
        if $scope.numErrors()
            notify.error('Required data missing')
            return
        $scope.save().then () ->
            $uibModal.open(
                templateUrl: '/lmn_devices:resources/partial/apply.modal.html'
                controller: 'LMDevicesApplyModalController'
                size: 'lg'

                backdrop: 'static'
            )

    $scope.path = '/etc/linuxmuster/sophomorix/default-school/devices.csv'

    $scope.editCSV = () ->
        lmFileEditor.show($scope.path).then () ->
            $route.reload()

    $scope.backups = () ->
        lmFileBackups.show($scope.path)        
