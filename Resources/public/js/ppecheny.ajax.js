var PpechenyAjax = (function() {

    var defaults = {
        ajaxFormClass: 'ppecheny-ajax-form',
        ajaxFormBtnClass: 'ppecheny-ajax-form-btn',
        shortFormClass: 'ppecheny-short-form',
        canBeResetedClass: 'can-be-reseted',
        select2Class: 'ppecheny-select2',
        textInputClass: 'ppecheny-text',
        assetsDir: '',
        loadingImgPath: ''
    };

    function PpechenyAjax() {
        this.params = {};
    };

    PpechenyAjax.prototype.init = function(options)
    {
        this.params = $.extend(defaults, options);

        this.initAjaxForm();
    }

    /**
     * Blocks content
     *
     * @param {Object} el
     * @param {Object} centerY
     */
    PpechenyAjax.prototype.blockUI = function(el, centerY) {
        var selfClass = this;

        if (el.height() <= 400) {
            centerY = true;
        }
        el.block({
            message: '<img src="' + selfClass.params.loadingImgPath + '" align="">',
            centerY: centerY != undefined ? centerY : true,
            css: {
                top: '10%',
                border: 'none',
                padding: '2px',
                backgroundColor: 'none'
            },
            overlayCSS: {
                backgroundColor: '#FFF',
                opacity: 0.5,
                cursor: 'wait'
            }
        });
    };

    /**
     * UnBlocks content
     *
     * @param {Object} el
     */
    PpechenyAjax.prototype.unblockUI = function(el) {
        el.css('position', '');
        el.css('zoom', '');
        el.unblock();
    };

    /**
     * Resets form fields with class {canBeResetedClass}
     *
     * @param {Object} form
     */
    PpechenyAjax.prototype.resetForm = function(form)
    {
        var selfClass = this;
        form.find('.' + selfClass.params.canBeResetedClass).each(function(index) {
            if ($(this).hasClass(selfClass.params.select2Class)) {
                $(this).select2('data', null);
            }

            if ($(this).hasClass(selfClass.params.daterangeStartClass) || $(this).hasClass(selfClass.params.daterangeEndClass) || $(this).hasClass(selfClass.params.daterangeTextClass)) {
                $(this).val('');
            }

            if ($(this).hasClass(selfClass.params.textInputClass)) {
                $(this).val('');
            }

            if ($(this).attr('type') == 'checkbox') {
                if ($(this).is(':checked')) {
                    $(this).trigger('click');
                }
            }
        });
    };

    /**
     * Init Btn, onClick - load form from params
     *
     * @param {Object} $selector
     */
    PpechenyAjax.prototype.initAjaxFormBtn = function($selector) {
        var selfClass = this;

        var params = $selector.data('params');
        var $target = $(params.target);

        $selector.live('click', function(e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: params.url,
                data: {
                    params: JSON.stringify(params)
                },
                beforeSend: function() {
                    console.log('before send');
                    if (!$target.html()) {
                        $target.show();
                        $target.html(params.loadingText);
                    }
                    $target.show();
                    selfClass.blockUI($target);
                },
                success: function(response) {
                    $selector.hide();
                    $target.show();
                    $target.html(response.content);
                    selfClass.unblockUI($target);
                }
            });
        });
    };

    /**
     * Init Form
     */
    PpechenyAjax.prototype.initAjaxForm = function()
    {
        var selfClass = this;

        var $form = $('.' + selfClass.params.ajaxFormClass)
        $('.' + selfClass.params.ajaxFormClass + ' .ppecheny-form-cancel-btn').die('click');
        $('.' + selfClass.params.ajaxFormClass + ' .ppecheny-form-cancel-btn').live('click', function(e){
            e.preventDefault();

            var params = JSON.parse($(this).closest('form').find('.params-hidden').val());

            var $selector = $(params.selector);
            var $target = $(params.target);

            $selector.fadeIn();
            $target.html('');
        });

        $form.live('submit', function(e){

            e.preventDefault();

            var self = $(this);

            $(this).ajaxSubmit({
                dataType: 'json',
                beforeSend: function () {

                    selfClass.blockUI(self);
                },
                success: function(response) {

                    selfClass.unblockUI(self);

                    selfClass.unblockUI(self);

                    var params = JSON.parse(response.params);

                    var $selector = $(params.selector);
                    var $target = $(params.target);

                    if (response.error) {
                        $target.html(response.content);
                        return;
                    }

                    if (response.success) {

                        $selector.fadeIn();
                        $target.html('');

                        if (params.successFunctions) {
                            var successFunctions = params.successFunctions;

                            for (key in successFunctions) {
                                var successFunction = successFunctions[key].split('.');

                                if (successFunction[0] && successFunction[1]) {
                                    if (window[successFunction[0]] && typeof window[successFunction[0]][successFunction[1]] === 'function') {
                                        formok = window[successFunction[0]][successFunction[1]](key);
                                    }
                                } else {
                                    if (typeof window[successFunctions[key]] === 'function') {
                                        formok = window[successFunctions[key]](key);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    };

    return new PpechenyAjax();
})();