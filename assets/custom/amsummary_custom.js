define([
    'underscore',
	'backbone',
	'd3',
	'crossfilter',
	'si_ops',
	'dashboard'
], function (_, Backbone, d3, crossfilter, SI, dashboard) {

    'use strict';
    /**
     * CUSTOM SCROLL BLOCK
     */

    /*
      recalculate heights of scroller bar and thumb
     */
    function resetScroller(pane, scrollable, scroller) {
      var thumb = scroller.children('.scroller-thumb');

      var scrollableHeight = scrollable.height();
      var paneHeight = pane.height();

      if (paneHeight > scrollableHeight) {
        scroller.css('display', 'none');
        return;
      }
      scroller.css('display', 'block');
      scroller.css('height', paneHeight);

      var thumbHeight = Math.ceil((paneHeight * paneHeight)/scrollableHeight);
      thumb.css('height', thumbHeight);
    }

    /*
      build scroller element and initialize event for auto-resizing it
     */
    function buildScroll(pane, scrollable) {
      var scroller = $(document.createElement('div'))
        .addClass('scroller-thumb');
      var scrollerWrapper = $(document.createElement('div'))
        .addClass('scroller-wrapper')
        .append(scroller);

      pane.append(scrollerWrapper);

      resetScroller(pane, scrollable, scrollerWrapper);
      $(window).on('resize', function() {
        resetScroller(pane, scrollable, scrollerWrapper);
      });

      return scrollerWrapper;
    }

    /*
      initialize scroll events and calculations
     */
    function initScroll(pane, scrollable) {
      var dtop = 2;

      var scroller = buildScroll(pane, scrollable);
      var thumb = scroller.children('.scroller-thumb');

      pane.on('wheel', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var scrollableHeight = scrollable.height();
        var paneHeight = pane.height();
        if (paneHeight > scrollableHeight) return;

        var delta = evt.originalEvent.deltaY;
        var oldVal = parseInt(scrollable.css('top'));
        var newVal;
        if (delta > 0) {
          newVal = oldVal - dtop * delta;
        } else if (delta < 0) {
          newVal = oldVal + dtop * Math.abs(delta);
        }
        var threshold = -1 * scrollableHeight + paneHeight;
        if (newVal > 0) {
          newVal = 0;
        } else if (newVal < threshold) {
          newVal = threshold;
        }
        scrollable.css('top', newVal);

        /*
          sync scrollbar thumb position
         */
        var scrolledInPercent = Math.abs(newVal)/scrollableHeight;
        var relativeScrolledAmount = scrolledInPercent * paneHeight;
        thumb.css('top', relativeScrolledAmount);
      });
    }
    /*
      END OF CUSTOM SCROLL BLOCK
     */

    function fixVideoSize() {
        var videoEl = document.getElementById('si_AddImage').querySelector('video');
        if (videoEl) {
            var parentRect = videoEl.parentElement.getBoundingClientRect();
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

    /*
      as per VD rows must be 60px tall, but in slick grid settings it is 75px,
      so we recalculate heights manually.
    */
    function fixGridRows() {
      setTimeout(function() {
        var tbody = document.getElementById('si_GridLayout_Data_grid');
        var rows = tbody.querySelectorAll('.slick-row');
        rows.forEach(function(row, index) {
          row.setAttribute('style', 'top:' + (index * 60) + 'px;');
        });
      }, 200);
    }

    SI.on('select:Tree_Campaign',function(selection_data){
        fixVideoSize();
        fixListValuesTags();
        fixGridRows();
    });

    /* INITIAL UI STATE */
    setTimeout(function() {
        $('#si_Tree_Campaign_tree li a').eq(0).trigger('click');

        var treeWrapper = $('#si_Tree_Campaign_border');

        var headerLogo = $(document.createElement('div'))
            .addClass('tree_header')
            .append(
                $(document.createElement('img'))
                    .addClass('liberty_logo')
                    .attr('src', '/static/contexts/shareinsights/amsummary/images/LibertyLogo.png')
            );

        var scrollPane = $(document.createElement('div'))
            .addClass('tree_scroller')
            .css('height', treeWrapper.height() - 90);

        var treeEl = treeWrapper.children('#si_Tree_Campaign');

        treeWrapper.append(headerLogo, scrollPane);
        scrollPane.append(treeEl);

        initScroll(scrollPane, treeEl);
        $(window).on('resize', function() {
          scrollPane.css('height', treeWrapper.height() - 90);
        });
    }, 500);



  SI.on('select:ListValues',function(selection_data){
        $('#si_SelectedMeasure').text(selection_data[0].metric_name);
//    var col_header = $('#si_GridLayout_Data_grid .slick-header-column').filter(function(index) {
//        return $(this).attr('title') === 'metric_value';
//    });
//    $(col_header).find('.slick-column-name').html(selection_data[0].metric_name);
  });
});
