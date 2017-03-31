#!/bin/bash

jupyter nbextension uninstall --sys-prefix --py           molview_ipywidget
jupyter nbextension install   --sys-prefix --py --symlink molview_ipywidget
jupyter nbextension enable    --sys-prefix --py           molview_ipywidget
jupyter nbextension list

#EOF