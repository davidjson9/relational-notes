import React from 'react';
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from "draft-js";

var rawContent = {
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

export default class SimpleLog extends React.Component {
  constructor(props) {
    super(props);
    console.log("rerun!")
    const blocks = convertFromRaw(rawContent);
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
      <div className="App">
        {/* <Editor editorState={this.state.editorState} readOnly={true} /> */}
        <Editor editorState={editorState} readOnly={true} />
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