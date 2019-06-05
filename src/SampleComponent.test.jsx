import React from 'react';
import ReactDOM from 'react-dom';
import SampleComponent from './SampleComponent';

describe("SampleComponent section", () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<SampleComponent />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
