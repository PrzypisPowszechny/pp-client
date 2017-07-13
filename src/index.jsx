import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom'

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

console.log("Przypis script working!")

if (typeof window !== 'undefined') {
    var app = document.createElement("app");
    document.body.appendChild(app);

    ReactDOM.render(
        <App/>,
        app
    );

}

