import React, { Component }  from 'react';
import { MegadraftEditor, MegadraftIcons, MyPageLinkIcon } from 'megadraft';
var ReactDOM = require('react-dom');
import {Editor, EditorState,RichUtils, convertToRaw,getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import Graph from "react-graph-vis";

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

GRAPH_DOM = (props) => {
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
    <Graph graph={graph} options={options} events={events} style={{ height: "240px" }} />
  </div>,
  document.getElementById("GRAPH")
);
}
  /*------------------------------------------------------------------------------------------*/
  handleClick = (event) => {
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var id_kursora = selectionState.focusOffset
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    console.log(id_kursora+text)
    axios.get('/one_word', {
    params: {
      ID: id_kursora,
      content: text
    }
  })
.then(function(response){
  var dataforwordRAW_subclass = response.data.subclass_of_list_response;
  var dataforwordLIST_subclass = dataforwordRAW_subclass.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_subclass}</ul>,document.getElementById('SUBCLASSES_CLASS'))

var dataforwordRAW_class_above = response.data.classes_above_list_response;
var dataforwordLIST_class_above = dataforwordRAW_class_above.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_class_above}</ul>,document.getElementById('UPPERCLASSES_CLASS'))

var dataforwordRAW_INDI_CLASS = response.data.instances_from_the_clicked_class_list_response;
var dataforwordLIST_INDI_CLASS = dataforwordRAW_INDI_CLASS.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_INDI_CLASS}</ul>,document.getElementById('INDI_CLASS'))

var dataforwordRAW_CLASS_INDI = response.data.sorted_above_INDI_list_response;
var dataforwordLIST_CLASS_INDI = dataforwordRAW_CLASS_INDI.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_CLASS_INDI}</ul>,document.getElementById('CLASS_INDI'))

var dataforwordRAW_INDI_INDI = response.data.instances_from_the_same_class_list_response;
var dataforwordLIST_INDI_INDI = dataforwordRAW_INDI_INDI.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_INDI_INDI}</ul>,document.getElementById('INDI_INDI'))

var dataforwordRAW_REL_INDI = response.data.relations_result_list_response;
var dataforwordLIST_REL_INDI = dataforwordRAW_REL_INDI.map(function(variable)
{return <li><a href = '#'>{variable}</a></li>;})
ReactDOM.render(<ul>{dataforwordLIST_REL_INDI}</ul>,document.getElementById('REL_INDI'))
})
  .catch(function (error) {
    console.log(error);
  });
  }
  /*-------------------------------------------------------------------------------------------*/
  _search_all(props){
    const {editorState} = this.state;
    var selectionState = editorState.getSelection();
    var id_kursora = selectionState.focusOffset
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var text = currentContentBlock.getText();
    let html = stateToHTML(currentContent);
    let contentState = stateFromHTML(html);
    var globalObject = this;
    console.log(html)
    console.log(text)
  axios.get('/search_all',{params: {content:text}})
        .then(function(response){
 var words_in = response.data.response_search_all_list
console.log(words_in)
    var newHTMLContent = html;
    words_in.forEach(currentWord => {
          console.log(words_in)
          console.log(currentWord)
          newHTMLContent = newHTMLContent.replace(currentWord,'<strong>'+currentWord+'</strong>');
        });
    globalObject.setState({
      editorState: EditorState.createWithContent(stateFromHTML(newHTMLContent))
    });
 var words_in_list = words_in.map(function(variable){
 return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{words_in_list}</ul>,document.getElementById('SEARCH_ALL_DOM'))
   }).catch(function(error){
     console.log(error);
   });
 }

  /*-------------------------------------------------------------------------------------------*/

  _data_OWL_CLASSES(props){
  axios.get('/OWL_DATA_CLASSES',{})
        .then(function(response){
     console.log(response.data);
   console.log(response.status);
   console.log(response.statusText);
   console.log(response.headers);
   console.log(response.config);
 var dataCLASSES = response.data.dataCLASSESback
 var dataCLASSESlist = dataCLASSES.map(function(variable){
 return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{dataCLASSESlist}</ul>,document.getElementById('OWL_DATA_CLASSES'))
   }).catch(function(error){
     console.log(error);

	var tymczasowa_lista = ['TEST ERROR' , '2', '3', '4', '5','6','7']
	var list = tymczasowa_lista.map(function(variable){
	return <ol><a href = '#'>{variable}</a></ol>;
	 });
	  ReactDOM.render(<ul>{list}</ul>,document.getElementById('OWL_DATA_CLASSES'))
   });
 }
/*-------------------------------------------------------------------------------*/
 _data_OWL_INDIVIDUALS(props){
 axios.get('/OWL_DATA_INDIVIDUALS',{})
       .then(function(response){
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
var dataIND = response.data.dataINDIback
var dataINDlist = dataIND.map(function(variable){
return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{dataINDlist}</ul>,document.getElementById('OWL_DATA_INDIVIDUALS'))
  }).catch(function(error){
    console.log(error);
  });
}
  /*-------------------------------------------------------------------------------------------*/
_data_OWL_OBJECT_PROPERTIES(props){
axios.get('/OWL_DATA_OBJECT_PROPERTIES',{})
      .then(function(response){
   console.log(response.data);
 console.log(response.status);
 console.log(response.statusText);
 console.log(response.headers);
 console.log(response.config);
var dataPROPERTIES = response.data.dataPROPERTIESback
var dataPROPERTIESlist = dataPROPERTIES.map(function(variable){
return <li><a href = '#'>{variable}</a></li>;
});
ReactDOM.render(<ul>{dataPROPERTIESlist}</ul>,document.getElementById('OWL_DATA_OBJECT_PROPERTIES'))
 }).catch(function(error){
   console.log(error);
 });
}
/*-------------------------------------------------------------------------------------------*/
_data_OWL_LIB1(props){
axios.get('/OWL_DATA_LIB_button1',{})
      .then(function(response){
ReactDOM.render(document.getElementById('LIB'))
 }).catch(function(error){

 });
}
/*-------------------------------------------------------------------------------------------*/
_data_OWL_LIB2(props){
axios.get('/OWL_DATA_LIB_button2',{})
      .then(function(response){
ReactDOM.render(document.getElementById('LIB'))
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
    <div id='content'>
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
		<div id  = 'wynik'>
    <div id  = 'LIB'>
    Please choose which ontology do you want  to use.
<button onClick={this._data_OWL_LIB1.bind(this)}> PEOPLE </button>
<button onClick={this._data_OWL_LIB2.bind(this)}> GUNS </button>
    </div>
    <div id = 'SEARCH_ALL_DOM_BUTTON'>
    <button onClick={this._search_all.bind(this)}> Click to analize currently input text </button>
    </div>
    <div id = 'SEARCH_ALL_DOM'> In this place all words that are in dictionary of choosen discipline, will display.</div>
    <div id = 'GRAPH'>
<button onClick={this.GRAPH_DOM.bind(this)}>Click to show subclasses of Gun</button>
    </div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a class - upperclasses of this class will display below.</div>
    <div id  = 'UPPERCLASSES_CLASS'></div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a class - subclasses of this class will display below.</div>
    <div id  = 'SUBCLASSES_CLASS'></div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a class - individuals of this class will display below.</div>
    <div id  = 'INDI_CLASS'></div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a individual - upperclasses of this individual will display below.</div>
    <div id  = 'CLASS_INDI'></div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a individual - siblings of this individual will display below.</div>
    <div id  = 'INDI_INDI'></div>
    <div id  = 'ONE_WORD_INFO'>If pressed word is a individual - relacions of this individual will display below.</div>
    <div id  = 'REL_INDI'></div>

    <div id = 'OWL_DATA_CLASSES_BUTTON'>
    <button onClick={this._data_OWL_CLASSES.bind(this)}>Click to show Classes defined in the ontology</button>
    </div>
    <div id  = 'OWL_DATA_CLASSES'>Click the above button to see all classes defined in the ontology.</div>
    <div id = 'OWL_DATA_INDIVIDUALS_BUTTON'>
    <button onClick={this._data_OWL_INDIVIDUALS.bind(this)}>Click to show The individuals (or instances) defined in the ontology</button>
    </div>
    <div id  = 'OWL_DATA_INDIVIDUALS'>Click the above button to see all individuals defined in the ontology.</div>
    <div id = 'OWL_DATA_OBJECT_PROPERTIES_BUTTON'>
    <button onClick={this._data_OWL_OBJECT_PROPERTIES.bind(this)}>Click to show ObjectProperties defined in the ontology</button>
    </div>
    <div id  = 'OWL_DATA_OBJECT_PROPERTIES'>Click the above button to see all object properties defined in the ontology.</div>
    </div>
    </div>
    );
  }
}
