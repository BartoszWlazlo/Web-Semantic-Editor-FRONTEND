import React from 'react';
var ReactDOM = require('react-dom');
import {Editor, EditorState,RichUtils, convertToRaw,getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

import { createStore } from 'redux';

var axios = require('axios');
var qs = require('qs');









export default class App extends React.Component {
	
  constructor(props) {
    super(props);
	
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState})
	
	
	
	

	
  }
  
  
  
  keyBindingFn = (event) => {
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 75) { return 'bbbold'; }    
    return getDefaultKeyBinding(event);
  }
	
	
	handleKeyCommand = (command) => {
    let newState;
    if (command === 'bbbold') {
      newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
    }

    if (newState) {
      this.setState({ editorState: newState });
      return 'handled';
    }
    return 'not-handled';
  }
	
	
  
  
  
  
  _wordClick(props){

	 const {editorState} = this.state;

	 const contentState = convertToRaw( editorState.getCurrentContent());
	 const x = editorState.getCurrentContent();
      var synrequest = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

	/*to odpowiada za pobieranie zaznaczenia*/
      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);
        
	 
	 axios.get('/background_process?proglang='+selectedText,{})
         .then(function(response){
		  
		  console.log(response.data);
	/*console log odpowiada za wyswietlanie co jest pbierane z serwera(na stronie sie nie wyswietla)*/	  
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
	
		/*response.data.result to pobrana lista synonimow*/
	var synonyms = response.data.result	  
	
		
	var synolist = synonyms.map(function(person){
  
	return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('synonim_menu'))
		 
		 
	  
    }).catch(function(error){
		/*!!!!!!!!! tu macie robienie listy synonimow bez serwera(gdy jest błąd 404 bo nie ma serwera)*/
      console.log(error);
	  
	var tymczasowa_lista = ['dog' , 'cat', 'costam', 'xd', 'xd']	
	/*map robi liste slow */
	var synolist = tymczasowa_lista.map(function(person){
	return <li><a href = '#'>{person}</a></li>;
	 });
	  ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('synonim_menu'))
    }); 
	  
  }
  /*------------------------------------------------------------------------------------------*/
  
  _send(props){
	axios.get('/background_process?proglang=')  
	  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }
  
  
  
  
  
  /*-------------------------------------------------------------------------------------------*/
  
   
  
  
  
  
  
  /*-------------------------------------------------------------------------------------------*/
  
  render() {
      const {editorState} = this.state;
	  
	 
	  
	  
      var synrequest =  JSON.stringify(convertToRaw(editorState.getCurrentContent()))
	  const x = editorState.getSelection();

      var usersWithName = synrequest
	  /*y odpowiada za pobieranie samego tekstu z edytora*/
      const y = editorState.getCurrentContent().getPlainText()

	/*to odpowiada za pobieranie zaznaczenia*/
      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);

    return (
        
      <div id='content'>
        
		
		<div id  = 'menu'>
		/*to jest przycisk ktory wywołuje funkcje _wordclick(zdefiniowana wyzej)*/
		<button onClick={this._wordClick.bind(this)}>Synonims</button>
		
		</div>
		
		<div id  = 'menu2'>
		<h2>JS editor</h2>
		</div>
		
        <div className='editor'>
		
		 
          <Editor
            editorState={this.state.editorState}
			handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
			handleKeyCommand={this.handleKeyCommand}
			keyBindingFn={this.keyBindingFn}
			
			
			
			placeholder = 'tutaj wpisz tekst....'
			
			
          />
        
			
        </div>
		<div id  = 'app'>
		
		<div id  = 'synonim_menu'>synonimy</div>
		<div id = 'statystyki_tekstu'>statystyki tekstu</div>
		<div id = 'definicja'>definicja</div>
		<div id = 'ontologie'>ontologie</div>
		
		
		
		</div>
		
		
		/*tu jest wyswietlanie roznych zmienych (bedzie usunięte) */
		<div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>
		  <div>'------------------------'</div>
         <div>get selection:   {x}</div>
		  <div>{anchorKey}</div>

           <div> pobieranie tekstu z edytora{y}</div>
           <div>zaznaczony tekst {selectedText}</div>
		
		
      </div>
    );
  }
}