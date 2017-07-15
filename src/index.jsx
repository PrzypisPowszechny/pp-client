import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import annotator from 'annotator';

export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            text: '',
        };
    }

    render() {
        return (
            <div>
                <button onClick={() => this.setState({text: 'Przypis Powszechny* jest najlepszy'})}>
                    Kto jest najlepszy?
                </button>
                <p> {this.state.text} </p>
            </div>
        );
    }
}

var annotation_prefix = 'http://localhost:8080';

console.log("Przypis script working!");

// will run only in browser environment
if (typeof window !== 'undefined') {

    var annotator_app = new annotator.App();
    annotator_app.include(annotator.ui.main);
    // annotator_app.include(annotator.storage.debug);
    annotator_app.include(annotator.storage.http, {prefix: annotation_prefix});
    annotator_app.start();


    var app = document.createElement("app");
    document.body.appendChild(app);

    ReactDOM.render(
        <App/>,
        app
    );

}