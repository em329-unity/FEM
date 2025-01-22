const width = 800;
const height = 600;
let nodes = [];
let links = [];

const svg = d3.select("#network-map")
    .attr("width", width)
    .attr("height", height);

const linkGroup = svg.append("g").attr("class", "links");
const nodeGroup = svg.append("g").attr("class", "nodes");

// Load saved state
const savedState = localStorage.getItem('networkMap');
if (savedState) {
    const state = JSON.parse(savedState);
    nodes = state.nodes;
    links = state.links;
}

const update = () => {
    const link = linkGroup.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#999");

    const node = nodeGroup.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", "#69b3a2")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(100).strength(1))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }
};

const dragstarted = (event, d) => {
    if (!event.active) event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
};

const dragged = (event, d) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
};

const dragended = (event, d) => {
    if (!event.active) event.subject.fx = null;
    event.subject.fy = null;
};

document.getElementById('add-node').addEventListener('click', () => {
    const newNode = {id: nodes.length};
    nodes.push(newNode);
    update();
});

document.getElementById('save-map').addEventListener('click', () => {
    const state = {nodes, links};
    localStorage.setItem('networkMap', JSON.stringify(state));
    alert('Map saved!');
});

update();
