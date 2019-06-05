import React, {Component} from 'react';
import {observable, action} from "mobx";
import {observer} from "mobx-react";

@observer
class SampleComponent extends Component {

    @observable test;

    constructor(props) {
        super(props);
        this.test = "test";
    }
    /**
     * More than standard ecma
     */
    updateTest = () => {
        return this.test = "test" + Date.now();
    };

    render() {

        return <>
            <button onClick={() => {
                this.updateTest()
            }}>
                update
            </button>
            <span>{this.test}</span>
        </>
    }
}

export default SampleComponent;
