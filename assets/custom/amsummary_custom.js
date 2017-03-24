define([
    'underscore',
	'backbone',
	'd3',
	'crossfilter',
	'si_ops',
	'dashboard'
], function (_, Backbone, d3, crossfilter, SI, dashboard) {

    'use strict';

    SI.on('select:ListValues',function(selection_data){
            $('#si_SelectedMeasure').text(selection_data[0].metric_name);

    });
    function getElRect(el) {
        return el.getBoundingClientRect();
    }
    function fixVideoSize() {
        var container = document.getElementById('si_AddImage');
        var videoEl = container.querySelector('video');
        if (videoEl) {
            var parentRect = getElRect(videoEl.parentElement);
            videoEl.setAttribute('width', parentRect.width);
            videoEl.setAttribute('height', parentRect.height);
        }

    }

    function fixTag(tag) {
        var countLabel = document.createElement('span');
        countLabel.classList.add('node_count');
        countLabel.appendChild(tag.childNodes[0]);
        var nameLabel = document.createElement('span');
        nameLabel.classList.add('node_name');
        nameLabel.appendChild(tag.childNodes[1]);
        tag.removeChild(tag.firstChild);
        tag.appendChild(countLabel);
        tag.appendChild(nameLabel);
    }

    function fixListValuesTags() {
        var list = document.getElementById('si_ListValues').querySelector('.list_group');
        if (list) {
            var tags = list.querySelectorAll('li');

            var i = 0;
            var len = tags.length;
            for(; i < len; i += 1) {
                fixTag(tags[i]);
            }
        }
    }

    SI.on('select:Tree_Campaign',function(selection_data){
        // if(selection_data[0] && (selection_data[0].dimension === selection_data[0].path)){
        //     $('#si_GridLayout_Data_border').parent().parent().show(0);
        //     $('#si_GridLayout2_Data_border').parent().parent().hide(0);
        // }
        // else{
        //     $('#si_GridLayout_Data_border').parent().parent().hide(0);
        //     $('#si_GridLayout2_Data_border').parent().parent().show(0);
        // }

        fixVideoSize();
        fixListValuesTags();
    });

    /* INITIAL UI STATE */
    setTimeout(function() {
        $('#si_Tree_Campaign_tree li a').eq(0).trigger('click');


        $('#si_Tree_Campaign_border').prepend(
            $(document.createElement('div'))
                .addClass('tree_header')
                .append(
                    $(document.createElement('img'))
                        .addClass('liberty_logo')
                        .attr('src', '/static/contexts/shareinsights/amsummary/images/LibertyLogo.png')
                )
        );
    }, 500);

    
});
