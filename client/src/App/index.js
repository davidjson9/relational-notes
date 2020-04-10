import React, { Component, useState, useEffect } from 'react';
import Editor from './Editor';
import { fetchCardEntries, saveCard, fetchTagEntries, saveTag } from '../API';
import { Form } from 'react-bootstrap';


// Import styles
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const blocks = [
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
]
const entities = {
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
}

const App = () => {
  const [cardEntries, setCardEntries] = useState([]);
  const [tags, setTags] = useState([]);

  const getCardEntries = async () => {
    const cardEntries = await fetchCardEntries();
    setCardEntries(cardEntries);
    console.log(cardEntries);
  }

  const handleKeyPress = (target) => {
    if (target.charCode == 13) {
      console.log("success!");
    }
  }

  const handleOnChange = (e) => {
    console.log(e.target.value);
  }

  const getTags = async () => {
    try {
      const tagObjects = await fetchTagEntries();
      var tags = []

      tagObjects.forEach(element => {
        tags.push({
          value: element.tag,
          label: element.tag,
        });
      });

      setTags(tags);
      console.log(tags);
    } catch (error) {
      console.log(error);
    }
  }

  const addTag = async (tag) => {
    try {
      // console.log("WHAT TAG?", tag);
      const data = {
        tag: tag
      }
      console.log("DATA", data);
      const response = await saveTag(data);
      getTags();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCardEntries();
    getTags();
    // addTag("Buddhism");
  }, [])



  return (
    <div className="App">
      <header className="App-header">

        <div className="Search-bar">
          <Form.Group>
            <Form.Control size="lg" type="text" placeholder="Search" onKeyPress={handleKeyPress} onChange={handleOnChange} />
          </Form.Group>
        </div>

        <div>
          <Editor
            id={""}
            date={new Date().toDateString()}
            savedBlocks={[]}
            savedEntities={{}}
            savedTags={[]}
            readOnly={false}
            updateEntries={getCardEntries}
            tags={tags}
            addTag={addTag}
          // saveCard={this.saveCard}
          >
          </Editor>
        </div>


        <hr></hr>
        {

          cardEntries.map(card => {
            var raw_date = new Date(card.date)
            var date = raw_date.toDateString()
            var data = JSON.parse(card.rawContent)
            var savedTags = card.tags
            console.log(data);
            console.log(tags);

            return (
              <>
                <div key={card._id}>
                  <Editor
                    id={card._id}
                    date={date}
                    savedBlocks={data.blocks}
                    savedEntities={data.entityMap}
                    savedTags={savedTags}
                    readOnly={false}
                    updateEntries={getCardEntries}
                    tags={tags}
                    addTag={addTag}
                  // saveCard={this.saveCard}
                  >
                  </Editor>
                </div>
                <hr></hr>
              </>
            )
          }
          )
        }
      </header>
    </div>
  );
}

export default App
