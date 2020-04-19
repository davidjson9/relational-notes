import React, { Component } from 'react';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  RichUtils,
  Editor,
  EditorState,
  Modifier,
} from 'draft-js';
import debounce from 'lodash/debounce';
import chroma from 'chroma-js';

import { Button, Card, Accordion, Container, Row, Col } from 'react-bootstrap';
import { saveCard, deleteCard, saveTag } from '../API'
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';

import './editor.css';

const colors = ["red", "blue", "green", "pink", "orange", "purple"];

export default class EntityEditorExample extends Component {
  constructor(props) {
    super(props);

    const blocks = convertFromRaw({
      blocks: this.props.savedBlocks || [],
      entityMap: this.props.savedEntities || {},
    });

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      }
    ]);

    const defaultValue = this.props.cardTagLabels;

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
      deleted: false,
      isMouseTooltipVisible: false,
      isLoading: false,
      curColor: "red",
    };

    this.setSavedBlocks = (savedBlocks) => {
      this.setState({ savedBlocks });
    }

    this.setEntities = (savedEntities) => {
      this.setState({ savedEntities });
    }

    this.onChange = (editorState) => {
      if (editorState.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
        this.saveCard();
      }
      this.setState(
        { editorState },
        () => this.getEntityAtSelection(this.state.editorState),
      );
    }

    this.setNewColor = () => {
      const curColor = colors[Math.floor(Math.random() * colors.length)];
      this.setState({ curColor });
    }

    this.handleTagChange = (newValues, actionMeta) => {
      // console.group('Value Changed');
      // console.log("handleTagChange:", tags);
      // console.log(`action: ${actionMeta.action}`);
      // console.groupEnd();

      if (actionMeta.action === "create-option") {
        const newTag = newValues[newValues.length - 1];
        const formattedNewTag = {
          label: newTag.label,
          value: newTag.value,
          color: this.state.curColor,
        }
        this.addTag(formattedNewTag);
        this.setNewColor();
        newValues[newValues.length - 1] = formattedNewTag;
      }

      console.log("newValuesCorrect?", newValues);
      const tags = newValues;
      this.setState({ tags }, function () {
        this.saveCard();
      });
    }

    this.handleDeleteClick = () => {
      const deleted = true;
      this.cardDelete(this.state.id);
      this.setState({ deleted });
    }

    this.cardDelete = async (id) => {
      const data = { "id": id };
      const res = await deleteCard(data);
      console.log(res)
    }

    this.saveCard = debounce(async () => {
      try {
        const contentState = convertToRaw(this.state.editorState.getCurrentContent());
        const data = {
          id: this.state.id,
          tags: this.state.tags,
          rawContent: JSON.stringify(contentState),
        }
        const response = await saveCard(data);
        console.log(response);

      } catch (error) {
        console.log(error);
      }
    }, 1000)


    this.addTag = async (tag, color) => {
      try {
        const response = await saveTag(tag);
        this.props.getTags();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

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
    const IndicatorsContainer = props => {
      return (
        <div style={{ background: "#1E1E1E" }}>
          <components.IndicatorsContainer {...props} />
        </div>
      );
    };

    if (!this.state.deleted) {
      return (
        <Accordion
          defaultActiveKey="0">
          <Card style={styles.card}>
            <Card.Header style={styles.cardHeader} >
              <Accordion.Toggle as={Card.Header} eventKey="0" className="text-left" style={styles.cardHeaderText}>
                <Row style={{ paddingLeft: "0px", paddingRight: 0 }}>
                  <Col >
                    {this.props.date}
                  </Col>
                  <Col style={{ textAlign: "right", paddingRight: 0 }}>
                    {
                      (this.props.deletable)
                        ?
                        <Button
                          variant="outline-danger"
                          style={{ paddingLeft: "3px", paddingRight: "4px", paddingTop: "0px", paddingBottom: "2px", outline: "none", border: 0 }}
                          // className="btn text-right"
                          // style={{ display: "flex", alignItem: "right" }}

                          // disabled={isLoading}
                          onClick={this.handleDeleteClick}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" color="#3d3d3d" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </Button>
                        : null
                    }
                  </Col>
                </Row>

              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <>
                <Card.Body style={{ paddingTop: 10 }}>
                  <div style={styles.editor} onClick={this.focus}>
                    <Editor
                      editorState={this.state.editorState}
                      onChange={this.onChange}
                      handleKeyCommand={this.handleKeyCommand}
                      ref="editor"
                      readOnly={this.props.readOnly ? true : false}
                    />
                  </div>
                </Card.Body>

                <div id="select" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  <CreatableSelect
                    isMulti
                    isClearable
                    components={{ DropdownIndicator: null, }}
                    placeholder="Add Tag..."
                    onChange={this.handleTagChange}
                    options={this.props.allTags}
                    defaultValue={this.props.defaultValue}
                    styles={styles.multiSelectDark}
                  />
                </div>
                <hr />
                {/* <div id="tag-line">
                  <svg width="100%" height="5" viewBox="0 0 465 5" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <g transform="scale(0.5,1)">
                      <path d="M1 0C1 4 1 4 45.5999 4C90.1998 4 580.8 4 625.4 4C670 4 670 4 670 0" stroke="white" strokeOpacity="0.2" />
                    </g>
                  </svg>
                </div> */}

              </>
            </Accordion.Collapse>
          </Card>
          <hr />
        </Accordion >
      );
    } else {
      return null
    }

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
    fontSize: 14,
    lineHeight: "140%",
    fontFamily: "Helvetica Neue",
    color: "#E0E1E2"
  },
  card: {
    // width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: '10px',
    overflow: "visible",
  },
  cardHeader: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  cardHeaderText: {
    width: "100%",
    fontSize: 14,
    fontFamily: "HelveticaNeue-Light",
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: 'rgba(184, 184, 184, 0.75)',
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  multiSelectDark: {
    control: (base, state) => ({
      ...base,
      background: "#1e1e1e",
      boxShadow: state.isFocused ? null : null,
      borderColor: state.isFocused
        ? '#1e1e1e'
        : '#1e1e1e',
      '&:hover': {
        borderColor: state.isFocused
          ? '#1e1e1e'
          : '#1e1e1e',
        background: "#363636",
      }
    }),


    // option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    //   const color = chroma(data.color);
    //   return {
    //     ...styles,
    //     backgroundColor: isDisabled
    //       ? null
    //       : isSelected
    //         ? data.color
    //         : isFocused
    //           ? color.alpha(0.1).css()
    //           : null,
    //     color: isDisabled
    //       ? '#ccc'
    //       : isSelected
    //         ? chroma.contrast(color, 'white') > 2
    //           ? 'white'
    //           : 'black'
    //         : data.color,
    //     cursor: isDisabled ? 'not-allowed' : 'default',

    //     ':active': {
    //       ...styles[':active'],
    //       backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
    //     },
    //   };
    // },
    // multiValue: (styles, { data }) => {
    //   console.log("data", data);
    //   const color = chroma(data.color);
    //   return {
    //     ...styles,
    //     backgroundColor: color.alpha(0.1).css(),
    //   };
    // },

    // multiValueLabel: (styles, { data }) => ({
    //   ...styles,
    //   color: data.color,
    // }),

    // multiValueRemove: (styles, { data }) => ({
    //   ...styles,
    //   color: data.color,
    //   ':hover': {
    //     backgroundColor: data.color,
    //     color: 'white',
    //   },
    // }),



    // multiValueLabel: base => ({ ...base, color: 'purple', }),
    // multiValue: base => ({ ...base, color: 'purple', }),
    input: base => ({ ...base, color: '#E0E1E2', }),
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
