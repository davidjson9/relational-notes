import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import { fetchCardEntries, fetchCardEntriesForSearch, fetchTagEntries } from '../API';
import { Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Select from 'react-select';

import { colourOptions, groupedOptions } from './data';

// demo code

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

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

  const handleOnChange = (e) => {
    console.log(e.target.value);
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
        <div>
          <div className="Search-bar">
            <Select
              isMulti
              isClearable
              // defaultValue={colourOptions[1]}
              options={groupedOptions}
              formatGroupLabel={formatGroupLabel}
              components={{ DropdownIndicator: null, }}
              placeholder="Search"
              // onChange={this.handleTagChange}
              options={tags}
              // defaultValue={this.props.savedTags}
              theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  // text: 'pink',
                  // neutral0: '1e1e1e',
                  // neutral20: '1e1e1e',
                  // neutral30: '1e1e1e',

                  // neutral50: 'white',
                  // neutral80: 'white',

                  // // primary25: 'pink',
                  // primary50: '1e1e1e',
                  // primary75: '1e1e1e',
                  // primary: '1e1e1e',
                },
              })}
              styles={{

                control: (base, state) => ({
                  ...base,
                  fontSize: "26px",


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
                    // color: "pink"
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  // fontSize: "26px",
                }),
                multiValueLabel: base => ({ ...base, color: 'purple', }),
                multiValue: base => ({ ...base, color: 'purple', }),
                input: base => ({ ...base, color: '#E0E1E2' }),
                placeholder: base => ({ ...base, alignItems: 'center' }),

                // valueContainer: base => ({
                //   ...base,
                //   background: '#1E1E1E',
                //   color: 'pink',
                //   width: '100%',
                // }),
              }}

            />
          </div>





          <div className="Card-container">
            {
              console.log("tags", tags)
            }
            <Editor
              id={""}
              date={new Date().toDateString()}
              tags={tags}
              getTags={getTags}
            />\
          </div>

          {
            cardEntries.map(card => {
              var raw_date = new Date(card.date)
              var date = raw_date.toDateString()
              var data = JSON.parse(card.rawContent)
              console.log("card.tags");
              console.log(card.tags);
              const defaultValue = card.tags.map(e => e);
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

        </div>
      </header>
    </div>
  );
}

export default App
