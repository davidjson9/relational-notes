import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import { fetchCardEntries, fetchCardEntriesForSearch, fetchTagEntries } from '../API';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { styles } from './styles.js';

import Select from 'react-select';

const App = () => {
  const [cardEntries, setCardEntries] = useState([]);
  const [tags, setTags] = useState([]);

  const getCardEntries = async () => {
    const cardEntries = await fetchCardEntries();
    setCardEntries(cardEntries);
    console.log(cardEntries);
  }

  const getCardEntriesForSearch = async (terms) => {
    console.log(terms);
    const cardEntries = await fetchCardEntriesForSearch(terms);
    setCardEntries(cardEntries);
    console.log(cardEntries);
  }

  const handleKeyPress = (target) => {
    if (target.charCode === 13) {
      console.log("success!");
    }
  }

  const handleTagChange = (newValues, actionMeta) => {
    console.group('Value Changed');
    console.log("handleTagChange:", tags);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  }

  const getTags = async () => {
    try {
      const cardTags = await fetchTagEntries();
      setTags(cardTags);
    } catch (error) {
      console.log(error);
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
            onChange={handleTagChange}
            options={tags}
            styles={
              styles.multiSelectDark
              // {
              //   // control: (base, state) => ({
              //   //   ...base,
              //   //   fontSize: "26px",
              //   // }),
              // }
            }
          />
        </div>

        <div className="Card-container">
          {
            console.log("tags", tags)
          }
          <Editor
            id={""}
            date={new Date().toDateString()}
            allTags={tags}
            getTags={getTags}
          />
        </div>

        {
          cardEntries.map(card => {
            var raw_date = new Date(card.date)
            var date = raw_date.toDateString()
            var data = JSON.parse(card.rawContent)
            console.log("card.tags");
            console.log(card.tags);
            const defaultValue = (card.tags) ? card.tags.map(e => e) : [];
            console.log("defaultValue", defaultValue);

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
