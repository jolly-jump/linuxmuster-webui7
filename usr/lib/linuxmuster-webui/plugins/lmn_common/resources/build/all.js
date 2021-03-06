// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lm.common', ['core', 'ajenti.ace', 'ajenti.filesystem']);

  angular.module('lm.common').run(function(customization) {
    customization.plugins.core.startupURL = '/view/lmn/landingpage';
    // customization.plugins.core.bodyClass = 'customized'
    customization.plugins.core.title = ' ';
    customization.plugins.core.faviconURL = '/resources/lmn_common/resources/img/favicon.png';
    customization.plugins.core.logoURL = '/resources/lmn_common/resources/img/logo-text-white.png';
    customization.plugins.core.bigLogoURL = '/resources/lmn_common/resources/img/logo-full.png';
    customization.plugins.core.hidePersonaLogin = true;
    return customization.plugins.core.enableMixpanel = false;
  });

  angular.module('lm.common').constant('lmEncodingMap', {
    '': 'utf-8',
    'ascii': 'ascii',
    'utf8': 'utf-8',
    '8859-1': 'ISO8859-1',
    '8859-15': 'ISO8859-15',
    'win1252': 'cp1252'
  });

  $(function() {
    return $('body').addClass('customized');
  });

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lm.common').directive('lmLog', function($http, $interval, $timeout) {
    return {
      restrict: 'E',
      scope: {
        path: '=',
        lines: '=?'
      },
      template: '<pre style="max-height: 300px; overflow-y: scroll" ng:bind="visibleContent"></pre>\n<div class="form-group">\n   <label translate>Options</label>\n      <br>\n         <span checkbox ng:model="autoscroll" text="{{\'Autoscroll\'|translate}}"></span>\n         </div>\n         {{options}}\n         ',
      link: function($scope, element) {
        var i;
        $scope.content = '';
        $scope.autoscroll = true;
        i = $interval(function() {
          return $http.get(`/api/lm/log${$scope.path}?offset=${$scope.content.length}`).then(function(resp) {
            var lines;
            // console.log ($scope)
            $scope.content += resp.data;
            $scope.visibleContent = $scope.content;
            if ($scope.lines) {
              lines = $scope.content.split('\n');
              // console.log lines, lines[lines.length - 1]
              if (lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
              }
              lines = lines.slice(-$scope.lines);
              // console.log lines
              $scope.visibleContent = lines.join('\n');
            }
            if ($scope.autoscroll) {
              return $timeout(function() {
                var e;
                e = $(element).find('pre')[0];
                return e.scrollTop = e.scrollHeight;
              });
            }
          });
        }, 1000);
        return $scope.$on('$destroy', function() {
          return $interval.cancel(i);
        });
      }
    };
  });

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lm.common').directive('lmDragUpload', function($http, notify, messagebox, filesystem, gettext) {
    return {
      restrict: 'E',
      scope: {
        uploadpath: '='
      },
      repalce: true,
      template: function(attrs) {
        var target;
        if (!attrs.target) {
          target = "'/api/filesystem/upload'";
        } else {
          target = attrs.target;
        }
        return `<div> <div    flow-init="{target: ${target}, chunkSize: 1024 * 1024, singleFile: true}" flow-files-submitted="onUploadBegin($flow)" flow-drag-enter="class='dragdroparea-enter'" flow-drag-leave="class='dragdroparea'" ng-style="style"> <div class="dragdroparea" flow-drop  ng-class="class" translate> Drag And Drop your file here </div> </div> </div>`;
      },
      link: function($scope, attrs) {
        return $scope.onUploadBegin = function($flow) {
          var msg;
          msg = messagebox.show({
            progress: true
          });
          return filesystem.startFlowUpload($flow, $scope.uploadpath).then(function() {
            notify.success(gettext('Uploaded'));
            return msg.close();
          }, null, function(progress) {
            return msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %';
          });
        };
      }
    };
  });

  angular.module('lm.common').directive('lmSelectUpload', function($http, notify, messagebox, filesystem, gettext) {
    return {
      restrict: 'E',
      scope: {
        uploadpath: '='
      },
      template: function(attrs) {
        var target;
        if (!attrs.target) {
          target = "'/api/filesystem/upload'";
        } else {
          target = attrs.target;
        }
        return `<div> <div    flow-init="{target: ${target}, chunkSize: 1024 * 1024, singleFile: true}" flow-files-submitted="onUploadBegin($flow)" ng-style="style"> <input type="file" flow-btn/> </div> </div>`;
      },
      link: function($scope) {
        return $scope.onUploadBegin = function($flow) {
          var msg;
          msg = messagebox.show({
            progress: true
          });
          return filesystem.startFlowUpload($flow, $scope.uploadpath).then(function() {
            notify.success(gettext('Uploaded'));
            return msg.close();
          }, null, function(progress) {
            return msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %';
          });
        };
      }
    };
  });

  angular.module('lm.common').directive('lmButtonUpload', function($http, notify, messagebox, filesystem, gettext) {
    return {
      restrict: 'E',
      scope: {
        uploadpath: '=',
        btnlabel: '='
      },
      template: function(attrs) {
        var target;
        if (!attrs.target) {
          target = "'/api/filesystem/upload'";
        } else {
          target = attrs.target;
        }
        return `<div> <div    flow-init="{target: ${target}, chunkSize: 1024 * 1024, singleFile: true}" flow-files-submitted="onUploadBegin($flow)" ng-style="style"> <span type="file" flow-btn translate>{{btnlabel}}</span> </div> </div>`;
      },
      link: function($scope) {
        return $scope.onUploadBegin = function($flow) {
          var msg;
          msg = messagebox.show({
            progress: true
          });
          return filesystem.startFlowUpload($flow, $scope.uploadpath).then(function() {
            notify.success(gettext('Uploaded'));
            return msg.close();
          }, null, function(progress) {
            return msg.messagebox.title = 'Uploading: ' + Math.floor(100 * progress) + ' %';
          });
        };
      }
    };
  });

  /* Examples in templates :

<lm-drag-upload uploadpath="'/srv/'"></lm-drag-upload>
<lm-button-upload uploadpath="'/root/'" btnlabel="'Upload SSH KEYS'"></lm-button-upload>
<lm-select-upload uploadpath="'/home/toto'"></lm-select-upload>
*/
// TODO handle multiple files
// TODO test translations

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lm.common').service('lmFileEditor', function($uibModal) {
    this.show = function(path, encoding) {
      return $uibModal.open({
        templateUrl: '/lmn_common:resources/js/lmFileEditor.modal.html',
        controller: 'lmFileEditorModalController',
        size: 'lg',
        resolve: {
          path: function() {
            return path;
          },
          encoding: function() {
            return encoding;
          }
        }
      }).result;
    };
    return this;
  });

  angular.module('lm.common').controller('lmFileEditorModalController', function($scope, $uibModalInstance, $timeout, filesystem, path, encoding) {
    $scope.path = path;
    filesystem.read(path, encoding).then(function(data) {
      return $scope.content = data;
    });
    $scope.save = function() {
      return filesystem.write(path, $scope.content, encoding).then(function() {
        return $uibModalInstance.close($scope.content);
      });
    };
    $scope.cancel = function() {
      return $uibModalInstance.dismiss();
    };
    $timeout(function() {
      var dropZone;
      dropZone = $('.lm-file-editor-drop-target')[0];
      dropZone.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        return e.dataTransfer.dropEffect = 'copy';
      });
      return dropZone.addEventListener('drop', function(e) {
        var file, files, i, len, results;
        e.stopPropagation();
        e.preventDefault();
        files = e.dataTransfer.files;
        results = [];
        for (i = 0, len = files.length; i < len; i++) {
          file = files[i];
          results.push((function(file) {
            var reader;
            reader = new FileReader();
            reader.onload = function(e) {
              return $scope.$apply(function() {
                return $scope.content = e.target.result;
              });
            };
            return reader.readAsText(file, encoding);
          })(file));
        }
        return results;
      });
    });
    return $scope.download = function() {
      var tokens;
      tokens = path.split('/');
      return filesystem.downloadBlob($scope.content, 'text/csv', tokens[tokens.length - 1]);
    };
  });

}).call(this);

// Generated by CoffeeScript 2.3.1
(function() {
  angular.module('lm.common').service('lmFileBackups', function($uibModal) {
    this.show = function(path, encoding) {
      return $uibModal.open({
        templateUrl: '/lmn_common:resources/js/lmFileBackups.modal.html',
        controller: 'lmFileBackupsModalController',
        resolve: {
          path: function() {
            return path;
          },
          encoding: function() {
            return encoding;
          }
        }
      }).result;
    };
    return this;
  });

  angular.module('lm.common').controller('lmFileBackupsModalController', function($scope, $uibModalInstance, $route, $http, gettext, notify, filesystem, path, encoding, messagebox, lmFileBackups) {
    var dir, name;
    $scope.path = path;
    dir = path.substring(0, path.lastIndexOf('/'));
    name = path.substring(path.lastIndexOf('/') + 1);
    $scope.loadBackupFiles = function() {
      return filesystem.list(dir).then(function(data) {
        var i, item, len, ref, results, tokens;
        $scope.backups = [];
        ref = data.items;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.name.startsWith('.' + name + '.bak.')) {
            tokens = item.name.split('.');
            results.push($scope.backups.push({
              name: item.name,
              date: new Date(1000 * parseInt(tokens[tokens.length - 1]))
            }));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    };
    $scope.loadBackupFiles();
    $scope.restore = function(backup) {
      return filesystem.read(dir + '/' + backup.name, encoding).then(function(content) {
        return filesystem.write(path, content, encoding).then(function() {
          $scope.onlyremove(backup);
          notify.success('Backup file restored');
          $uibModalInstance.close();
          return $route.reload();
        });
      });
    };
    $scope.findbackup = function(name) {
      return function(dict) {
        return dict.name === name;
      };
    };
    $scope.onlyremove = function(backup) {
      return $http.post('/api/lm/remove-file', {
        filepath: backup.name
      }).then(function(resp) {
        var pos;
        pos = $scope.findIndex($scope.findbackup(backupname));
        return delete $scope.backups[pos];
      });
    };
    $scope.removeUI = function(backup) {
      var content;
      $uibModalInstance.close();
      content = gettext('Do you really want to delete') + backup.name + ' ?';
      return messagebox.show({
        title: gettext('Confirmation'),
        text: content,
        positive: 'OK',
        negative: gettext('Cancel')
      }).then(function() {
        $scope.onlyremove(backup);
        notify.success('Backup file removed');
        return lmFileBackups.show($scope.path);
      });
    };
    return $scope.cancel = function() {
      return $uibModalInstance.dismiss();
    };
  });

}).call(this);

'use strict';

angular.module('lm.common').directive('messageboxContainer2', function (messagebox) {
    return {
        restrict: 'E',
        template: '\n            <dialog "ng:show="message.visible" style="z-index: 1050" ng:repeat="message in messagebox.messages">\n                <div class="modal-header">\n                    <h4>{{message.title|translate}}</h4>\n                </div>\n                <div class="modal-body" ng:class="{scrollable: message.scrollable}">\n                    <div ng:show="message.progress">\n                        <progress-spinner></progress-spinner>\n                    </div>\n                    {{message.text|translate}}\n                    <ng:include ng:if="message.template" src="message.template"></ng:include>\n                    <div ng:show="message.prompt">\n                        <label>{{message.prompt}}</label>\n                        <input type="text" ng:model="message.value" ng:enter="doPositive(message)" class="form-control" autofocus />\n                    </div>\n                </div>\n                <div class="modal-footer">\n                    <a ng:click="doPositive(message)" ng:show="message.positive" class="positive btn btn-default btn-flat">{{message.positive|translate}}</a>\n                    <a ng:click="doNegative(message)" ng:show="message.negative" class="negative btn btn-default btn-flat">{{message.negative|translate}}</a>\n                </div>\n            </dialog>',
        link: function link($scope, element, attrs) {
            $scope.messagebox = messagebox;

            $scope.doPositive = function (msg) {
                msg.q.resolve(msg);
                messagebox.close(msg);
            };

            $scope.doNegative = function (msg) {
                msg.q.reject(msg);
                messagebox.close(msg);
            };
        }
    };
});


