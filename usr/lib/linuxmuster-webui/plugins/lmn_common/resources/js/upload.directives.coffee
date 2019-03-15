angular.module('lm.common').directive 'lmDragUpload', ($http, notify, messagebox, filesystem, gettext) ->
    return {
        restrict: 'E'
        scope: {
            uploadpath: '='
        }
        template: '''
            <div    flow-init='{target: "/api/filesystem/upload", chunkSize: 1024 * 1024, singleFile: true}'
                    flow-files-submitted="onUploadBegin($flow)"
                    flow-drag-enter="class='dragdroparea-enter'"
                    flow-drag-leave="class='dragdroparea'"
                    ng-style="style">
                <div class="dragdroparea" flow-drop  ng-class="class" translate>
                    Drag And Drop your file here
                </div>
            </div>
        '''
        link: ($scope) ->
            
            $scope.onUploadBegin = ($flow) -> 
                msg = messagebox.show({progress: true})
                filesystem.startFlowUpload($flow, $scope.uploadpath)
                .then () ->
                    notify.success(gettext('Uploaded'))
                    msg.close()
                , null, (progress) -> 
                    msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %'
    }

angular.module('lm.common').directive 'lmSelectUpload', ($http, notify, messagebox, filesystem, gettext) ->
    return {
        restrict: 'E'
        scope: {
            uploadpath: '='
        }
        template: '''
            <div    flow-init='{target: "/api/filesystem/upload", chunkSize: 1024 * 1024, singleFile: true}'
                    flow-files-submitted="onUploadBegin($flow)"
                    ng-style="style">
                <input type="file" flow-btn/>
            </div>
        '''
        link: ($scope) ->
            
            $scope.onUploadBegin = ($flow) -> 
                msg = messagebox.show({progress: true})
                filesystem.startFlowUpload($flow, $scope.uploadpath)
                .then () ->
                    notify.success(gettext('Uploaded'))
                    msg.close()
                , null, (progress) -> 
                    msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %'
    }
    
angular.module('lm.common').directive 'lmButtonUpload', ($http, notify, messagebox, filesystem, gettext) ->
    return {
        restrict: 'E'
        scope: {
            uploadpath: '='
            btnlabel: '='
        }
        template: '''
            <div    flow-init='{target: "/api/filesystem/upload", chunkSize: 1024 * 1024, singleFile: true}'
                    flow-files-submitted="onUploadBegin($flow)"
                    ng-style="style">
                <span type="file" flow-btn translate>{{btnlabel}}</span>
            </div>
                     
        '''
        link: ($scope) ->
            
            $scope.onUploadBegin = ($flow) -> 
                msg = messagebox.show({progress: true})
                filesystem.startFlowUpload($flow, $scope.uploadpath)
                .then () ->
                    notify.success(gettext('Uploaded'))
                    msg.close()
                , null, (progress) -> 
                    msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %'
    }
    
### Examples in templates :

    <lm-drag-upload uploadpath="'/srv/'"></lm-drag-upload>
    <lm-button-upload uploadpath="'/root/'" btnlabel="'Upload SSH KEYS'"></lm-button-upload>
    <lm-select-upload uploadpath="'/home/toto'"></lm-select-upload>
###
# TODO custom target for upload ( ex: /api/lmn/sophomorixUsers/new-file )
# TODO handle multiple files
# TODO test translations
