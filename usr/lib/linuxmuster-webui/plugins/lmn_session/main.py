from jadi import component
from aj.auth import PermissionProvider
from aj.plugins.core.api.sidebar import SidebarItemProvider


@component(SidebarItemProvider)
class ItemProvider(SidebarItemProvider):
    def __init__(self, context):
        self.context = context

    def provide(self):
        return [
            {
            'attach': 'category:class',
            'name': _('Session'),
            'icon': 'users',
            'url': '/view/lmn/session',
            'weight': 20,
            },
            {
            'attach': 'category:class',
            'name': _('Print Passwords'),
            'icon': 'print',
            'url': '/view/lm/users/print-passwords',
            'weight': 25,
            }
        ]


@component(PermissionProvider)
class Permissions (PermissionProvider):
    def provide(self):
        return [
            {
                'id': 'lm:users:teachers:write',
                'name': _('Write students'),
                'default': False,
            },
        ]
