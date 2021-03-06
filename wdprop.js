/*
 * Author: John Samuel
 */

/*
 * For pagination
 */
var limit = 500;
var offset = 0;

/*
 * Show all properties in ascending order, including deleted ones.
 */
function createDivAllProperties(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  properties.appendChild(total);
  propertySet = new Set();
  maxPropertyId = 0; 
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      propertyId = Number(result['property'].value.replace("http://www.wikidata.org/entity/P", ""));
      propertySet.add(propertyId);
      if (propertyId > maxPropertyId) {
        maxPropertyId = propertyId;
      }
    }
  }
  total.innerHTML = "Total " + maxPropertyId + " properties";
  for (i = 1; i < maxPropertyId; i++) { 
    var property = document.createElement("div"); 
    var text = document.createTextNode("P"+String(i));
    if (propertySet.has(i)) {
      property.setAttribute('class', "property");
      var a = document.createElement("a"); 
      a.setAttribute('href', "property.html?property=P" + String(i));
      a.appendChild(text);
      property.appendChild(a);
    }
    else {
      property.setAttribute('class', "deletedproperty");
      property.appendChild(text);
    }
    properties.appendChild(property);
  }
  propertySet.clear();
}

function visualizePath(languageData) {
   //Wikidata supported languages
   //Reference: https://www.d3-graph-gallery.com/graph/arc_basic.html
 
    languages = new Set();
    languageData["labels"].forEach( function (l) {
      languages.add(l);
    });
    languages = Array.from(languages);
    languages.sort();
    console.log(languages);

    var height = languages.length > 50 ? languages.length*15: languages.length * 20;
    var width = 800;
    var svg = d3.select("#pathviz")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform",
                 "translate( 10 , 10 )");
    var x = d3.scalePoint()
             .range([0, height-10])
             .domain(languages);
  nodes = svg
    .selectAll("nodes")
    .data(languages)
    .enter()
    .append("circle")
      .attr("cy", function(d){return(x(d))})
      .attr("cx", 90)
      .attr("r", 4)
      .style("fill", "#69b3a2");
    svg.selectAll("language")
       .data(languages)
       .enter()
       .append("text")
       .attr("y", function(d){ return(x(d))})
       .attr("x", 80)
       .text(function(d){ return(d)})
       .style("text-anchor", "end");

  // Create links
  links = []; 
  if(languageData["labels"].length >1) {
    links.push([languageData["labels"][0], languageData["labels"][1]]);
    for (let i=1; i <languageData["labels"].length-1; i++) {
      links.push([languageData["labels"][i], languageData["labels"][i+1]]);
    }
  }
  console.log(languageData["labels"][0]);
  languageData["labels"][0] = languageData["labels"][0].replace(" ","");
  console.log(languageData["labels"][0].length);
  console.log(x(languageData["labels"][0]));
  slinks = svg
    .selectAll('links')
    .data(links)
    .enter()
    .append('path')
    .attr('d', function (d) {
      start = x(d[0]);
      end = x(d[1]);
      arcInflectionPoint = Math.abs(start-end)>400? (start-end)/1.2: (start-end)/2;
      return ['M', 90, start, 
        'A',                 
        arcInflectionPoint, ',', 
        arcInflectionPoint, 0, 0, ',',
        start < end ? 1 : 0, 90, ',', end] 
        .join(' ');
    })
    .style("fill", "none")
    .attr("stroke", "red");
 

}

function createDivProperties(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " properties";
  properties.appendChild(total);
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      var property = document.createElement("div"); 
      property.setAttribute('class', "property");
      var a = document.createElement("a"); 
      a.setAttribute('href', "property.html?property=" + result['property'].value.replace("http://www.wikidata.org/entity/", ""));
      var text = document.createTextNode(result[variable].value.replace("http://www.wikidata.org/entity/", ""));
      a.appendChild(text);
      property.appendChild(a);
      properties.appendChild(property);
    }
  }
}

function createDivClasses(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " classes";
  properties.appendChild(total);

  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Item";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Class label";
  th.appendChild(td);
  table.append(th);

  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    td = document.createElement("td"); 
    td.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', "class.html?class=" + result['item'].value.replace("http://www.wikidata.org/entity/", ""));
    var text = document.createTextNode(result['item'].value.replace("http://www.wikidata.org/entity/", ""));
    a.append(text);
    td.appendChild(a);
    tr.appendChild(td);
  
    td = document.createElement("td"); 
    text = null;
    if(result.hasOwnProperty("label")) {
      text = document.createTextNode(result['label'].value);
    }
    else {
      text = document.createTextNode(result['item'].value.replace("http://www.wikidata.org/entity/", ""));
    }
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);
  }
  properties.appendChild(table);
}

function createDivClassProperties(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " properties";
  properties.appendChild(total);

  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Item";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Property label";
  th.appendChild(td);
  table.append(th);

  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    td = document.createElement("td"); 
    td.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', "property.html?property=" + result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    var text = document.createTextNode(result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    a.append(text);
    td.appendChild(a);
    tr.appendChild(td);
  
    td = document.createElement("td"); 
    text = null;
  
    if(result.hasOwnProperty("label")) {
      var text = document.createTextNode(result['label'].value);
      a.appendChild(text);
    }
    else {
      var text = document.createTextNode(result['property'].value.replace("http://www.wikidata.org/entity/", ""));
      a.appendChild(text);
    }
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);
  }
  properties.appendChild(table);
}

function createDivComparisonResults(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Translation statistics";
  while (properties.hasChildNodes()) {
    properties.removeChild(properties.lastChild);
  }
  properties.appendChild(total);
  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Language";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Property";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Label";
  th.appendChild(td);
  table.appendChild(th);
  var tr = "";
  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    td = document.createElement("td"); 
    td.innerHTML = result['language'].value;
    tr.appendChild(td);

    var property = document.createElement("th"); 
    property.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', "property.html?property=" + result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    var text = document.createTextNode(result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    a.appendChild(text);
    property.appendChild(a);
    tr.appendChild(property);

    td = document.createElement("td"); 
    td.innerHTML = result['label'].value;
    tr.appendChild(td);

    table.appendChild(tr);
  }
  properties.appendChild(table);
}

function createDivWikiProjects(divId, json) {
  const { head: { vars }, results } = json;
  var projects = document.getElementById(divId);
  while (projects.hasChildNodes()) {
    projects.removeChild(projects.lastChild);
  }
  
  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Projects";
  th.appendChild(td);
  table.appendChild(th);
  var tr = "";
  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    td = document.createElement("td"); 
    var a = document.createElement("a"); 
    a.setAttribute('href', "https://www.wikidata.org/wiki/" + result['title'].value);
    var text = document.createTextNode(result['title'].value);
    a.appendChild(text);
    td.appendChild(a);
    var wdproject = document.createElement("a"); 
    wdproject.setAttribute('href', "wikiproject.html?project=" + result['title'].value);
    var emptytext = document.createTextNode(" ");
    td.appendChild(emptytext);
    var wdprojtext = document.createTextNode("(Details)");
    wdproject.appendChild(wdprojtext);
    td.appendChild(wdproject);
    tr.appendChild(td);
    table.appendChild(tr);
  }
  if (results.bindings.length == 500) {
    offset = offset + 500;
    var nextFirst = document.createElement("div"); 
    var nextLast = document.createElement("div"); 
    nextFirst.setAttribute('class', "property");
    nextLast.setAttribute('class', "property");
    var aF = document.createElement("a"); 
    aF.setAttribute('href', "wikiprojects.html?limit=500&offset="+ offset);
    var aL = document.createElement("a"); 
    aL.setAttribute('href', "wikiprojects.html?limit=500&offset="+ offset);
    var textF = document.createTextNode("Next");
    var textL = document.createTextNode("Next");
    aF.appendChild(textF);
    aL.appendChild(textL);
    nextFirst.appendChild(aF);
    nextLast.appendChild(aL);
    projects.appendChild(nextFirst);
    projects.appendChild(table);
    projects.appendChild(nextLast);
  }
  else {
    projects.appendChild(table);
  }
}

function createDivSearchProperties(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " properties";
  while (properties.hasChildNodes()) {
    properties.removeChild(properties.lastChild);
  }
  properties.appendChild(total);
  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Property";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Label";
  th.appendChild(td);
  table.appendChild(th);
  var tr = "";
  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    var property = document.createElement("td"); 
    property.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', "property.html?property=" + result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    var text = document.createTextNode(result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    a.appendChild(text);
    property.appendChild(a);
    tr.appendChild(property);

    td = document.createElement("td"); 
    td.setAttribute('class', "searchresultvalue");
    td.innerHTML = result['label'].value;
    tr.appendChild(td);

    table.appendChild(tr);
  }
  properties.appendChild(table);
}

function getColor(colors, index, total) {
  var colorCount = colors.length;
  var groupSize = total/colorCount;

  for (i = 0; i * groupSize < total; i ++) {
    if (index >= i * groupSize && index <= (i + 1) * groupSize) {
      return colors[i];
    }
  }
}

function createDivTranslatedAliasesCount(divId, json) {
  const { head: { vars }, results } = json;
  var languages = document.getElementById(divId);
  var colors =  ["#002171", "#004ba0", 
                 "#0069c0", "#2286c3", "#bbdefb"]; 
  var backgroundColors =  ["#ffffff", "#ffffff", 
                 "#000000", "#000000", "#000000"]; 
 
  var count = 0;
  for ( const result of results.bindings ) {
    var language = document.createElement("div"); 
    language.setAttribute('class', "language");

    language.style['background-color'] = getColor(colors, count, results.bindings.length);

    var a = document.createElement("a"); 
    a.setAttribute('href', "language.html?language=" + result['languageCode'].value);
    a.style['color'] = getColor(backgroundColors, count, results.bindings.length);
    var text = document.createTextNode(result['languageCode'].value + " (" + result['total'].value +")");
    a.appendChild(text);
    language.appendChild(a);
    languages.appendChild(language);

    count++;
  }
}

function createDivTranslatedValues(divId, json) {
  const { head: { vars }, results } = json;

  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " properties";
  properties.appendChild(total);

  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Property";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Value";
  th.appendChild(td);
  table.appendChild(th);
  for ( const result of results.bindings ) {
    tr = document.createElement("tr");

    var property = document.createElement("div"); 
    property.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', "https://www.wikidata.org/wiki/Property:" + result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    var text = document.createTextNode(result['property'].value.replace("http://www.wikidata.org/entity/", ""));
    a.appendChild(text);
    property.appendChild(a);
    td = document.createElement("td"); 
    td.appendChild(property);
    tr.appendChild(td);

    td = document.createElement("td"); 
    td.innerHTML = result['label'].value;
    tr.appendChild(td);
    table.appendChild(tr);
  }
  properties.appendChild(table);
}

function createDivTranslatedLabelsCount(divId, json) {
  const { head: { vars }, results } = json;
  var languages = document.getElementById(divId);
  var colors =  ["#002171", "#004ba0", 
                 "#0069c0", "#2286c3", "#bbdefb"]; 
  var backgroundColors =  ["#ffffff", "#ffffff", 
                 "#000000", "#000000", "#000000"]; 
 
  var count = 0;
  for ( const result of results.bindings ) {
    var language = document.createElement("div"); 
    language.setAttribute('class', "language");

    language.style['background-color'] = getColor(colors, count, results.bindings.length);

    var a = document.createElement("a"); 
    a.setAttribute('href', "./language.html?language=" + result['languageCode'].value);
    a.style['color'] = getColor(backgroundColors, count, results.bindings.length);
    var text = document.createTextNode(result['languageCode'].value + " (" + result['total'].value +")");
    a.appendChild(text);
    language.appendChild(a);
    languages.appendChild(language);

    count++;
  }
}

function createDivTranslatedDescriptionsCount(divId, json) {
  const { head: { vars }, results } = json;
  var languages = document.getElementById(divId);
  var colors =  ["#002171", "#004ba0", 
                 "#0069c0", "#2286c3", "#bbdefb"]; 
  var backgroundColors =  ["#ffffff", "#ffffff", 
                 "#000000", "#000000", "#000000"]; 
 
  var count = 0;
  for ( const result of results.bindings ) {
    var language = document.createElement("div"); 
    language.setAttribute('class', "language");

    language.style['background-color'] = getColor(colors, count, results.bindings.length);

    var a = document.createElement("a"); 
    a.setAttribute('href', "./language.html?language=" + result['languageCode'].value);
    a.style['color'] = getColor(backgroundColors, count, results.bindings.length);
    var text = document.createTextNode(result['languageCode'].value + " (" + result['total'].value +")");
    a.appendChild(text);
    language.appendChild(a);
    languages.appendChild(language);

    count++;
  }
}

function createDivLanguage(divId, json) {
  const { head: { vars }, results } = json;
  var languages = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " languages";
  languages.appendChild(total);
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      var language = document.createElement("div"); 
      language.setAttribute('class', "language");
      var a = document.createElement("a"); 
      a.setAttribute('href', "./language.html?language=" + result[variable].value);
      var text = document.createTextNode(result[variable].value);
      a.appendChild(text);
      language.appendChild(a);
      languages.appendChild(language);
    }
  }
}

function createDivPropertyDetails(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " properties";
  properties.appendChild(total);
  propertySet = new Set();
  maxPropertyId = 0;
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      propertyId = Number(result['property'].value.replace("http://www.wikidata.org/entity/P", ""));
      propertySet.add(propertyId);
      if (propertyId > maxPropertyId) {
        maxPropertyId = propertyId;
      }
    }
  }
  for (i = 1; i < maxPropertyId; i++) { 
    var property = document.createElement("div"); 
    var text = document.createTextNode("P"+String(i));
    if (propertySet.has(i)) {
      property.setAttribute('class', "property");
      var a = document.createElement("a"); 
      a.setAttribute('href', "property.html?property=P" + String(i));
      a.appendChild(text);
      property.appendChild(a);
      properties.appendChild(property);
    }
  }
  propertySet.clear();
}

function queryWikidata(sparqlQuery, func, divId) {
     /*
      * Following script is a modified form of automated
      * script generated from Wikidata Query services
      */
     var div = document.getElementById(divId);
     var fetchText = document.createElement("h4"); 
     fetchText.innerHTML = "Fetching data...";
     div.append(fetchText);

     const endpointUrl = 'https://query.wikidata.org/sparql',
     fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery )+"&format=json";
     headers = { 'Accept': 'application/sparql-results+json' };

     fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
       div.removeChild(fetchText);
       func(divId, json)
     } );
}

function getLanguages() {
  const sparqlQuery = `
      SELECT DISTINCT ?language
      WHERE
      {
        [] wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      }
      ORDER by ?language
      `;
  queryWikidata(sparqlQuery, createDivLanguage, "languages");
}

function getProperty(item, language) {
  const sparqlQuery = `
      SELECT ?propertyLabel
      {
        wd:`+ item +` rdfs:label ?propertyLabel FILTER (lang(?propertyLabel) = "`+language+`").
      }
      `;
  queryWikidata(sparqlQuery, createDivProperty, "property");
}

function getClasses() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }

  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
    SELECT DISTINCT ?item ?label
    {
      {
        SELECT ?item ?label
        WHERE
        {
          ?item wdt:P1963 [].
          OPTIONAL{ ?item rdfs:label ?label FILTER (lang(?label)="` + language + `").}.
        }
      }
      UNION
      {
        SELECT ?item ?label
        WHERE
        {
          ?property a wikibase:Property;
                    wdt:P31 ?item.
          OPTIONAL{ ?item rdfs:label ?label FILTER (lang(?label)="` + language + `").}.
        }
      }
    }
    ORDER by ?label
    `;
  queryWikidata(sparqlQuery, createDivClasses, "propertyClasses");
}

function getClassProperties() {
  var language = "en";
  var item = "Q9143";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
    reg = new RegExp("class=([^&#=]*)");
    value = reg.exec(window.location.search);
    if (value != null) {
       item = decodeURIComponent(value[1]);
    }
  }

  getProperty(item, language);

  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
    SELECT DISTINCT ?property ?label
    {
      {
        SELECT ?property ?label
        WHERE
        {
          wd:`+ item +` wdt:P1963 ?property.
          OPTIONAL{ ?property rdfs:label ?label FILTER (lang(?label)="`+ language +`").}
        }
      }
      UNION
      {
        SELECT DISTINCT ?property ?label
        WHERE
        {
          ?property a wikibase:Property;
                    wdt:P31  wd:`+ item +`.
          OPTIONAL{ ?property rdfs:label ?label FILTER (lang(?label)="`+ language +`").}
        }
      } 
    }
    ORDER by ?label
    `;
  queryWikidata(sparqlQuery, createDivClassProperties, "classProperties");
}

function getMissingPropertyAliases() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }

  getLanguage(language);

  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
    SELECT DISTINCT ?property
    WHERE
    {
      ?property rdf:type wikibase:Property.
      OPTIONAL{?property skos:altLabel ?alias FILTER (lang(?alias)="`
      + language + `")}
      FILTER (!BOUND(?alias)).
    }
    ORDER by ?alias
    `;
  queryWikidata(sparqlQuery, createDivProperties, "missingPropertyAliases");
}

function getPropertyLabelsNeedingTranslation() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }

  getLanguage(language);

  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?property
    WHERE
    {
      ?property rdf:type wikibase:Property.
      OPTIONAL{?property rdfs:label ?label FILTER (lang(?label)="`
      + language + `")}
      FILTER (!BOUND(?label)).
    }
    ORDER by ?property
    `;
  queryWikidata(sparqlQuery, createDivProperties, "propertyLabelsNeedingTranslation");
}

function createDivProperty(divId, json) { 
  const { head: { vars }, results } = json;
  var languageText = document.getElementById(divId);
  if(results.bindings.length > 0) {
    languageText.innerHTML = results.bindings[0]['propertyLabel']['value'];
  }
}

function createDivLanguageCode(divId, json) { 
  const { head: { vars }, results } = json;
  var languageText = document.getElementById(divId);
  if(results.bindings.length > 0) {
    languageText.innerHTML = results.bindings[0]['languageLabel']['value'];
  }
}

function getLanguage(language){
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?languageLabel
    WHERE
    {
      ?languageWiki wdt:P424 "` + language + `";
               wdt:P407 ?language.   
      ?language rdfs:label ?languageLabel.
      FILTER(lang(?languageLabel) = "en")
       
    }
    LIMIT 1`;
  queryWikidata(sparqlQuery, createDivLanguageCode, "languageCode");
}

function getPropertyDescriptionsNeedingTranslation() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  
  getLanguage(language);
  
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?property
    WHERE
    {
      ?property rdf:type wikibase:Property.
      OPTIONAL{?property schema:description ?description FILTER (lang(?description)="`
      + language + `")}
      FILTER (!BOUND(?description)).
    }
    ORDER by ?description
    `;
  queryWikidata(sparqlQuery, createDivProperties, "propertyDescriptionsNeedingTranslation");
}

function getCountOfTranslatedLabels() {
  const sparqlQuery = `
     SELECT ?languageCode (SUM(?count) as ?total)
     WHERE
     {
       SELECT ?property ?languageCode (count(?label) as ?count)
       WHERE
       {
         ?property a wikibase:Property;
                rdfs:label ?label.
         BIND(lang(?label) as ?languageCode)            
       }
       GROUP BY ?property ?languageCode
     }
     GROUP BY ?languageCode
     ORDER BY DESC(?total)    `;

  queryWikidata(sparqlQuery, createDivTranslatedLabelsCount, "translatedLabelsCount");
}

function getComparisonResultsOnLoad() {
  var search = "en, fr";
  if(window.location.search.length > 0) {
    var reg = new RegExp("languages=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       search = decodeURIComponent(value[1]);
    }
  }
  document.getElementById("languages").value = search;
  search = "('" + search + "')";
  search = search.replace(/ /g, "");
  search = search.replace(/,/g, "') ('");
  getComparisonResult(search);
}

function getComparisonResultsOnEvent(e, form) {
  e.preventDefault();
  var search = "en, fr";
  if(window.location.search.length > 0) {
    var reg = new RegExp("languages=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       search = decodeURIComponent(value[1]);
    }
  }
  search = "('" + document.getElementById("languages").value + "')";
  search = search.replace(/ /g, "");
  search = search.replace(/,/g, "') ('");
  getComparisonResult(search);
}

function getComparisonResult(search) {
  var sparqlQuery = `
      SELECT ?languageCode (COUNT(?label) as ?total)
      {
        VALUES (?languageCode) {` + search + `}
        [] a wikibase:Property;
             rdfs:label ?label FILTER(lang(?label)= ?languageCode)
      }
      GROUP BY ?languageCode
      ORDER BY DESC(?total)
     `;

  var compareDiv = document.getElementById("comparisonResults");
  while (compareDiv.hasChildNodes()) {
    compareDiv.removeChild(compareDiv.lastChild);
  }

  //URL to comparison page
  var compareURLdiv = document.createElement("div"); 
  var textURL = document.createTextNode("URL: ");
  compareURLdiv.appendChild(textURL);
  var compareURL = document.createElement("a"); 
  compareURL.setAttribute("href","./compare.html?languages=" + document.getElementById("languages").value);
  var text = document.createTextNode("compare.html?languages=" + document.getElementById("languages").value);
  compareURL.appendChild(text);
  compareURLdiv.appendChild(compareURL);
  compareDiv.appendChild(compareURLdiv);

  var labels = document.createElement("div"); 
  labels.setAttribute("id", "comparisonResultsLabels");
  var total = document.createElement("h3"); 
  total.innerHTML = "Count of translated labels";
  compareDiv.appendChild(total);
  compareDiv.appendChild(labels);  
  queryWikidata(sparqlQuery, createDivTranslatedLabelsCount, "comparisonResultsLabels");

  sparqlQuery = `
      SELECT ?languageCode (COUNT(?label) as ?total)
      {
        VALUES (?languageCode) {` + search + `}
        [] a wikibase:Property;
             schema:description ?label FILTER(lang(?label)= ?languageCode)
      }
      GROUP BY ?languageCode
      ORDER BY DESC(?total)
     `;

  var descriptions = document.createElement("div"); 
  descriptions.setAttribute("id", "comparisonResultsDescriptions");
  total = document.createElement("h3"); 
  total.innerHTML = "Count of translated descriptions";
  compareDiv.appendChild(total);
  compareDiv.appendChild(descriptions);
  queryWikidata(sparqlQuery, createDivTranslatedLabelsCount, "comparisonResultsDescriptions");

  sparqlQuery = `
      SELECT ?languageCode (COUNT(?label) as ?total)
      {
        VALUES (?languageCode) {` + search + `}
        [] a wikibase:Property;
             skos:altLabel ?label FILTER(lang(?label)= ?languageCode)
      }
      GROUP BY ?languageCode
      ORDER BY DESC(?total)
     `;

  var aliases = document.createElement("div"); 
  aliases.setAttribute("id", "comparisonResultsAliases");
  total = document.createElement("h3"); 
  total.innerHTML = "Count of available aliases";
  compareDiv.appendChild(total);
  compareDiv.appendChild(aliases);
  queryWikidata(sparqlQuery, createDivTranslatedLabelsCount, "comparisonResultsAliases");
}

function getTranslatedLabels() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  getLanguage(language);

  const sparqlQuery = `
    SELECT ?property ?label
    WHERE
    {
      ?property a wikibase:Property;
              rdfs:label ?label.
      FILTER(lang(?label) = "`+ language +`")            
    }
    ORDER by ?property
   `;
  queryWikidata(sparqlQuery, createDivTranslatedValues, "translatedLabels");
}

function getTranslatedDescriptions() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  getLanguage(language);

  const sparqlQuery = `
    SELECT ?property ?label
    WHERE
    {
      ?property a wikibase:Property;
              schema:description ?label.
      FILTER(lang(?label) = "`+ language +`")            
    }
    ORDER by ?property
   `;
  queryWikidata(sparqlQuery, createDivTranslatedValues, "translatedDescription");
}

function getTranslatedAliases() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  getLanguage(language);

  const sparqlQuery = `
    SELECT ?property ?label
    WHERE
    {
      ?property a wikibase:Property;
              skos:altLabel ?label.
      FILTER(lang(?label) = "`+ language +`")            
    }
    ORDER by ?property
   `;
  queryWikidata(sparqlQuery, createDivTranslatedValues, "translatedAliases");
}


function getCountOfTranslatedDescriptions() {
  const sparqlQuery = `
    SELECT ?languageCode (SUM(?count) as ?total)
    WHERE
    {
      SELECT ?property ?languageCode (count(?description) as ?count)
      WHERE
      {
        ?property a wikibase:Property;
                schema:description ?description.
        BIND(lang(?description) as ?languageCode)            
      }
      GROUP BY ?property ?languageCode
    }
    GROUP BY ?languageCode
    ORDER BY DESC(?total) `;

  queryWikidata(sparqlQuery, createDivTranslatedDescriptionsCount, "translatedDescriptionsCount");
}

function getCountOfTranslatedAliases() {
  const sparqlQuery = `
   SELECT ?languageCode (SUM(?count) as ?total)
   WHERE
   {
     SELECT ?property ?languageCode (count(?altLabel) as ?count)
     WHERE
     {
       ?property a wikibase:Property;
                skos:altLabel ?altLabel.
       BIND(lang(?altLabel) as ?languageCode)            
     }
     GROUP BY ?property ?languageCode
   }
   GROUP BY ?languageCode
   ORDER BY DESC(?total) `;

  queryWikidata(sparqlQuery, createDivTranslatedAliasesCount, "translatedAliasesCount");
}

function getLanguagesWithUntranslatedLabels() {
  const sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      ?wikipedia wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {[a wikibase:Property] rdfs:label ?label. BIND(lang(?label) as ?language)}
    }
    ORDER by ?language
   `;

  queryWikidata(sparqlQuery, createDivLanguage, "untranslatedLabelsInLanguages");
}

function getLanguagesWithUntranslatedDescriptions() {
  const sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      ?wikipedia wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {[a wikibase:Property] schema:description ?description. BIND(lang(?description) as ?language)}
    }
    ORDER by ?language
   `;

  queryWikidata(sparqlQuery, createDivLanguage, "untranslatedDescriptionsInLanguages");
}

function getLanguagesWithUntranslatedAliases() {
  const sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      ?wikipedia wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {[a wikibase:Property] skos:altLabel ?alias. BIND(lang(?alias) as ?language)}
    }
    ORDER by ?language
   `;

  queryWikidata(sparqlQuery, createDivLanguage, "untranslatedAliasesInLanguages");
}

function getMissingTranslationStatistics() {
  getLanguagesWithUntranslatedLabels();
  getLanguagesWithUntranslatedDescriptions();
  getLanguagesWithUntranslatedAliases();
}

function getTranslationStatistics() {
  getCountOfTranslatedLabels();
  getCountOfTranslatedDescriptions();
  getCountOfTranslatedAliases();
}

function createDivDataTypes(divId, json) {
  const { head: { vars }, results } = json;
  var datatypes = document.getElementById(divId);
  var total = document.createElement("h3"); 
  total.innerHTML = "Total " + results.bindings.length + " datatypes";
  datatypes.appendChild(total);
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      var datatype = document.createElement("div"); 
      datatype.setAttribute('class', "datatype");
      var a = document.createElement("a"); 
      var datatypeValue = result[variable].value.replace("http://wikiba.se/ontology#", "");
      var text = document.createTextNode(datatypeValue);
      a.setAttribute('href', "datatype.html?datatype=wikibase:" + datatypeValue);
      a.appendChild(text);
      datatype.appendChild(a);
      datatypes.appendChild(datatype);
    }
  }
}

function getDatatypes() {
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?datatype
    WHERE
    {
      [] rdf:type wikibase:Property;
                wikibase:propertyType ?datatype.
    }
    ORDER by ?property

    `;
  queryWikidata(sparqlQuery, createDivDataTypes, "propertyDatatypes");
}

function getProperties() {
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?property
    WHERE
    {
      ?property rdf:type wikibase:Property.
    }
    ORDER by ?property
    `;
  queryWikidata(sparqlQuery, createDivPropertyDetails, "existingProperties");
  queryWikidata(sparqlQuery, createDivAllProperties, "allProperties");
}


function getPropertyWithReference() {
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
   SELECT DISTINCT ?property 
    {
      ?property a wikibase:Property;
         ?prop ?statement.
      ?statement prov:wasDerivedFrom ?reference.
      FILTER(REGEX(STR(?statement), "http://www.wikidata.org/entity/statement/") && bound(?reference))
    }
    ORDER by ?property
    `;
  queryWikidata(sparqlQuery, createDivPropertyDetails, "propertywithreference");
}

function getPropertyWithEquivPropertySet() {
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
   SELECT DISTINCT ?property 
    {
      ?property a wikibase:Property;
         ?prop ?statement;
         wdt:P1628 ?equivproperty.
    }
    ORDER by ?property
    `;
  queryWikidata(sparqlQuery, createDivPropertyDetails, "propertywithequivpropertyset");
}
function getOverallProvenance() {
  getPropertyWithEquivPropertySet();
  getPropertyWithReference();
}

function getPropertiesNeedingTranslation() {
  getPropertyLabelsNeedingTranslation();
  getPropertyDescriptionsNeedingTranslation();
  getMissingPropertyAliases();
}


function getPropertyDetails() {
  var property = "P31";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       property = decodeURIComponent(value[1]);
    }
  }
  var div = document.getElementById("propertyCode");
  div.innerHTML = property;

  div = document.getElementById("propertyDetails");
  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Feature";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Value";
  th.appendChild(td);
  table.appendChild(th);
  var tr = document.createElement("tr"); 
  var td = document.createElement("td"); 
  td.innerHTML = "Link";
  tr.appendChild(td);
  td = document.createElement("td"); 
  link = document.createElement("a"); 
  link.setAttribute('href', "https://www.wikidata.org/entity/" + property)
  var text = document.createTextNode("https://www.wikidata.org/entity/"+property);
  link.appendChild(text);
  td.appendChild(link)
  tr.appendChild(td);
  table.appendChild(tr);

  tr = document.createElement("tr"); 
  td = document.createElement("td"); 
  td.innerHTML = "Translation Path";
  tr.appendChild(td);
  td = document.createElement("td"); 
  link = document.createElement("a"); 
  link.setAttribute('href', "path.html?property=" + property)
  var text = document.createTextNode("path.html?property="+property);
  link.appendChild(text);

  vizlink = document.createElement("a"); 
  vizlink.setAttribute('href', "pathviz.html?property=" + property)
  var viztext = document.createTextNode(" (Visualization: "+property+ ") ");
  vizlink.appendChild(viztext);
  td.appendChild(link)
  td.appendChild(vizlink)
  tr.appendChild(td);
  table.appendChild(tr);
  div.appendChild(table);

  tr = document.createElement("tr"); 
  td = document.createElement("td"); 
  td.innerHTML = "Provenance information";
  tr.appendChild(td);
  td = document.createElement("td"); 
  link = document.createElement("a"); 
  link.setAttribute('href', "propertyprovenance.html?property=" + property)
  var text = document.createTextNode("provenance.html?property="+property);
  link.appendChild(text);
  td.appendChild(link)
  tr.appendChild(td);
  table.appendChild(tr);
  div.appendChild(table);
  
   sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      [] wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {wd:`+ property + ` rdfs:label ?label. BIND(lang(?label) as ?language)}
    }
    ORDER by ?language
    `;
   queryWikidata(sparqlQuery, createDivLanguage, "untranslatedLabelsInLanguages");

   sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      [] wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {wd:`+ property + ` schema:description ?description. BIND(lang(?description) as ?language)}
    }
    ORDER by ?language
    `;
   queryWikidata(sparqlQuery, createDivLanguage, "untranslatedDescriptionsInLanguages");

   sparqlQuery = `
    SELECT DISTINCT ?language
    WHERE
    {
      [] wdt:P31 wd:Q10876391;
                 wdt:P407 [wdt:P424 ?language]
      MINUS {wd:`+ property + ` skos:altLabel ?alias. BIND(lang(?alias) as ?language)}
    }
    ORDER by ?language
    `;

   queryWikidata(sparqlQuery, createDivLanguage, "untranslatedAliasesInLanguages");
  var sparqlQuery = `
    SELECT DISTINCT ?language
    {
      wd:`+ property + ` rdfs:label ?label.
      BIND(lang(?label) as ?language)
    }
    ORDER by ?language`;
   queryWikidata(sparqlQuery, createDivLanguage, "translatedLabelsInLanguages");
   
   sparqlQuery = `
    SELECT DISTINCT ?language
    {
      wd:`+ property + ` schema:description ?description.
      BIND(lang(?description) as ?language)
    } 
    ORDER by ?language`;
   queryWikidata(sparqlQuery, createDivLanguage, "translatedDescriptionsInLanguages");

   sparqlQuery = `
    SELECT DISTINCT ?language
    {
      wd:`+ property + ` skos:altLabel ?alias.
      BIND(lang(?alias) as ?language)
    }
    ORDER by ?language`;
   queryWikidata(sparqlQuery, createDivLanguage, "translatedAliasesInLanguages");

}

function getPropertiesWithDatatype() {
  var datatype = "wikibase:WikibaseItem";
  if(window.location.search.length > 0) {
    var reg = new RegExp("datatype=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       datatype = decodeURIComponent(value[1]);
    }
  }

  var datatypeCode = document.getElementById("datatypeCode");
  datatypeCode.innerHTML = "Properties with datatype- "+ datatype;
  
  const sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?property
    WHERE
    {
      ?property rdf:type wikibase:Property;
                wikibase:propertyType ` + datatype + `
    }
    ORDER by ?property

    `;
  queryWikidata(sparqlQuery, createDivPropertyDetails, "propertiesWithDatatype");
}

function createDivPropertyDescriptors(divId, json) {
  const { head: { vars }, results } = json;
  var properties = document.getElementById(divId);
  var total = document.createElement("h3"); 
  var count = 0;
  properties.appendChild(total);
  for ( const result of results.bindings ) {
    for ( const variable of vars ) {
      var property = document.createElement("div"); 
      property.setAttribute('class', "property");
      var a = document.createElement("a"); 
      if (result[variable].value.indexOf("/direct") != -1 || 
          result[variable].value.indexOf("wikiba.se") != -1  ||
          result[variable].value.indexOf("schema.org") != -1 ||
          result[variable].value.indexOf("w3.org") != -1) {
         continue; //To avoid properties  
      }
      count = count + 1;
      //a.setAttribute('href', result[variable].value);
      a.setAttribute('href', "property.html?property=" + result[variable].value.replace("http://www.wikidata.org/prop/", ""));
      var text = document.createTextNode(result[variable].value.replace(new RegExp(".*/"), ""));
      a.appendChild(text);
      property.appendChild(a);
      properties.appendChild(property);
    }
  }
  total.innerHTML = "Total " + count + " properties";
}

function getPropertyDescriptors() {
  const sparqlQuery = `
    PREFIX wikibase: <http://wikiba.se/ontology#>

    SELECT DISTINCT ?subproperty
    WHERE
    {
      [] rdf:type wikibase:Property;
                ?subproperty [].
    }
    ORDER by ?subproperty

    `;
  queryWikidata(sparqlQuery, createDivPropertyDescriptors, "propertyDescriptors");
}

function getSearchQuery(language, search) {
  const sparqlQuery = `
    PREFIX wikibase: <http://wikiba.se/ontology#>
    SELECT DISTINCT ?property ?label
    {
      {
        SELECT ?property ?label
        WHERE
        {
          ?property a wikibase:Property;
                      rdfs:label ?label FILTER (lang(?label) = "`+ language +`").
          FILTER(contains(lcase(?label), lcase(`+search+`)))
        }
      }
      UNION
      {
        SELECT ?property ?label
        WHERE
        {
          [rdfs:label ?ilabel] wdt:P1963 ?property.
          ?property rdfs:label ?label FILTER(lang(?label)="`+language+`").
          FILTER (lang(?ilabel)="en" && contains(lcase(?ilabel), lcase(`+search+`)))
        }
      }
      UNION
      {
        SELECT DISTINCT ?property ?label
        WHERE
        {
          ?property a wikibase:Property;
                    wdt:P31  [rdfs:label ?ilabel];
                    rdfs:label ?label FILTER (lang(?label)="`+language+`").
          FILTER (lang(?ilabel)="en" && contains(lcase(?ilabel), lcase(`+search+`)))
        }
      } 
    }
    ORDER by ?label
    `;
  return(sparqlQuery);
}

function getSearchWikiProjectQuery(search) {
  const sparqlQuery = `
    SELECT ?title WHERE{
     FILTER (contains(lcase(?title), lcase(` + search + `))).
     {
       SELECT ?title WHERE {
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:api "Search" .
          bd:serviceParam wikibase:endpoint "www.wikidata.org" .
          bd:serviceParam mwapi:srsearch "Wikidata:WikiProject" .
          ?title wikibase:apiOutput mwapi:title .
        }
        FILTER(contains(?title, "Wikidata:WikiProject" ))
       }
      }
    }
  `;
   return sparqlQuery;
}
function getWikiProjects() {
  if(window.location.search.length > 0) {
    var reg = new RegExp("limit=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       limit = decodeURIComponent(value[1]);
       limit = Number(limit);
    }
  }
  if(window.location.search.length > 0) {
    var reg = new RegExp("offset=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       offset = decodeURIComponent(value[1]);
       offset = Number(offset);
    }
  }
  const sparqlQuery = `
    SELECT DISTINCT ?title WHERE {
      SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:api "Search" .
        bd:serviceParam wikibase:endpoint "www.wikidata.org" .
        bd:serviceParam mwapi:srsearch "Wikidata:WikiProject" .
        ?title wikibase:apiOutput mwapi:title .
      }
      FILTER(contains(?title, "Wikidata:WikiProject" )).
    }
    LIMIT ` + limit + `
    OFFSET `+ offset + `
  `;
  queryWikidata(sparqlQuery, createDivWikiProjects, "allWikiProjects");
}

function findWikiProjects(e, form) {
  e.preventDefault();
  var search = document.getElementById("searchproject").value;
  sparqlQuery = getSearchWikiProjectQuery("'"+search+"'");
  queryWikidata(sparqlQuery, createDivWikiProjects, "searchResults");
}


function findWikiProjectsOnLoad() {
  limit = 500;
  offset = 500;
  var search = 'heritage';
  if(window.location.search.length > 0) {
    var reg = new RegExp("search=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       search = decodeURIComponent(value[1]);
    }
  }
  sparqlQuery = getSearchWikiProjectQuery('"'+search+'"');
  document.getElementById("search").value = search; 
  queryWikidata(sparqlQuery, createDivWikiProjects, "allWikiProjects");
}

function findPropertyOnLoad() {
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  var search = '';
  if(window.location.search.length > 0) {
    var reg = new RegExp("search=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       search = decodeURIComponent(value[1]);
    }
  }

  if (search == "") {
    return;
  }

  sparqlQuery = getSearchQuery(language, '"'+search+'"');
  document.getElementById("search").value = search; 
  queryWikidata(sparqlQuery, createDivSearchProperties, "searchResults");
}

function findProperty(e) {
  e.preventDefault();
  var language = "en";
  if(window.location.search.length > 0) {
    var reg = new RegExp("language=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       language = decodeURIComponent(value[1]);
    }
  }
  var search = '"' + document.getElementById("search").value + '"';
  sparqlQuery = getSearchQuery(language, search);
  queryWikidata(sparqlQuery, createDivSearchProperties, "searchResults");
}
function createDivTranslationPathOptimized(divId, json) {
  createDivTranslationPath(divId, json, true, false);
}

function createDivTranslationPathVizOptimized(divId, json) {
  createDivTranslationPath(divId, json, true, true);
}

function createDivTranslationPathNonOptimized(divId, json) {
  createDivTranslationPath(divId, json, false);
}

function createDivTranslationPath(divId, json, optimized, visualization) {
  var languageData = {};
  languageData["labels"] = [];
  languageData["descriptions"] = [];
  languageData["aliases"] = [];
  const { head: { vars }, results } = json;
  var path = document.getElementById(divId);

  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  table.setAttribute("class", "path");
  td.innerHTML = "Time";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "L";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "D";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "A";
  th.appendChild(td);
  table.append(th);
  
  trMap = {};

  count = 0;
  for ( const result of results.bindings ) {
   var totalCount = 1;
   if(optimized) {
     totalCount = 15;
   }
   for (count=1; count<=totalCount; count++){
    var newEntry = false;
    tr = null;
    var comment = "";
    var time = "";
    if (optimized) {
      if ('comment'+count in result) {
        comment = result['comment'+count].value;
        time = result['time'+count].value;
      }
      else {
        continue;
      }
    }
    else {
      comment = result['comment'].value;
      time = result['time'].value;
    }
    comment = comment.replace(/\*\/.*/g, '') ;
    comment = comment.replace(/\/\* wb.*[0-9]| /, '');
    if (time + comment in trMap) {
      tr = trMap[time+comment];
    }
    alanguagedifflink = document.createElement("a"); 
    if (optimized) {
      alanguagedifflink.setAttribute('href', 
        "https://www.wikidata.org/wiki/Special:Diff/" +
          result['revision'+count].value);
    }
    else {
      alanguagedifflink.setAttribute('href', 
        "https://www.wikidata.org/wiki/Special:Diff/" +
          result['revision'].value);
    }

    atimepermalink = document.createElement("a"); 
    if (optimized) {
      atimepermalink.setAttribute('href', 
        "https://www.wikidata.org/wiki/Special:PermaLink/" +
          result['revision'+count].value);
    }
    else {
      atimepermalink.setAttribute('href', 
        "https://www.wikidata.org/wiki/Special:PermaLink/" +
          result['revision'].value);
    }
    if(tr == null) {
      tr = document.createElement("tr");
      tr.setAttribute('id', time + comment);
      trMap[time + comment] = tr;
      td = document.createElement("td"); 
      text = document.createTextNode(time);
      atimepermalink.append(text);
      td.appendChild(atimepermalink);
      tr.appendChild(td);
      newEntry = true;
    }

    if (optimized) {
      comment = result['comment'+count].value;
    }
    else {
      comment = result['comment'].value;
    }

    if (comment.indexOf('wbeditentity-create') != -1) {
      td = document.createElement("td"); 
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\* wbeditentity-create:[0-9]| /, '');
      comment = comment.replace('|', '');
      comment = comment.replace(" ", "");
      languageData["labels"].push(comment);
      text = document.createTextNode(comment);
      textDiv = document.createElement("div");
      textDiv.setAttribute('class', "pathlanguage");
      textDiv.style['background-color'] = '#002171';
      alanguagedifflink.append(text);
      textDiv.append(alanguagedifflink);
      td.appendChild(textDiv);
      tr.appendChild(td);
      td = document.createElement("td"); 
      tr.appendChild(td);
      td = document.createElement("td"); 
      tr.appendChild(td);
      table.appendChild(tr);
    }

    if (comment.indexOf('special-create-property') != -1) {
      td = document.createElement("td"); 
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\* special-create-property:[0-9]| /, '');
      comment = comment.replace('|', '');
      comment = comment.replace(" ", "");
      languageData["labels"].push(comment);
      text = document.createTextNode(comment);
      textDiv = document.createElement("div");
      textDiv.setAttribute('class', "pathlanguage");
      textDiv.style['background-color'] = '#002171';
      alanguagedifflink.append(text);
      textDiv.append(alanguagedifflink);
      td.appendChild(textDiv);
      tr.appendChild(td);
      td = document.createElement("td"); 
      tr.appendChild(td);
      td = document.createElement("td"); 
      tr.appendChild(td);
      table.appendChild(tr);
    }

    if (comment.indexOf('wbsetlabel-add') != -1) {
      td = document.createElement("td"); 
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\* wbsetlabel-add:[0-9]| /, '');
      comment = comment.replace('|', '');
      comment = comment.replace(" ", "");
      languageData["labels"].push(comment);
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[1].appendChild(textDiv);
      }
      else {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetdescription-add') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetdescription-add:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[2].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }
    if (comment.indexOf('wbsetaliases-add-remove') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetaliases-add-remove:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[3].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetaliases-add') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetaliases-add:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[3].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#002171';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetlabel-set') != -1) {
      td = document.createElement("td"); 
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\* wbsetlabel-set:[0-9]| /, '');
      comment = comment.replace('|', '');
      comment = comment.replace(" ", "");
      languageData["labels"].push(comment);
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[1].appendChild(textDiv);
      }
      else {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetdescription-set') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetdescription-set:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[2].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetaliases-set') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetaliases-set:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[3].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = '#0069c0';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetlabeldescriptionaliases') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetlabeldescriptionaliases:[0-9]| /, '');
      comment = comment.replace('|', '');
      comment = comment.replace(" ", "");
      languageData["labels"].push(comment);
      if(!newEntry) {
        text1 = document.createTextNode(comment);
        text2 = document.createTextNode(comment);
        text3 = document.createTextNode(comment);
        textDiv1 = document.createElement("div");
        textDiv2 = document.createElement("div");
        textDiv3 = document.createElement("div");
        textDiv1.setAttribute('class', "pathlanguage");
        textDiv1.style['background-color'] = '#0069c0';
        textDiv1.append(text1);

        textDiv2.setAttribute('class', "pathlanguage");
        textDiv2.style['background-color'] = '#0069c0';
        textDiv2.append(text2);

        textDiv3.setAttribute('class', "pathlanguage");
        textDiv3.style['background-color'] = '#0069c0';
        textDiv3.append(text3);
        tr.children[1].appendChild(textDiv1);
        tr.children[2].appendChild(textDiv2);
        tr.children[3].appendChild(textDiv3);
      }
      else {
        text1 = document.createTextNode(comment);
        text2 = document.createTextNode(comment);
        text3 = document.createTextNode(comment);
        textDiv1 = document.createElement("div");
        textDiv2 = document.createElement("div");
        textDiv3 = document.createElement("div");
        textDiv1.setAttribute('class', "pathlanguage");
        textDiv1.style['background-color'] = '#0069c0';
        textDiv1.append(text1);

        textDiv2.setAttribute('class', "pathlanguage");
        textDiv2.style['background-color'] = '#0069c0';
        textDiv2.append(text2);

        textDiv3.setAttribute('class', "pathlanguage");
        textDiv3.style['background-color'] = '#0069c0';
        textDiv3.append(text3);

        td = document.createElement("td"); 
        td.appendChild(textDiv1);
        tr.appendChild(td);
        td = document.createElement("td"); 
        td.appendChild(textDiv2);
        tr.appendChild(td);
        td = document.createElement("td"); 
        td.appendChild(textDiv3);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetlabel-remove') != -1) {
      td = document.createElement("td"); 
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\* wbsetlabel-remove:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[1].appendChild(textDiv);
      }
      else {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetdescription-remove') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetdescription-remove:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[2].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }

    if (comment.indexOf('wbsetaliases-remove') != -1) {
      comment = comment.replace(/\*\/.*/g, '') ;
      comment = comment.replace(/\/\*.*wbsetaliases-remove:[0-9]| /, '');
      comment = comment.replace('|', '');
      if(!newEntry) {
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        tr.children[3].appendChild(textDiv);
      }
      else {
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        tr.appendChild(td);
        td = document.createElement("td"); 
        text = document.createTextNode(comment);
        textDiv = document.createElement("div");
        textDiv.setAttribute('class', "pathlanguage");
        textDiv.style['background-color'] = 'red';
        alanguagedifflink.append(text);
        textDiv.append(alanguagedifflink);
        td.appendChild(textDiv);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }
   }
  }
  path.appendChild(table);
  console.log(languageData["labels"]);
  if(visualization)
    visualizePath(languageData);
}

function getTranslationPathQueryOptimized() {
  var property = "P3966";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       property = decodeURIComponent(value[1]);
    }
  }

  
  var sparqlQuery = `SELECT * {
     SERVICE wikibase:mwapi {
      bd:serviceParam wikibase:endpoint "www.wikidata.org" .
      bd:serviceParam wikibase:api "Generator" .
      bd:serviceParam mwapi:generator "revisions" .
      bd:serviceParam mwapi:titles "Property:` + property +`" .
      bd:serviceParam mwapi:grvprop "timestamp|comment" .
      bd:serviceParam mwapi:grvlimit "15".
      bd:serviceParam mwapi:prop  "revisions". `;
  for (i=1; i< 16; i++ ) { 
    sparqlQuery = sparqlQuery + 
        `?time`+ i +` wikibase:apiOutput "revisions/rev[`+i+`]/@timestamp" . 
         ?comment`+ i +` wikibase:apiOutput "revisions/rev[`+i+`]/@comment" .
         ?revision`+ i +` wikibase:apiOutput "revisions/rev[`+i+`]/@revid" .`;
    }
    sparqlQuery = sparqlQuery + `
      }
    }
    order by ?time1
    `;
    return sparqlQuery;
}

function getTranslationPathTableOptimized() {
    sparqlQuery = getTranslationPathQueryOptimized();
    queryWikidata(sparqlQuery, createDivTranslationPathOptimized, "translationPath");
}

function getTranslationPathVizOptimized() {
    sparqlQuery = getTranslationPathQueryOptimized();
    queryWikidata(sparqlQuery, createDivTranslationPathVizOptimized, "translationPath");
}

function getPath() {
  var property = "P3966";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       property = decodeURIComponent(value[1]);
    }
  }

  
  const sparqlQuery = `
     SELECT * {
     SERVICE wikibase:mwapi {
      bd:serviceParam wikibase:endpoint "www.wikidata.org" .
      bd:serviceParam wikibase:api "Generator" .
      bd:serviceParam mwapi:generator "revisions" .
      bd:serviceParam mwapi:titles "Property:` + property +`" .
      bd:serviceParam mwapi:grvprop "timestamp|comment" .
      bd:serviceParam mwapi:grvlimit "1".
      bd:serviceParam mwapi:prop  "revisions".
      ?time wikibase:apiOutput "revisions/rev[1]/@timestamp" . 
      ?comment wikibase:apiOutput "revisions/rev[1]/@comment" .
      ?revision wikibase:apiOutput "revisions/rev[1]/@revid" .
     }
    }
    order by ?time
    `;
  queryWikidata(sparqlQuery, createDivTranslationPath, "translationPath");
}
function createDivReferencesCount(divId, json) {
  const { head: { vars }, results } = json;
  var referencesCount = document.getElementById(divId);
  percentage  = parseFloat(results.bindings[0]["percentage"]["value"]).toFixed(2);
  var percentageDiv = document.createElement("h3");
  percentageDiv.innerHTML = "Total " + 
       results.bindings[0]["referencecount"]["value"]+
       " referenced statements from a total of " +
       results.bindings[0]["statementcount"]["value"] + 
       " statements (" + percentage + "%)";
  referencesCount.appendChild(percentageDiv);
}

function getReferencesCount() {
  var item = "P31";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       item = decodeURIComponent(value[1]);
    }
  }
  var div = document.getElementById("itemCode");
  div.innerHTML = item;

  const sparqlQuery = `
    SELECT (count(?reference) as ?referencecount ) (count(?statement) as ?statementcount ) (?referencecount*100/?statementcount as ?percentage)
    WITH {
      SELECT ?statement
      {
        [] p:` + item + ` ?statement
      }
    } AS %result
    WHERE {
      INCLUDE %result
      OPTIONAL{?statement prov:wasDerivedFrom ?reference}
    }
    `;
  queryWikidata(sparqlQuery, createDivReferencesCount, "referencesCount");
}

function getReferences() {
  var item = "P31";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       item = decodeURIComponent(value[1]);
    }
  }
  var div = document.getElementById("itemCode");
  div.innerHTML = item;

  const sparqlQuery = `
    SELECT ?statement ?prop ?reference
    {
      wd:` + item + ` ?prop ?statement.
      OPTIONAL{?statement prov:wasDerivedFrom ?reference}
      FILTER(REGEX(STR(?statement), "http://www.wikidata.org/entity/statement/"))
    }
    ORDER by ?statement
    `;
  queryWikidata(sparqlQuery, createDivReferences, "references");
}

function createDivReferences(divId, json) {
  const { head: { vars }, results } = json;
  var references = document.getElementById(divId);
  refs = {};
  for ( const result of results.bindings ) { 
    if (result["reference"] != undefined) {
      if (result['prop'].value in refs){
        refs[result['prop'].value] +=1;
      }
      else {
        refs[result['prop'].value] =1;
      }
    }
  }
  var statementTotal = document.createElement("h3");
  statementTotal.innerHTML = "Total " + Object.keys(refs).length + " reference statements" +
       " for a total of " + results.bindings.length + " statements";
  if (results.bindings.length != 0) {
    statementTotal.innerHTML = statementTotal.innerHTML +
        " ("+ ((Object.keys(refs).length * 100)/results.bindings.length).toFixed(2) + "%)"
  }
  references.appendChild(statementTotal);

  if(Object.keys(refs).length == 0) {
    return;
  }

  var table = document.createElement("table"); 
  var th = document.createElement("tr"); 
  var td = document.createElement("th"); 
  td.innerHTML = "Property";
  th.appendChild(td);
  td = document.createElement("th"); 
  td.innerHTML = "Number of statements";
  th.appendChild(td);
  table.append(th);
  data = Object.keys(refs);
  for ( i=0; i<data.length; i++) {
    tr = document.createElement("tr");

    td = document.createElement("td"); 
    td.setAttribute('class', "property");
    var a = document.createElement("a"); 
    a.setAttribute('href', data[i]);
    var text = document.createTextNode(data[i].replace("http://www.wikidata.org/prop/",""));
    a.append(text);
    td.appendChild(a);
    tr.appendChild(td);
  
    td = document.createElement("td"); 
    text = null;
    text = document.createTextNode(refs[data[i]]);
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);
    
  }
  references.appendChild(table);
}

function getEquivalentProperties() {
  var item = "P31";
  if(window.location.search.length > 0) {
    var reg = new RegExp("property=([^&#=]*)");
    var value = reg.exec(window.location.search);
    if (value != null) {
       item = decodeURIComponent(value[1]);
    }
  }

  const sparqlQuery = `
    SELECT ?equivproperty
    {
      wd:`+ item +` wdt:P1628 ?equivproperty
    }

    `;
  queryWikidata(sparqlQuery, createDivExternalLinks, "externalEquivProperties");
}

function createDivExternalLinks(divId, json) {
  const { head: { vars }, results } = json;
  var references = document.getElementById(divId);
  refs = {};
  var statementTotal = document.createElement("h3");
  statementTotal.innerHTML = "Total " + results.bindings.length + " equivalent properties on external sources";
  references.appendChild(statementTotal);
}

function getLinks() {
  getReferences();
  getReferencesCount();
  getEquivalentProperties();
}
document.onkeydown = function(event) {
  event = event || window.event;
  if (event.keyCode == '13') {
    var search = document.getElementById("headersearchtext").value;
    window.location="./search.html?search="+ search;
    findProperty(event); 
  } 
}

/* Models*/
class Language {
  constructor() {
  }
}

class DataType {
  constructor() {
  }
}

class Property {
  constructor() {
  }
}

class PropertyClass {
  constructor() {
  }
}

class PropertyDiscussion {
  constructor() {
  }
}

class Reference {
  constructor() {
  }
}

class WikiProject {
  constructor() {
  }
}

/* View*/
class LanguageView {
  constructor() {
  }
}

class DataTypeView {
  constructor() {
  }
}

class PropertyView {
  constructor() {
  }
}

class PropertyClassView {
  constructor() {
  }
}

class PropertyDiscussionView {
  constructor() {
  }
}

class ReferenceView {
  constructor() {
  }
}

class SearchView {
  constructor() {
  }
}

class ComparisonView {
  constructor() {
  }
}

class WikiProjectView {
  constructor() {
  }
}

/* Controller*/
class LanguageController {
  constructor(model, view) {
  }
}

class DataTypeController {
  constructor() {
  }
}

class PropertyController {
  constructor() {
  }
}

class PropertyClassController {
  constructor() {
  }
}

class PropertyDiscussionController {
  constructor() {
  }
}

class ReferenceController {
  constructor() {
  }
}

class SearchController {
  constructor() {
  }
}

class ComparisonController {
  constructor() {
  }
}

class WikiProjectController {
  constructor() {
  }
}
