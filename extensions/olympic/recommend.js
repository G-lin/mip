/**
 * @file 推荐
 *
 * fork from http://gitlab.baidu.com/MIP/mibhtml/raw/master/src/static/js/dom/recommend.js
 */


define(function() {

    var _ = require('./util');

    /**
    * 推荐模块
    */
    function render(data) {
        //相关标签导流
        if(data.recommend_tag && data.recommend_tag.length > 0) {
            var keywordString = '';
            var tpl = '<a class="recommends-keywords-href c-urljump" href="#{url}" data-urljump=\'#{urljump}\'>' +
                        '<span>#{text}</span>' +
                      '</a>';
            for(var i in data.recommend_tag) {
                keywordString += _.format(tpl, {
                    url: data.recommend_tag[i].url,
                    text: data.recommend_tag[i].query,
                    urljump: JSON.stringify({
                        t: 'mdd_k',
                        lid: window.B ? B.comm.lid : 0
                    })
                });
            }
            $(".recommends").append(
                '<div class="recommends-keywords">' +
                keywordString +
                '</div>'
            );
        }
        //相关推荐
        var recommendData = data.recommend ? data.recommend : data;
        var logClass = window.parent !== window ? '' : 'MIP_LOG_BTN';

        $.each(recommendData, function(i, item) {
            $(".recommends").append(
                '<div class="' + logClass + ' recommends-box' + (!i ? ' recommends-box-first' : '') + '" data-click=\'{"action":"recommend", "order":"' + i + '", "href":"' + item.url + '", "type": "sf"}\'>'+
                '<a class="recommends-href" href='+ item.url + '>' +
                '<div class="recommends-title">' + item.title + '</div>' +
                '<div class="recommends-info">' +
                '<span>' + _.timeSince(item.time) + '</span>' +
                '<span class="recommends-provider">' + item.provider + '</span></div></a></div>'
            );
        });

        //重设高度兼容手百
        $(".recommends").css("height", "100%");


    }

    function init() {

        $(".recommends").delegate('.recommends-box','click',function(ev) {

            ev.preventDefault();
            var href = $(this).find(".recommends-href").attr("href");

            var message = {
                "event": "loadiframe",
                "data": {
                    "url": href,
                    "title": $(this).find(".recommends-provider").text(),
                    "click": $(this).data('click')
                }
            };

            //此处判断iframe用了较为tricky的逻辑，后续需要通过父页面message来确认
            if(window.parent !== window) {
                window.parent.postMessage(message, '*');
            }
            else {
                location.href = href;
            }


        });

    }

    return {
        init : init,
        render: render
    }
});