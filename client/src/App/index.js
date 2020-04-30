import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import { fetchCardEntries, fetchCardEntriesForSearch, fetchTagEntries } from '../API';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { Card, Button } from 'react-bootstrap';
import { styles } from './styles.js';

import CreatableSelect from 'react-select/creatable';

const App = () => {
  const [cardEntries, setCardEntries] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagFilter, setTagFilter] = useState(new Set());
  const [clearCardProp, setClearCardProp] = useState([]);
  const [curQueryArray, setCurQueryArray] = useState([]);

  const getTags = async () => {
    try {
      const tags = await fetchTagEntries();
      console.log(tags);
      tags.sort((a, b) => b.count - a.count);
      setTags(tags);
      // console.log(cardTags);
    } catch (error) {
      // console.log(error);
    }
  }

  const getCardEntries = async () => {
    const cardEntries = await fetchCardEntries();
    setCardEntries(cardEntries);
    // console.log(cardEntries);
  }

  const getCardEntriesForSearch = async (queryArray) => {
    const data = { queryTerms: queryArray };
    const cardEntries = await fetchCardEntriesForSearch(data);
    setCardEntries(cardEntries);
    console.log("cardEntries", cardEntries);

    const gatheredTags = cardEntries.map(e => e.tags).flat();
    const gatheredLabels = gatheredTags.map(e => e.label);
    const labels = new Set(gatheredLabels);
    console.log("gatheredTags", gatheredTags);
    console.log("labels", labels);
    console.log("tags", tags.filter(e => labels.has(e.label)));
    setTagFilter(labels);
  }

  const handleSearchChange = async (newValues, actionMeta) => {
    console.group('Value Changed');
    console.log("newValues:", newValues);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    const tagTerms = newValues ?
      newValues.filter(e => {
        if (e.__isNew__) {
          return false;
        }
        return true;
      })
      : []
    setSearchTags(tagTerms);

    if (actionMeta.action === "create-option") {
      console.log("rawNewValues", newValues);
      const newTag = newValues[newValues.length - 1];
      const formattedNewTag = {
        ...newTag,
        color: "white",
      }
      newValues[newValues.length - 1] = formattedNewTag; // this is the important part, and I guess all the CSS is loaded afterwards
    }

    if (newValues === null || actionMeta.action === "clear") {
      setCurQueryArray([]);
      setTagFilter(new Set());
      clearCard();
      getCardEntries();
    } else {
      const queryArray = newValues.map(e => {
        if (e.__isNew__) {
          return { "rawText": { "$regex": e.value, "$options": "i" } };
        } else {
          return { "tags.label": e.label };
        }
      });
      // console.log("queryArray", queryArray);

      setCurQueryArray(queryArray);
      clearCard();
      getCardEntriesForSearch(queryArray);
    }
  }

  const clearCard = () => {
    setClearCardProp(true);
  }

  const setNewCard = () => {
    clearCard();
    if (curQueryArray.length === 0) {
      getCardEntries();
    } else {
      getCardEntriesForSearch(curQueryArray);
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
          <CreatableSelect
            isMulti
            isClearable
            components={{ DropdownIndicator: null, }}
            placeholder="Search"
            onChange={handleSearchChange}
            options={tagFilter.size === 0 ? tags : tags.filter(e => tagFilter.has(e.label))}
            styles={styles.multiSelectDark}
          />
        </div>

        <div className="Card-container">
          <Editor
            id={""}
            date={new Date().toDateString()}
            allTags={tags}
            getTags={getTags}
            defaultValue={searchTags}
            clearCard={clearCardProp}
            setClearCard={setClearCardProp}
          />
        </div>

        <div className="Card-container">
          <Card style={styles.cardLight}>
            <Button
              variant="outline-dark" size="lg"
              onClick={setNewCard}
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
