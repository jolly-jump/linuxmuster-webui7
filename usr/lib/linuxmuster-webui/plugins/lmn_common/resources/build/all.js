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
    return customization.plugins.core.hidePersonaLogin = true;
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
      template: '    <pre style="max-height: 300px; overflow-y: scroll" ng:bind="visibleContent"></pre>\n<!--    <div class="form-group">\n       <label translate>Options</label>\n          <br>\n             <span checkbox ng:model="options.autoscroll" text="{{\'Autoscroll\'|translate}}"></span>\n             </div>\n             {{options}}\n             -->',
      link: function($scope, element) {
        var i;
        $scope.content = '';
        i = $interval(function() {
          return $http.get(`/api/lm/log${$scope.path}?offset=${$scope.content.length}`).then(function(resp) {
            var lines;
            console.log($scope);
            $scope.content += resp.data;
            $scope.visibleContent = $scope.content;
            if ($scope.lines) {
              lines = $scope.content.split('\n');
              console.log(lines, lines[lines.length - 1]);
              if (lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
              }
              lines = lines.slice(-$scope.lines);
              console.log(lines);
              $scope.visibleContent = lines.join('\n');
            }
            return $timeout(function() {
              var e;
              e = $(element).find('pre')[0];
              return e.scrollTop = e.scrollHeight;
            });
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

  angular.module('lm.common').controller('lmFileBackupsModalController', function($scope, $uibModalInstance, $route, filesystem, path, encoding) {
    var dir, name;
    $scope.path = path;
    dir = path.substring(0, path.lastIndexOf('/'));
    name = path.substring(path.lastIndexOf('/') + 1);
    filesystem.list(dir).then(function(data) {
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
    $scope.restore = function(backup) {
      return filesystem.read(dir + '/' + backup.name, encoding).then(function(content) {
        return filesystem.write(path, content, encoding).then(function() {
          $uibModalInstance.close();
          return $route.reload();
        });
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


