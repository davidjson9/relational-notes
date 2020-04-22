import chroma from 'chroma-js';
export const styles = {
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
  cardLight: {
    // width: '100%',
    backgroundColor: '#2C3037',
    borderRadius: '10px',
    overflow: "visible",
    width: '100%',
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
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = data.color ? chroma(data.color) : chroma("grey").brighten(2);
      return {
        ...styles,
        // backgroundColor: isDisabled
        //   ? null
        //   : isSelected
        //     ? color.alpha(0.1).darken(10).css()
        //     : isFocused
        //       ? color.alpha(0.1).darken(10).css()
        //       : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? chroma.contrast(color, 'white') > 2
              ? 'white'
              : 'black'
            : color.alpha(1).darken(3).saturate(10).luminance(0.4).css(),
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },

    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(1).css(),
      };
    },

    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "black",
    }),

    multiValueRemove: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        color: color.darken(2).css(),
        ':hover': {
          backgroundColor: color.darken(2).css(),
          color: 'white',
        },
      }
    },



    // multiValueLabel: base => ({ ...base, color: 'purple', }),
    // multiValue: base => ({ ...base, color: 'purple', }),
    input: base => ({ ...base, color: '#E0E1E2', }),
  },
};
