import base64
import ipywidgets
import traitlets


class MolViewWidget(ipywidgets.DOMWidget):
    """Server side python class to be used within the notebook"""

    _view_name = traitlets.Unicode('MolViewView').tag(sync=True)
    _view_module = traitlets.Unicode('molview').tag(sync=True)

    value = traitlets.Unicode().tag(sync=True)

    def __init__(self, *args, **kwargs):
        super(MolViewWidget, self).__init__(*args, **kwargs)

#EOF