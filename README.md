Ppecheny AjaxBundle
==========

With this bundle rendering and submitting forms becoming easier.

Only config work.

Just add twig extension ajax_form_render_btn or ajax_form_render to your template.

For example, to render button with onClick action and displaying form after click just do:

{{ ajax_form_render_btn({
    'selector' : '#handling-add-btn',
    'formType' : 'handlingType',
        'successFunctions' : {
        'handling-list' : 'PpechenyAjax.updateList'
    },
    'serviceDefault' : {
        'alias' : 'handling.service',
        'method' : 'addFormDefaults'
    },
    'serviceSave' : {
        'alias' : 'handling.service',
        'method' : 'saveForm'
    },
    'defaults' : {
        'handlingId' : handlingId
    },
    'target' : '#handling-add-holder'
}) }}

Description of all params you can find in Ppecheny\AjaxBundle\Twig#renderBtn.

Have fun)