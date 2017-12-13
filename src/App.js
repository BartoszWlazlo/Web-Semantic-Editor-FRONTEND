import React, { Component }  from 'react';
import { MegadraftEditor, MegadraftIcons, MyPageLinkIcon } from 'megadraft';
import {Editor, EditorState,RichUtils, convertToRaw,getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import Graph from "react-graph-vis";

const {hasCommandModifier} = KeyBindingUtil;

var ReactDOM = require('react-dom');
var axios = require('axios');
var qs = require('qs');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState})
    this.onClick = this.handleClick.bind(this);
  }
/*-----------------------------------------------------------------*/
GRAPH = (props) => {
const graph = {
  nodes: [
    { id: 1, label: "Gun"},
    { id: 2, label: "Pistol"},
    { id: 3, label: "AutomaticPistol"},
    { id: 4, label: "Revolver"},
    { id: 5, label: "Caliber"}
  ],
  edges: [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 2, to: 4 }]
};
const options = {
  edges: {
    color: "#000000",
    shadow: true,
    smooth: true,
  }
};
const events = {
  select: function(event) {
    var { nodes, edges } = event;
    console.log("Selected nodes:");
    console.log(nodes);
    console.log("Selected edges:");
    console.log(edges);
  }
};
ReactDOM.render(
  <div>
    <Graph graph={graph} options={options} events={events} style={{ height: "220px" }} />
  </div>,
  document.getElementById("graph_div")
);
}
/*------------------------------------------------------------------------------------------*/
  handleClick = (event) => {
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var cursor_id = selectionState.focusOffset
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    axios.get('/one_word', {
    params: {ID: cursor_id,content: text}
  })

  .then(function(response){
    var subclass = response.data.subclasses_of_class_response;
    var mapped_subclass = subclass.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_subclass}</ul>,document.getElementById('subclasses_of_class_div'))

  var class_above = response.data.classes_above_class_response;
  var mapped_class_above = class_above.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_class_above}</ul>,document.getElementById('classes_above_class_div'))

  var individuals_of_class = response.data.individuals_of_class_response;
  var mapped_individuals_of_class = individuals_of_class.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_individuals_of_class}</ul>,document.getElementById('individuals_of_class_div'))

  var classes_of_individual = response.data.classes_of_individual_response;
  var mapped_classes_of_individual = classes_of_individual.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_classes_of_individual}</ul>,document.getElementById('classes_of_individual_div'))

  var twin_individual = response.data.twin_individual_response;
  var mapped_twin_individual = twin_individual.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_twin_individual}</ul>,document.getElementById('twin_individual_div'))

  var relations = response.data.relations_response;
  var mapped_relations = relations.map(function(variable)
  {return <li><a href = '#'>{variable}</a></li>;})
  ReactDOM.render(<ul>{mapped_relations}</ul>,document.getElementById('relations_div'))
  })

  .catch(function (error) {
    console.log(error);
  });
  }
/*-------------------------------------------------------------------------------------------*/
  _search_all(props){
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    let html = stateToHTML(currentContent);
    let contentState = stateFromHTML(html);
    var globalObject = this;
  axios.get('/search_all',{params: {content:text}})
        .then(function(response){
 var words_in = response.data.search_all_response;
    var newHTMLContent = html;
    words_in.forEach(currentWord => {
          newHTMLContent = newHTMLContent.replace(currentWord,'<strong>'+currentWord+'</strong>');
        });
    globalObject.setState({
      editorState: EditorState.createWithContent(stateFromHTML(newHTMLContent))
    });

   }).catch(function(error){
     console.log(error);
   });
 }
/*-------------------------------------------------------------------------------------------*/
  _DISP_CLASSES(props){
  axios.get('/DISP_ALL_CLASSES',{})
        .then(function(response){
 var classes = response.data.all_classes_response;
 var mapped_classes = classes.map(function(variable){
 return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{mapped_classes}</ul>,document.getElementById('all_classes_from_ontology_div'))
   }).catch(function(error){
     console.log(error);
   });
 }
/*-------------------------------------------------------------------------------*/
 _DISP_INDIVIDUALS(props){
 axios.get('/DISP_ALL_INDIVIDUALS',{})
       .then(function(response){
var individuals = response.data.all_individuals_response;
var mapped_individuals = individuals.map(function(variable){
return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{mapped_individuals}</ul>,document.getElementById('all_individuals_from_ontology_div'))
  }).catch(function(error){
    console.log(error);
  });
}
/*-------------------------------------------------------------------------------------------*/
_DISP_RELATIONS(props){
axios.get('/DISP_ALL_RELACTIONS',{})
      .then(function(response){
var relations = response.data.all_relations_response;
var mapped_relations = relations.map(function(variable){
return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{mapped_relations}</ul>,document.getElementById('all_relations_from_ontology_div'))
 }).catch(function(error){
   console.log(error);
 });
}
/*-------------------------------------------------------------------------------------------*/
_LOAD_ONTOLOGY_1(props){
axios.get('/LOAD_ONTOLOGY_1_IN_BACKEND',{})
      .then(function(response){
ReactDOM.render(document.getElementById('load_ontology_div'))
 }).catch(function(error){

 });
}
/*-------------------------------------------------------------------------------------------*/
_LOAD_ONTOLOGY_2(props){
axios.get('/LOAD_ONTOLOGY_2_IN_BACKEND',{})
      .then(function(response){
ReactDOM.render(document.getElementById('load_ontology_div'))
 }).catch(function(error){

 });
}
/*-------------------------------------------------------------------------------------------*/

  render() {
    const megadraftActions = [
      { type: "inline", label: "B", style: "BOLD", icon: MegadraftIcons.BoldIcon },
      { type: "inline", label: "I", style: "ITALIC", icon: MegadraftIcons.ItalicIcon },
      {type: "inline", label: "U", style: "UNDERLINE", icon: MegadraftIcons.BoldIcon},
      { type: "separator" },
      { type: "block", label: "UL", style: "unordered-list-item", icon: MegadraftIcons.ULIcon },
      { type: "block", label: "OL", style: "ordered-list-item", icon: MegadraftIcons.OLIcon },
      { type: "block", label: "H2", style: "header-two", icon: MegadraftIcons.H2Icon },
      { type: "block", label: "QT", style: "blockquote", icon: MegadraftIcons.BlockQuoteIcon }
    ];
    return (
    <div id='content_div'>
      <div className='editor' onClick={this.onClick}>
          <MegadraftEditor
      editorState={this.state.editorState}
			handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
			handleKeyCommand={this.handleKeyCommand}
			keyBindingFn={this.keyBindingFn}
      handleBeforeInput={this.handleBeforeInput}
      handlePastedText={this.handlePastedText}
      actions={megadraftActions}
        />
    </div>
		<div id  = 'result_div'>
    <div id  = 'load_ontology_div'>
    Please choose which ontology do you want  to use.
    <button onClick={this._LOAD_ONTOLOGY_1.bind(this)}> PEOPLE </button>
    <button onClick={this._LOAD_ONTOLOGY_2.bind(this)}> GUNS </button>
    </div>
    <div id = 'small_div'>
    <button onClick={this._search_all.bind(this)}> Click here to analize text </button>
    </div>
    <div id  = 'big_div'>If chosen word is a class - its upperclasses will display here:</div>
    <div id  = 'classes_above_class_div'></div>
    <div id  = 'big_div'>If chosen word is a class - its subclasses will display here:</div>
    <div id  = 'subclasses_of_class_div'></div>
    <div id  = 'big_div'>If chosen word is a class - its individuals will display here:</div>
    <div id  = 'individuals_of_class_div'></div>
    <div id  = 'big_div'>If chosen word is an individual - its upperclasses will display here:</div>
    <div id  = 'classes_of_individual_div'></div>
    <div id  = 'big_div'>If chosen word is an individual - its siblings will display here:</div>
    <div id  = 'twin_individual_div'></div>
    <div id  = 'big_div'>If chosen word is an individual - its relations will display here:</div>
    <div id  = 'relations_div'></div>

    <div id = 'small_div'><button onClick={this._DISP_CLASSES.bind(this)}>Click to show all classes defined in the ontology</button></div>
    <div id  = 'all_classes_from_ontology_div'>Click the above button to see all classes defined in the ontology.</div>

    <div id = 'big_div'><button onClick={this._DISP_INDIVIDUALS.bind(this)}>Click to show all individuals defined in the ontology</button></div>
    <div id  = 'all_individuals_from_ontology_div'>Click the above button to see all individuals defined in the ontology.</div>

    <div id = 'small_div'><button onClick={this._DISP_RELATIONS.bind(this)}>Click to show all relations defined in the ontology</button></div>
    <div id  = 'all_relations_from_ontology_div'>Click the above button to see all relations defined in the ontology.</div>

    <div id = 'graph_div'>
    <button onClick={this.GRAPH.bind(this)}>Click here to render the graph</button>
    </div>
    </div>
    </div>
    );
  }
}
