import AppContext from './AppContext';
import React, { Component } from "react";
import { companiesUrl } from '../../../utils/constants';

class AppProvider extends Component {
    state = {
        csrfToken: '',
        company: 'Facebook'
    };

    constructor() {
        super()

        chrome.storage.sync.get(['JSESSIONID'], (item) => {
            console.log('Session ID', item.JSESSIONID);
            this.setState({ csrfToken: item.JSESSIONID })
        })
    }

    render() {
        return (
            <AppContext.Provider
                value={{
                    csrfToken: this.state.csrfToken,
                    company: this.state.company,
                    textChange: text => {
                        const company = text;

                        fetch(companiesUrl.replace('<KEYWORD>', company), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken, 'x-restli-protocol-version': '2.0.0', 'sec-fetch-site': 'same-origin', 'x-li-lang': 'en_US', 'x-li-page-instance': 'urn:li:page:d_flagship3_search_srp_companies;1Gqpo9J9Qqe881+j1R22fQ==', 'x-li-track': '{ "clientVersion": "1.9.2655", "mpVersion": "1.9.2655", "osName": "web", "timezoneOffset": 5, "timezone": "Asia/Karachi", "deviceFormFactor": "DESKTOP", "mpName": "voyager-web", "displayDensity": 1.25, "displayWidth": 1920, "displayHeight": 1080 }' } }).then((res) => res.json()).then((res) => { console.log(res) })

                        this.setState({
                            company
                        });
                    },
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppProvider