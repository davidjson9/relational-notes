import React from 'react';
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from "draft-js";
import { Button, Accordion, Card } from 'react-bootstrap';

export default class SimpleLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // editorState: EditorState.createWithContent(blocks, decorator),
      addEntityInputs: {
        type: 'TOKEN',
        mutability: 'IMMUTABLE',
        data: '',
      },
      savedBlocks: [],
      savedEntities: {}
    };
  }

  render() {
    var rawContent = {
      blocks: this.props.savedBlocks,
      entityMap: this.props.savedEntities
    }

    // console.log("rawContent", rawContent);
    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan
      }
    ]);

    var editorState = EditorState.createWithContent(convertFromRaw(rawContent), decorator);

    return (
      <div className="SimpleLog">


        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Tag Title
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Editor editorState={editorState} readOnly={true} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );

  }
};

const TokenSpan = (props) => {
  const style = getDecoratedStyle(props.contentState.getEntity(props.entityKey).getMutability());
  return (
    <span data-offset-key={props.offsetkey} style={style}>
      {props.children}
    </span>
  );
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
}