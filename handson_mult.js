(function (Handsontable) {
    var CustomEditor = Handsontable.editors.BaseEditor.prototype.extend();

    // ...rest of the editor code
    CustomEditor.prototype.init = function () {
        // Create detached node, add CSS class and make sure its not visible
        this.select = document.createElement('SELECT');
        this.select.setAttribute('multiple', true);
        Handsontable.Dom.addClass(this.select, 'htCustomEditor');
        this.select.style.display = 'none';

        // Attach node to DOM, by appending it to the container holding the table
        this.instance.rootElement.appendChild(this.select);
    };

    // Create options in prepare() method
    CustomEditor.prototype.prepare = function () {
        // Remember to invoke parent's method
        Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

        var selectOptions = this.cellProperties.selectOptions;
        var options;

        if (typeof selectOptions == 'function') {
            options = this.prepareOptions(selectOptions(this.row,
                this.col, this.prop))
        } else {
            options = this.prepareOptions(selectOptions);
        }
        Handsontable.Dom.empty(this.select);

        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                var optionElement = document.createElement('OPTION');
                optionElement.value = option;
                Handsontable.Dom.fastInnerHTML(optionElement, options[option]);
                this.select.appendChild(optionElement);
            }
        }
    };

    CustomEditor.prototype.prepareOptions = function (optionsToPrepare) {
        var preparedOptions = {};

        if (Array.isArray(optionsToPrepare)) {
            for (var i = 0, len = optionsToPrepare.length; i < len; i++) {
                preparedOptions[optionsToPrepare[i]] = optionsToPrepare[i];
            }
        } else if (typeof optionsToPrepare == 'object') {
            preparedOptions = optionsToPrepare;
        }

        return preparedOptions;
    };

    CustomEditor.prototype.getValue = function () {
        // return this.select.value;
        var result = [];
        var options = this.select && this.select.options;
        var opt;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }

        return result.join(separator);
    };

    CustomEditor.prototype.setValue = function (value) {
        // console.log(value)
        var self = this;
        var array = value.split(separator);
        // console.log(array)
        // array.forEach(function(item) {

        //   self.select.value = item;
        // });
          // self.select.value = array;

        // console.log(self.select.length)
        for (var i = 0; i< self.select.length; i++) {
          self.select.options[i].selected = false;

          array.forEach(function(arrayItem) {
            if (self.select.options[i].value === arrayItem) {
              self.select.options[i].selected = true;
            }
          })
        }

    };

      var onBeforeKeyDown = function(event) {
        var instance = this; // context of listener function is always set to Handsontable.Core instance
        var editor = instance.getActiveEditor();
        var selectedIndex = editor.select.selectedIndex;

        Handsontable.Dom.enableImmediatePropagation(event);

        switch (event.keyCode) {
          case Handsontable.helper.keyCode.ARROW_UP:
            var previousOption = editor.select.options[selectedIndex - 1];

            if (previousOption) { // if previous option exists
              editor.select.value = previousOption.value; // mark it as selected
            }

            event.stopImmediatePropagation(); // prevent EditorManager from processing this event
            event.preventDefault(); // prevent browser from scrolling the page up
            break;

          case Handsontable.helper.keyCode.ARROW_DOWN:
            var nextOption = editor.select.options[selectedIndex + 1];

            if (nextOption) { // if previous option exists
              editor.select.value = nextOption.value; // mark it as selected
            }
            event.stopImmediatePropagation(); // prevent EditorManager from processing this event
            event.preventDefault(); // prevent browser from scrolling the page up
            break;
      }
    }
    

    CustomEditor.prototype.close = function () {
        this.select.style.display = 'none';

        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);

    };



    CustomEditor.prototype.open = function () {
        var width = Handsontable.Dom.outerWidth(this.TD);
        // important - group layout reads together for better performance
        var height = Handsontable.Dom.outerHeight(this.TD);
        var rootOffset = Handsontable.Dom.offset(this.instance.rootElement);
        var tdOffset = Handsontable.Dom.offset(this.TD);
        var editorSection = this.checkEditorSection();
        var cssTransformOffset;

        switch (editorSection) {
            case 'top':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.vertical.clone.wtTable.holder.parentNode);
                break;
            case 'left':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.horizontal.clone.wtTable.holder.parentNode);
                break;
            case 'corner':
                cssTransformOffset = Handsontable.Dom.getCssTransform(this.instance.view.wt.wtScrollbars.corner.clone.wtTable.holder.parentNode);
                break;
        }
        var selectStyle = this.select.style;

        if (cssTransformOffset && cssTransformOffset !== -1) {
            selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
        } else {
            Handsontable.Dom.resetCssTransform(this.select);
        }

        selectStyle.height = height + height_of_multiselect +'px';
        selectStyle.minWidth = width + 'px';
        selectStyle.top = tdOffset.top - rootOffset.top + 'px';
        selectStyle.left = tdOffset.left - rootOffset.left + 'px';
        selectStyle.margin = '0px';
        selectStyle.display = '';

        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
    };

    CustomEditor.prototype.checkEditorSection = function () {
        if (this.row < this.instance.getSettings().fixedRowsTop) {
            if (this.col < this.instance.getSettings().fixedColumnsLeft) {
                return 'corner';
            } else {
                return 'top';
            }
        } else {
            if (this.col < this.instance.getSettings().fixedColumnsLeft) {
                return 'left';
            }
        }
    };
    // Put editor in dedicated namespace
    Handsontable.editors.CustomEditor = CustomEditor;

    // Register alias
    Handsontable.editors.registerEditor('multiselect', CustomEditor);

})(Handsontable);