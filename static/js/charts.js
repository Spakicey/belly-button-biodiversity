function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesID = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = samplesID[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_otu_ids = firstSample.otu_ids;
    var sample_otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var yticks = sample_otu_ids.slice(0, 10).map((x) => `OTU ${x}`).reverse();
    var xvalues = sample_values.slice(0, 10).sort((a,b) => b-a).reverse();
    var labels = sample_otu_labels.slice(0, 10).sort((a,b) => b-a);
    // 8. Create the trace for the bar chart.
    var trace = {
      x: xvalues,
      y: yticks,
      text: labels,
      orientation: 'h',
      type: 'bar'
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: sample_otu_ids,
      y: sample_values,
      text: sample_otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: sample_otu_ids,
      }
    };
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      showlegend: false,
      margin: {autoexpand: true},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3
    var sampleMetadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var sampleResultArray = sampleMetadata.filter(sampleObj => sampleObj.id == sample);
    var sampleResult = sampleResultArray[0];
    // 3. Create a variable that holds the washing frequency.
    sampleWfreq = sampleResult.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      value: sampleWfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>"},
      gauge: {
        axis: {range: [null, 10], nticks: 6},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"lightgreen"},
          {range: [8,10], color:"green"}
        ]
      }

    };
    var guageData = [gaugeTrace];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: {autoexpand: true},
      autosize: true

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", guageData, gaugeLayout);
  });
}
