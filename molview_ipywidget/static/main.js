define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/events',
    'base/js/utils',
    'require',
], function(
    $,
    Jupyter,
    dialog,
    events,
    utils,
    require
) {
    "use strict";

    //==========================================================================
    var load_ipython_extension = function() {
        // do nothing
    };

    //==========================================================================
    return {
        load_ipython_extension : load_ipython_extension
    };
});


define('molview', ["jupyter-js-widgets", "nbextensions/molview_ipywidget/molpad", "require"], function(widgets, MolPad, require) {

    var MolViewView = widgets.DOMWidgetView.extend({

        //======================================================================
        add_button: function(title, label) {
            var $button = $('<div />').appendTo(this.$toolbar);
            $button.attr('title', title);
            $button.addClass("button btn btn-default");
            $button.css("height", "30px");
            $button.css("width","30px");
            $button.css("margin", "2px 1px");

            if(label.indexOf(".svg") !== -1){
                var img_url = require.toUrl("nbextensions/molview_ipywidget/img/"+label);
                $button.css("background-image", "url("+img_url+")");
                $button.css("background-size", "cover");
                $button.css("width","30px");
            }else{
                $button.html(label);
                $button.css("padding", "5");
                $button.css("font", "15px");
            }
            return($button);
        },

        //======================================================================
        add_tool_button: function(title, label, handler) {
            var $button = this.add_button(title, label);
            $button.addClass("tool_button");
            var that = this;
            $button.on("click", function(e){
                    that.$toolbar.find(".tool_button").removeClass('active');
                    $button.addClass("active");
                    handler(that);
            });
            return($button);
        },

        //======================================================================
        add_action_button: function(title, label, handler) {
            var $button = this.add_button(title, label);
            var that = this;
            $button.on("click", function(e){
                    handler(that);
            });
            return($button);
        },

        //======================================================================
        add_toggle_button: function(title, label, handler) {
            var $button = this.add_button(title, label);
            var that = this;
            $button.on("click", function(e){
                    $button.toggleClass("active");
                    var value = $button.hasClass("active");
                    handler(that, value);
            });
            return($button);
        },

        //======================================================================
        add_seperator: function() {
            $('<span />').css('margin', '0 5px').appendTo(this.$toolbar)
        },

        //======================================================================
        export_coords: function(that) {
            that.molpad.setSkeletalDisplay(false);
            $("#skeletal_button").addClass("active");
            var data = that.molpad.getMOL()
            that.model.set('value', data);
            that.touch();
        },

        //======================================================================
        render: function() {
            this.$toolbar =  $('<div />').appendTo(this.$el);

            /* MolPad buttons */
            this.add_tool_button("Single bond", "bond/single.svg", function(t){t.molpad.setTool("bond",{type: MolPad.MP_BOND_SINGLE });}).addClass("active");
            this.add_tool_button("Double bond", "bond/double.svg", function(t){t.molpad.setTool("bond",{type: MolPad.MP_BOND_DOUBLE });});
            this.add_tool_button("Triple bond", "bond/triple.svg", function(t){t.molpad.setTool("bond",{type: MolPad.MP_BOND_TRIPLE });});
            this.add_tool_button("Wedge bond", "bond/wedge.svg", function(t){t.molpad.setTool("bond",{stereo: MolPad.MP_STEREO_UP });});
            this.add_tool_button("Hash bond", "bond/hash.svg", function(t){t.molpad.setTool("bond",{stereo: MolPad.MP_STEREO_DOWN});});

            this.add_seperator();
            this.add_tool_button("Benzene", "frag/benzene.svg", function(t){t.molpad.setTool("fragment",{frag: MolPad.fragments.benzene});});
            this.add_tool_button("Cyclopropane", "frag/cyclopropane.svg", function(t){t.molpad.setTool("fragment",{frag: MolPad.fragments.cyclopropane});});
            this.add_tool_button("Cyclobutane", "frag/cyclobutane.svg", function(t){t.molpad.setTool("fragment", {frag: MolPad.fragments.cyclobutane});});
            this.add_tool_button("Cyclopentane", "frag/cyclopentane.svg", function(t){t.molpad.setTool("fragment",{frag: MolPad.fragments.cyclopentane});});
            this.add_tool_button("Cyclohexane", "frag/cyclohexane.svg", function(t){t.molpad.setTool("fragment",{frag: MolPad.fragments.cyclohexane});});
            this.add_tool_button("Cycloheptane", "frag/cycloheptane.svg", function(t){t.molpad.setTool("fragment",{frag: MolPad.fragments.cycloheptane});});

            this.add_seperator();
            this.add_tool_button("Carbon chain", "action/chain.svg", function(t){t.molpad.setTool("chain", {});});
            this.add_tool_button("Charge +", "e<sup>+</sup>", function(t){t.molpad.setTool("charge", { charge: +1 });});
            this.add_tool_button("Charge -", "e<sup>&minus;</sup>", function(t){t.molpad.setTool("charge", { charge: -1 });});

            this.add_seperator();
            this.add_action_button("Clear all", "action/clear.svg", function(t){t.molpad.clear();});
            this.add_tool_button("Erase", "action/erase.svg", function(t){t.molpad.setTool("erase", {});});
            this.add_action_button("Undo", "action/undo.svg", function(t){t.molpad.undo();});
            this.add_action_button("Redo", "action/redo.svg", function(t){t.molpad.redo();});

            this.add_seperator();
            this.add_tool_button("Drag atoms and bonds", "action/move.svg", function(t){t.molpad.setTool("drag", {});})
            this.add_tool_button("Rectangle selection", "action/rect.svg", function(t){t.molpad.setTool("select", { type: "rect" });});
            this.add_tool_button("Lasso selection", "action/lasso.svg", function(t){t.molpad.setTool("select", { type: "lasso" });});
            this.add_action_button("Center structure", "action/center.svg", function(t){t.molpad.center();});
            this.add_toggle_button("Toggle color mode", "action/color.svg", function(t,val){t.molpad.setColored(val);}).addClass("active");
            this.add_toggle_button("Toggle skeletal formula", "action/skeletal-off.svg", function(t,val){t.molpad.setSkeletalDisplay(!val);}).attr("id", "skeletal_button"); // note inverted val

            this.add_seperator();
            this.add_action_button("Click when done", "Save", this.export_coords).css("width","60px");

            $('<br />').appendTo(this.$toolbar);  //newline
            this.add_tool_button("Carbon", "C", function(t){t.molpad.setTool("atom",{element:"C"});});
            this.add_tool_button("Hydrogen", "H", function(t){t.molpad.setTool("atom",{element:"H"});});
            this.add_tool_button("Nitrogen", "N", function(t){t.molpad.setTool("atom",{element:"N"});});
            this.add_tool_button("Oxygen", "O", function(t){t.molpad.setTool("atom",{element:"O"});});
            this.add_tool_button("Phosphorus", "P", function(t){t.molpad.setTool("atom",{element:"P"});});
            this.add_tool_button("Sulfur", "S", function(t){t.molpad.setTool("atom",{element:"S"});});
            this.add_tool_button("Fluorine", "F", function(t){t.molpad.setTool("atom",{element:"F"});});
            this.add_tool_button("Chlorine", "Cl", function(t){t.molpad.setTool("atom",{element:"Cl"});});
            this.add_tool_button("Bromine", "Br", function(t){t.molpad.setTool("atom",{element:"Br"});});
            this.add_tool_button("Iodine", "I", function(t){t.molpad.setTool("atom",{element:"I"});});

            var $resizable =  $('<div />').appendTo(this.$el);
            $resizable.css("width", "100%");
            $resizable.css("height", "400px");

            var $molpad_canvas =  $('<div />').attr('id', "molpad-canvas-wrapper").appendTo($resizable);

            $molpad_canvas.css("width", "100%");
            $molpad_canvas.css("height", "100%");
            $molpad_canvas.css("border", "1px solid black");


            // make canvas resizable
            var that = this;
            $resizable.resizable({ resize: function(event, ui) {
                    that.molpad.resize();
            }});

            // initial resize after element was added to DOM
            setTimeout(function(){ that.molpad.resize(); }, 1);

            // instanciate MolPad object
            var devicePixelRatio = 1.0;
            this.molpad = new MolPad($molpad_canvas,
                devicePixelRatio, {
                undo: "#action-mp-undo",
                redo: "#action-mp-redo"
            });

            this.molpad.setSkeletalDisplay(true);

        },

    });

    //==========================================================================
    return {
        MolViewView : MolViewView
    };
});