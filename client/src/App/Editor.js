import React, { Component } from 'react';
import {
  convertFromRaw,
  convertToRaw,
  RichUtils,
  Editor,
  EditorState,
} from 'draft-js';
import debounce from 'lodash/debounce';
import { colors } from './colors.js'
import { styles } from './styles.js'

import { Button, Card, Accordion, Row, Col } from 'react-bootstrap';
import { saveCard, deleteCard, saveTag, updateTag, deleteTag } from '../API'
import CreatableSelect from 'react-select/creatable';

import './editor.css';

const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
}
const currentColor = randomColor()

export default class EntityEditorExample extends Component {
  constructor(props) {
    super(props);

    const blocks = convertFromRaw({
      blocks: this.props.savedBlocks || [],
      entityMap: this.props.savedEntities || {},
    });

    this.state = {
      editorState: EditorState.createWithContent(blocks),
      id: this.props.id,
      deleted: false,
      curColor: currentColor,
      tags: this.props.defaultValue,
      oldTags: this.props.defaultValue,
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
      this.setState({ editorState });
    }

    this.setNewColor = () => {
      const curColor = randomColor();
      this.setState({ curColor });
    }

    this.handleTagChange = (newValues, actionMeta) => {
      newValues = newValues || [];
      console.group('Value Changed');
      console.log("handleTagChange:", newValues);
      console.log(`action: ${actionMeta.action}`);
      console.groupEnd();

      const latestTag = newValues[newValues.length - 1];
      if (newValues.length > 0 && latestTag.__isNew__) {
        const newTag = {
          ...latestTag,
          label: latestTag.value,
          value: latestTag.value,
          color: this.state.curColor,
        };
        newValues[newValues.length - 1] = newTag;
        this.setNewColor();
      }

      const tags = newValues;
      this.setState({ tags }, function () {
        if (this.state.editorState.getCurrentContent().hasText()) {
          this.saveCard();
        }
      });
    }

    this.handleDeleteClick = () => {
      this.updateTags([], this.state.tags);
      this.deleteCard(this.state.id);
      const deleted = true;
      this.setState({ deleted });
    }

    this.deleteCard = async (id) => {
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
          rawText: this.state.editorState.getCurrentContent().getPlainText(' '),
          rawContent: JSON.stringify(contentState),
        }
        console.log("this.state.tags", this.state.tags);
        const response = await saveCard(data);
        console.log(response);

        console.log("this.state.tags-this.state.oldTags", this.state.tags, this.state.oldTags);
        if (response._id) { // we have created a new card!
          const id = response._id;
          this.setState({ id });
          this.updateTags(this.state.tags, [])
        } else {
          this.updateTags(this.state.tags, this.state.oldTags);
        }
        this.setState({ oldTags: this.state.tags });

      } catch (error) {
        console.log(error);
      }
    }, 400)


    this.addTag = async (tag, color) => {
      try {
        var newTag = tag;
        newTag.count = 1;
        const response = await saveTag(newTag);
        console.log(response);
        this.props.getTags();
      } catch (error) {
        console.log(error);
      }
    }

    this.deleteTag = async (tag) => {
      try {
        const data = {
          tag: tag.label,
        };
        const response = await deleteTag(data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    this.updateTags = (tags, oldTags) => {
      const diff = (large, small) => {
        return large.filter(function (obj) {
          return !small.some(function (obj2) {
            return obj.value === obj2.value;
          });
        });
      }

      if (tags.length > oldTags.length) { // we've added tags!
        const addedTags = diff(tags, oldTags);
        console.log("addedTags", addedTags);
        addedTags.forEach(addedTag => {
          if (addedTag.__isNew__) {
            addedTag.count = 1;
            addedTag.__isNew__ = false;
            this.addTag(addedTag);
          } else {
            this.incrementTag(addedTag);
          }
        })
      } else { // we've removed tags!
        const removedTags = diff(oldTags, tags);
        console.log("removedTags", removedTags);
        removedTags.forEach(removedTag => {
          this.decrementTag(removedTag);
        })
      }
    }

    this.incrementTag = async (tag) => {
      try {
        const data = {
          tag: tag.label,
          count: 1,
        };
        const response = await updateTag(data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    this.decrementTag = async (tag) => {
      try {
        const data = {
          tag: tag.label,
          count: -1,
        };
        const response = await updateTag(data);
        if (response.count === 0) {
          await this.deleteTag(tag);
          this.props.getTags();
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.setDomEditorRef = ref => this.domEditor = ref;
    this.focus = () => this.domEditor.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.clearCard !== prevProps.clearCard && this.props.clearCard === true) {
      this.setState({
        id: "",
        editorState: EditorState.createEmpty(),
        tags: this.props.defaultValue
      });
      this.props.setClearCard(false);
    }


    // console.log(this.props.defaultValue, prevProps.defaultValue);
    // if (this.props.defaultValue !== prevProps.defaultValue) {
    //   console.log("RESET VALUES", this.props.defaultValue, prevProps.defaultValue);
    //   this.setState({
    //     tags: this.props.defaultValue
    //   })
    // }

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

  render() {
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
                <Card.Body style={{ paddingTop: 10 }} onClick={this.focus}>
                  <div style={styles.editor}>
                    <Editor
                      editorState={this.state.editorState}
                      onChange={this.onChange}
                      handleKeyCommand={this.handleKeyCommand}
                      ref={this.setDomEditorRef}
                    />
                  </div>
                </Card.Body>

                <div id="select" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  <CreatableSelect
                    isMulti
                    isClearable={false}
                    components={{ DropdownIndicator: null, }}
                    placeholder="Add Tag..."
                    onChange={this.handleTagChange}
                    options={this.props.allTags}
                    value={this.state.tags}
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
