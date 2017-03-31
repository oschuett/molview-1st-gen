# -*- coding: utf-8 -*-

# Jupyter Extension points

from .widget import MolViewWidget

def _jupyter_nbextension_paths():
    return [dict(section="notebook", src="./static", dest="molview_ipywidget", require="molview_ipywidget/main")]

    
#EOF