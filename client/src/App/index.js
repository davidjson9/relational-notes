import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import { fetchCardEntries, fetchCardEntriesForSearch, fetchTagEntries } from '../API';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { Card, Button } from 'react-bootstrap';
import { styles } from './styles.js';

import Select from 'react-select';

const App = () => {
  const [cardEntries, setCardEntries] = useState([]);
  const [tags, setTags] = useState([]);
  const [clearCard, setClearCard] = useState([]);

  const getCardEntries = async () => {
    const cardEntries = await fetchCardEntries();
    setCardEntries(cardEntries);
    // console.log(cardEntries);
  }

  const getCardEntriesForSearch = async (queryArray) => {
    const data = { queryTerms: queryArray };
    const cardEntries = await fetchCardEntriesForSearch(data);
    setCardEntries(cardEntries);
  }

  const handleSearchChange = async (newValues, actionMeta) => {
    console.group('Value Changed');
    console.log("handleSearchChange:", newValues);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    if (!newValues || actionMeta.action === "clear") {
      getCardEntries();
      return
    }
    const queryArray = newValues.map(e => {
      return { "tags.label": e.label }
    });
    getCardEntriesForSearch(queryArray);
  }

  const addNewCard = () => {
    setClearCard(true);
    // setBlocks([]);
    // setEntityMap({});
    getCardEntries();
  }

  const getTags = async () => {
    try {
      const cardTags = await fetchTagEntries();
      setTags(cardTags);
      // console.log(cardTags);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    getCardEntries();
    getTags();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div className="Search-bar">
          <Select
            isMulti
            isClearable
            components={{ DropdownIndicator: null, }}
            placeholder="Search"
            onChange={handleSearchChange}
            options={tags}
            styles={styles.multiSelectDark}
          />
        </div>

        <div className="Card-container">
          <Editor
            id={""}
            date={new Date().toDateString()}
            allTags={tags}
            getTags={getTags}
            clearCard={clearCard}
            setClearCard={setClearCard}
          />
        </div>

        <div className="Card-container">
          <Card style={styles.cardLight}>
            <Button
              variant="outline-dark" size="lg"
              onClick={addNewCard}
            >
              <svg xmlns="http://www.w3.org/2000/svg" color="grey" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </Button>
          </Card>
          <hr />
        </div>


        {
          cardEntries.map(card => {
            var raw_date = new Date(card.date)
            var date = raw_date.toDateString()
            var data = JSON.parse(card.rawContent)
            const defaultValue = (card.tags) ? card.tags.map(e => e) : [];

            return (

              <div key={card._id} className="Card-container">
                <Editor
                  id={card._id}
                  date={date}
                  savedBlocks={data.blocks}
                  savedEntities={data.entityMap}
                  allTags={tags}
                  defaultValue={defaultValue}
                  deletable={true}
                  getTags={getTags}
                />
              </div>
            )
          })
        }

      </header>
    </div>
  );
}

export default App
