$(document).ready(function() {
    const svg = d3.select("#graph1");
    console.log(svg);
    const width = window.innerWidth,
        height = Math.min(window.innerHeight, 600);

    console.debug('width/height: ', width, height)

    const color = function(d) {
        switch (d) {
            case 1:
                return '#1f77b4';
            case 2:
                return '#98df8a';
            case 3:
                return 'red';
            case 4:
                return 'purple';
            case 5:
                return 'black';
            default:
                return 'red';
        }
    };

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("/data/eth_graph.json", function(error, graphLinks) {
        if (error) {
            throw error;
        }

        d3.json("/data/eth_addresses.json", function(error, graphAddresses) {
            if (error) {
                throw error;
            }

            let links = [];

            for (let key in graphLinks) {
                const keyA = key.split('-');
                const key1 = parseInt(keyA[0]);
                const key2 = parseInt(keyA[1]);

                console.log(key1, key2);

                links.push({'source': key1, 'target': key2});
            }

            const fullGraph = {
                nodes: graphAddresses,
                links: links,
            };

            startGraph(fullGraph);
        });
    });

    function startGraph(graph) {
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", d => {
                // todo circle radius
                return 5;
            })
            .attr("fill", function(d) { return color(d.groupId); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.address; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }
    }

    function dragstarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
});
