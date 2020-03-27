import React, { Component } from 'react';

import PageContainer from '../PageContainer';
import Editor from './Editor';

export default class EntitiesTut extends Component {
  render() {
    return (
      <PageContainer {...this.props}>
        <Editor />
      </PageContainer>
    );
  }
}
