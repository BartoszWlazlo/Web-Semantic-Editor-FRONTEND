import React from 'react';
var ReactDOM = require('react-dom');
import {Editor, EditorState,RichUtils, convertToRaw} from 'draft-js';

var axios = require('axios');
var qs = require('qs');

export default class App extends React.Component {
	
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

  }
  
  _wordClick(props){

	 const {editorState} = this.state;

	 const contentState = convertToRaw( editorState.getCurrentContent());
	 const x = editorState.getCurrentContent();
      var synrequest = JSON.stringify(convertToRaw(editorState.getCurrentContent()))


      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);
        
	 
	 axios.get('/background_process?proglang='+selectedText,
	 
	 
	 
	 
	 
	 
	 
	 {
	     
     })
         .then(function(response){
		  
		  console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
		  
	var synonyms = response.data.result	  
		
	var peopleLIs = synonyms.map(function(person){
  // return statement goes here:
	return <li>{person}</li>;
});
ReactDOM.render(<ul>{peopleLIs}</ul>,document.getElementById('app'))
	
		  
		  
      
	  
	  
	  
	  
    }).catch(function(error){
      console.log(error);
    }); 
	  
  }
  
  render() {
      const {editorState} = this.state;
      var synrequest =  JSON.stringify(convertToRaw(editorState.getCurrentContent()))
	  const x = editorState.getSelection();

      var usersWithName = synrequest
      const y = editorState.getCurrentContent().getPlainText()

      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);

    return (
        
      <div id='content'>
        <h1>Draft.js Editor</h1>
		
		<button onClick={this._wordClick.bind(this)}>Synonims</button>
        <div className='editor'>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
			
			
          />
          <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>
		  <div>'------------------------'</div>
          <div>get selection:   {x}</div>
		  <div>{anchorKey}</div>

            <div> pobieranie tekstu z edytora{y}</div>
            <div>zaznaczony tekst {selectedText}</div>
			<div id  = 'app'></div>
        </div>
		
      </div>
    );
  }
}