let fullGraphData;

$(window).on('load', function() {
    Highcharts.ajax({
        url: '/data/full_graph.json',
        dataType: 'application/json;',
        success: function(data) {
            console.debug('Data loaded');
            fullGraphData = JSON.parse(data);
            startDrawGraph();
        }
    });

    if ($('nav').length > 0) {
        $('body').scrollspy({target: 'nav.affix'});
    } else {
        const width = window.innerWidth, height = Math.min(window.innerHeight, 600);
        $('.full_body_graph').css({
            'width': width - 30,
            'height': height - 30,
        });
    }
});

function startDrawGraph() {
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    let data5 = [];
    let data6 = [];
    for (let key in fullGraphData) {
        const item = fullGraphData[key];
        const time = item[0] * 1000;

        data1.push([time, item[1]]);
        data2.push([time, item[2]]);
        data3.push([time, item[3]]);
        data4.push([time, item[4]]);
        data5.push([time, item[5]]);
        data6.push([time, item[6]]);
    }

    Highcharts.chart('graph_btc_only', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Привлеченный Биткоин'
        },
        xAxis: {
            type: 'datetime',
            /*
            tickInterval: 7 * 24 * 3600 * 1000,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
            */
        },
        tooltip: {
            valueDecimals: 2,
            split: true,
            valueSuffix: ' BTC'
        },
        /*
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        */
        series: [{
            name: 'Полная сумма',
            data: data3,
            type: 'line'
        }, {
            name: 'Текущее значение',
            data: data1,
            type: 'line'
        }]
    });

    Highcharts.chart('graph_full_income', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Привлеченные средства'
        },
        xAxis: {
            type: 'datetime',
            /*
            tickInterval: 7 * 24 * 3600 * 1000,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
            */
        },
        tooltip: {
            valueDecimals: 0,
            split: true,
            valuePrefix: '$ '
        },
        plotOptions: {
            area: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'В BTC',
            data: data4
        }, {
            name: 'В ERC-20',
            data: data5
        }]
    });
    Highcharts.chart('graph_current', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Текущий баланс'
        },
        xAxis: {
            type: 'datetime',
        },
        tooltip: {
            valueDecimals: 0,
            split: true,
            valuePrefix: '$ ',
        },
        plotOptions: {
            area: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'В BTC',
            data: data2,
            type: 'area'
        }, {
            name: 'В Эфире',
            data: data6,
            type: 'area'
        }]
    });
}
