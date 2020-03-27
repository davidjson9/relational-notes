import React, { Component } from 'react';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  RichUtils,
  Editor,
  EditorState,
  Modifier,
  convertFromHTML,
  ContentState
} from 'draft-js';

import ConsoleButtons from '../ConsoleButtons';
import SimpleLog from './SimpleLog.js';

const rawContent = {
  blocks: [
    {
      text: (
        'This is an "immutable" entity: Superman. Deleting any ' +
        'characters will delete the entire entity. Adding characters ' +
        'will remove the entity from the range.'
      ),
      type: 'unstyled',
      entityRanges: [
        {
          offset: 31,
          length: 8,
          key: 'first'
        }
      ]
    }, {
      text: '',
      type: 'unstyled'
    }, {
      text: (
        'This is a "mutable" entity: Batman. Characters may be added ' +
        'and removed.'
      ),
      type: 'unstyled',
    }, {
      text: '',
      type: 'unstyled'
    }, {
      text: (
        'This is a "segmented" entity: Green Lantern. Deleting any ' +
        'characters will delete the current "segment" from the range. ' +
        'Adding characters will remove the entire entity from the range.'
      ),
      type: 'unstyled',
    }
  ],
  entityMap: {
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE'
    },
    second: {
      type: 'TOKEN',
      mutability: 'MUTABLE'
    },
    third: {
      type: 'TOKEN',
      mutability: 'SEGMENTED'
    }
  }
};

export default class EntityEditorExample extends Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      }, {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan
      }, {
        strategy: getEntityStrategy('SEGMENTED'),
        component: TokenSpan
      }
    ]);
    const blocks = convertFromRaw(rawContent);
    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator),
      addEntityInputs: {
        type: 'TOKEN',
        mutability: 'IMMUTABLE',
        data: '',
      },
      savedBlocks: [],
      savedEntities: {}
    };

    this.setSavedBlocks = (savedBlocks) => {
      this.setState({
        savedBlocks
      });
    }

    this.setEntities = (savedEntities) => {
      this.setState({
        savedEntities
      });
    }

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.setState(
        { editorState },
        () => this.getEntityAtSelection(this.state.editorState),
      );
      if (true) {
        // console.log("hello");
        var selectionState = editorState.getSelection();
        var startKey = selectionState.getStartKey();
        var endKey = selectionState.getEndKey();
        var anchorKey = selectionState.getAnchorKey();
        var currentContent = editorState.getCurrentContent();
        var currentContentBlock = currentContent.getBlockForKey(anchorKey);
        var start = selectionState.getStartOffset();
        var end = selectionState.getEndOffset();
        var selectedText = currentContentBlock.getText().slice(start, end);
        // console.log(start, end, startKey, endKey);

      };
    }


    this.logContentState = () => {
      const content = this.state.editorState.getCurrentContent();
      this.props.consoleLog(JSON.stringify(content.toJS(), null, 4));
    };
    this.logRawContentState = () => {
      const content = convertToRaw(this.state.editorState.getCurrentContent());

      var entities = content.entityMap;
      var content_blocks = [];
      for (let i = 0; i < content.blocks.length; i++) {

        if (content.blocks[i].entityRanges.length > 0) {
          content_blocks.push(content.blocks[i])
        }
      }

      // console.log(entities, content_blocks)

      this.setSavedBlocks(content_blocks);
      this.setEntities(entities);

      //this.props.consoleLog(JSON.stringify(convertToRaw(content), null, 4));
    };
    this.setEntityButtonHandler = () => this.setEntityAtSelection(this.state.addEntityInputs);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);

  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  setEntityAtSelection = ({ type, mutability, data }) => {
    const editorState = this.state.editorState;
    const contentstate = editorState.getCurrentContent();

    // Returns ContentState record updated to include the newly created DraftEntity record in it's EntityMap.
    let newContentState = contentstate.createEntity(type, mutability, { url: data });

    // Call getLastCreatedEntityKey to get the key of the newly created DraftEntity record.
    const entityKey = contentstate.getLastCreatedEntityKey();

    // Get the current selection
    const selectionState = this.state.editorState.getSelection();

    // Add the created entity to the current selection, for a new contentState
    newContentState = Modifier.applyEntity(
      newContentState,
      selectionState,
      entityKey
    );

    // Add newContentState to the existing editorState, for a new editorState
    const newEditorState = EditorState.push(
      this.state.editorState,
      newContentState,
      'apply-entity'
    );

    this.onChange(newEditorState);
  }

  getEntityAtSelection = (editorState) => {
    const selectionState = editorState.getSelection();
    const selectionKey = selectionState.getStartKey();
    const contentstate = editorState.getCurrentContent();

    // The block in which the selection starts
    const block = contentstate.getBlockForKey(selectionKey);

    // Entity key at the start selection
    const entityKey = block.getEntityAt(selectionState.getStartOffset());
    if (entityKey) {
      // The actual entity instance
      const entityInstance = contentstate.getEntity(entityKey);
      const entityInfo = {
        type: entityInstance.getType(),
        mutability: entityInstance.getMutability(),
        data: entityInstance.getData(),
      }
      // this.props.consoleLog(JSON.stringify(entityInfo, null, 4));
    } else {
      // this.props.consoleLog("No entity present at current selection!");
    }
  }

  render() {
    return (
      <div>
        <ConsoleButtons
          buttons={[
            {
              onClick: this.logRawContentState,
              text: "Save",
            },
            {
              onClick: this.setEntityButtonHandler,
              text: "Add Tag"
            },
          ]}
        />
        {/* <NewEntityInputs
					setAddEntityInputs={this.setAddEntityInputs}
					addEntityInputs={this.state.addEntityInputs}
				/> */}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="Enter some text..."
            ref="editor"
          />
        </div>
        <SimpleLog
          savedBlocks={this.state.savedBlocks}
          savedEntities={this.state.savedEntities}
        />


      </div>
    );
  }
}

function getEntityStrategy(mutability) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE':
      return styles.immutable;
    case 'MUTABLE':
      return styles.mutable;
    case 'SEGMENTED':
      return styles.segmented;
    default:
      return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(props.contentState.getEntity(props.entityKey).getMutability());
  return (
    <span data-offset-key={props.offsetkey} style={style}>
      {props.children}
    </span>
  );
};

const styles = {
  editor: {
    // border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  immutable: {
    backgroundColor: 'rgba(191, 63, 63, 0.2)',
    padding: '2px 0'
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0'
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0'
  }
};
