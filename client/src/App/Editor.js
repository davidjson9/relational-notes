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
import debounce from 'lodash/debounce';

import { Button, Card, Accordion } from 'react-bootstrap';
import { saveCard, fetchTagEntries } from '../API'
import CreatableSelect from 'react-select/creatable';

export default class EntityEditorExample extends Component {
  constructor(props) {
    super(props);

    const blocks = convertFromRaw({
      blocks: this.props.savedBlocks,
      entityMap: this.props.savedEntities
    });

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      }
    ]);

    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator),
      addEntityInputs: {
        type: 'TOKEN',
        mutability: 'IMMUTABLE',
        data: '',
      },
      id: this.props.id,
      savedBlocks: [],
      savedEntities: {},
      isMouseTooltipVisible: false,
      isLoading: false,
      tags: this.props.savedTags

    };

    this.handleAddTag = (newValue, actionMeta) => {
      console.group('Value Changed');
      console.log(newValue);
      console.log(`action: ${actionMeta.action}`);
      console.groupEnd();

      if (actionMeta.action == "create-option") {
        var newTag = newValue[newValue.length - 1].label;
        this.props.addTag(newTag);
      }

      // const tags = newValue.map(tagObj => tagObj.label);
      const tags = newValue;
      this.setState({
        tags
      });

      console.log(tags);
      this.saveCard();


    }

    this.setLoading = (isLoading) => {
      this.setState({
        isLoading
      });
    }

    this.saveCard = debounce(async () => {
      try {
        this.setLoading(true);
        const contentState = convertToRaw(this.state.editorState.getCurrentContent())
        // data.rawContent = contentState;
        // console.log(JSON.stringify(contentState));
        const data = {
          // contentBlocks: [],
          id: this.state.id,
          tags: this.state.tags,
          rawContent: JSON.stringify(contentState),
        }
        const response = await saveCard(data);
        this.setLoading(false);
      } catch (error) {
        console.log(error);
        this.setLoading(false);
      }
    }, 1000)

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
      if (editorState.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
        this.saveCard();

      }

      this.setState(
        { editorState },
        () => this.getEntityAtSelection(this.state.editorState),
      );

      // var selectionState = editorState.getSelection();
      // var startKey = selectionState.getStartKey();
      // var endKey = selectionState.getEndKey();
      // var anchorKey = selectionState.getAnchorKey();
      // var currentContent = editorState.getCurrentContent();
      // var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      // var start = selectionState.getStartOffset();
      // var end = selectionState.getEndOffset();
      // var selectedText = currentContentBlock.getText().slice(start, end);
      // console.log(start, end, startKey, endKey);

      // console.log(startKey, endKey, startKey == endKey);

      // if (startKey !== endKey || Math.abs(end - start) > 0) {
      //   console.log("selection found!");
      //   var event = new MouseEvent('activateClickBox');
      //   console.log(event);
      //   window.dispatchEvent(event);
      // }
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

    this.disableMouseTooltip = () => {
      // the first argument is always going to be the previous state
      this.setState({ isMouseTooltipVisible: false });
    };

    this.enableMouseTooltip = () => {
      // the first argument is always going to be the previous state
      this.setState({ isMouseTooltipVisible: true });
      console.log("should be true now");

    };

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
    var rawContent = {
      blocks: this.props.savedBlocks,
      entityMap: this.props.savedEntities
    }

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      }
    ]);

    var editorState = EditorState.createWithContent(convertFromRaw(rawContent), decorator);
    console.log("PROPS", this.props.savedTags);
    return (
      <>
        {/* <MouseTooltip
          visible={this.state.isMouseTooltipVisible}
          offsetX={15}
          offsetY={10}
          enableMouseTooltip={this.enableMouseTooltip}
          disableMouseTooltip={this.disableMouseTooltip}
        >
          <form>
            <label>
              Name:
              <input type="text" name="Tag" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </MouseTooltip> */}
        {/* <ConsoleButtons
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
        /> */}

        <Accordion
          defaultActiveKey="0">
          <Card
            className="bs-example"
            style={{ width: '40rem', backgroundColor: '#1E1E1E', borderRadius: '10px', overflow: "visible" }}
          >
            <Card.Header
              style={{ paddingTop: 0, paddingBottom: 5, paddingLeft: 10 }}
            >
              <Accordion.Toggle as={Button} eventKey="0"
                className="text-left"
                style={{ width: "75vh", fontSize: 12, fontFamily: "HelveticaNeue-Light", backgroundColor: "transparent", borderColor: "transparent", color: 'rgba(184, 184, 184, 0.75)', paddingTop: 5, paddingBottom: 5 }}
              >
                {this.props.date}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <>
                <Card.Body
                  style={{ paddingTop: 10 }}
                >
                  <div style={styles.editor} onClick={this.focus}>
                    <Editor
                      // customStyleMap={styles}
                      editorState={this.state.editorState}
                      onChange={this.onChange}
                      handleKeyCommand={this.handleKeyCommand}
                      ref="editor"
                      readOnly={this.props.readOnly}
                    />
                  </div>
                </Card.Body>

                {/* <div class="text-center">
                  <Button
                    variant="primary"
                    disabled={this.state.isLoading}
                    onClick={!this.state.isLoading ? this.Save : null}
                    style={{ backgroundColor: "transparent", borderColor: "transparent" }}
                  >
                    {this.state.isLoading ? 'Saving..' : 'Save'}
                  </Button>

                </div> */}
                <CreatableSelect
                  isMulti
                  onChange={this.handleAddTag}
                  options={
                    this.props.tags
                  }
                  defaultValue={this.props.savedTags}
                // styles={{
                //   singleValue: base => ({ ...base, color: 'white' }),
                //   valueContainer: base => ({
                //     ...base,
                //     background: '#1E1E1E',
                //     color: 'white',
                //     width: '100%',
                //   }),
                // }}
                />



              </>
            </Accordion.Collapse>
          </Card>




        </Accordion>
      </>

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
    cursor: 'text',
    minHeight: 80,
    padding: 0,
    fontSize: 12,
    lineHeight: "140%",
    fontFamily: "Helvetica Neue",
    color: "#E0E1E2"
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
