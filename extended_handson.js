(function(Handsontable) {
    var SelectEditor = Handsontable.editors.BaseEditor.prototype.extend();

    SelectEditor.prototype.init = function() {
        // Create detached node, add CSS class and make sure its not visible
        this.select = document.createElement('SELECT');
        Handsontable.Dom.addClass(this.select, 'htSelectEditor');
        this.select.style.display = 'none';

        // Attach node to DOM, by appending it to the container holding the table
        this.instance.rootElement.appendChild(this.select);
    };
    // Create options in prepare() method
    SelectEditor.prototype.prepare = function() {
        // Remember to invoke parent's method
        Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);
        this.isMultiple = !!this.cellProperties.multiple;
        if (this.isMultiple) this.select.multiple = true;
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
    SelectEditor.prototype.prepareOptions = function(optionsToPrepare) {
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
    SelectEditor.prototype.getValue = function() {
        var result = [];
        var options = this.select && this.select.options;
        var opt;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }

        return result.join();
    };

    SelectEditor.prototype.setValue = function(value) {
        this.select.value = value;
    };

    SelectEditor.prototype.open = function() {
        var width = Handsontable.Dom.outerWidth(this.TD);
        // important - group layout reads together for better performance
        var height = Handsontable.Dom.outerHeight(this.TD);
        var rootOffset = Handsontable.Dom.offset(this.instance.rootElement);
        var tdOffset = Handsontable.Dom.offset(this.TD);
        var editorSection = this.checkEditorSection();
        var cssTransformOffset;

        if (this.select && this.select.options && this.isMultiple) {
            var height = 0;
            for (var i = 0; i < this.select.options.length - 1; i++) {
                height += Handsontable.Dom.outerHeight(this.TD);
            }
        }

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

        selectStyle.height = height + 'px';
        selectStyle.minWidth = width + 'px';
        selectStyle.top = tdOffset.top - rootOffset.top + 'px';
        selectStyle.left = tdOffset.left - rootOffset.left + 'px';
        selectStyle.margin = '0px';
        selectStyle.display = '';

    };

    SelectEditor.prototype.checkEditorSection = function() {
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

    SelectEditor.prototype.close = function() {
        this.select.style.display = 'none';
    };

    Handsontable.editors.registerEditor('dvirH', SelectEditor);

})(Handsontable);