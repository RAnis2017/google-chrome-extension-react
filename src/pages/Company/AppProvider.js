import AppContext from './AppContext';
import React, { Component } from "react";
import { companiesUrl, searchResultsOnCompany } from '../../../utils/constants';

class AppProvider extends Component {
    state = {
        csrfToken: '',
        company: 'Facebook',
        companiesTypeAhead: [],
        selectedCompany: '',
        isSearching: false,
        searchJobs: [],
    };

    constructor() {
        super()

        chrome.storage.local.get(['searchJobs'], (item) => {
            console.log('Company Searches', item)

            if (item?.length > 0)
                this.setState({ searchJobs: item })
        })

        chrome.storage.local.get(['searchJobs'], (item) => {
            console.log('Company Searches', item)

            if (item?.length > 0)
                this.setState({ searchJobs: item })
        })

        chrome.storage.local.get(["Facebook"], (item) => {
            console.warn('People of facebook', item)
        })


        chrome.storage.local.get(['JSESSIONID'], (item) => {
            console.log('Session ID', item.JSESSIONID);
            this.setState({ csrfToken: item.JSESSIONID })
        })
    }

    runSearchWithDelay(start) {
        console.log('Calling for start starting from:', start)
        console.log('Calling for selected company:', this.state.selectedCompany)
        fetch(searchResultsOnCompany.replace('<COMPANY_CODE>', this.state.selectedCompany[0].id).replace('<START>', start), { method: 'GET', headers: { 'csrf-token': 'ajax:7820076663916443573' /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
            .then((res) => {
                console.log(res)

                // if (res?.elements[1]?.results?.length > 0) {
                let companyID = this.state.selectedCompany[0].label;

                let data = []
                res?.elements[1]?.results?.map((person) => {
                    data.push({
                        title: person.title.text,
                        primarySubtitle: person.primarySubtitle.text,
                        secondarySubtitle: person.secondarySubtitle.text,
                        trackingId: person.trackingId,
                        trackingUrn: person.trackingUrn,
                        navigationUrl: person.navigationUrl,
                        image: person?.image?.attributes[0]?.detailData?.profilePicture?.profilePicture?.displayImageReference?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment,
                        imageRootUrl: person?.image?.attributes[0]?.detailData?.profilePicture?.profilePicture?.displayImageReference?.vectorImage?.rootUrl,
                    })
                })

                chrome.storage.local.get(['Facebook'], (item) => {
                    console.log('Company Searches', item)
                    if (item?.Facebook?.length < 1) {
                        chrome.storage.local.set({ 'Facebook': data }, () => {
                            console.log('Company Search Saved')
                        })
                    } else {
                        item.Facebook = item.Facebook.concat(data)
                        console.log('Companies', item.Facebook)

                        chrome.storage.local.set({ 'Facebook': item.Facebook }, () => {
                            console.log('Company Search Saved')
                        })
                    }
                })


                setTimeout(() => {
                    console.log('Calling callback again for searching...')
                    this.runSearchWithDelay(start + 10)
                }, Math.floor(Math.random() * 5000))
                // } else {
                //     console.warn('STOPPED: Calling callback again for searching...')
                // }
            })
    }
    render() {
        return (
            <AppContext.Provider
                value={{
                    csrfToken: this.state.csrfToken,
                    company: this.state.company,
                    companiesTypeAhead: this.state.companiesTypeAhead,
                    selectedCompany: this.state.selectedCompany,
                    isSearching: this.state.isSearching,
                    searchJobs: this.state.searchJobs,
                    changeSelectedCompany: company => {
                        console.log(company)
                        this.setState({
                            selectedCompany: company
                        });
                    },
                    textChange: text => {
                        const company = text;

                        fetch(companiesUrl.replace('<KEYWORD>', company), { method: 'GET', headers: { 'csrf-token': 'ajax:7820076663916443573' /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
                            .then((res) => {
                                console.log(res)

                                let companies = [];

                                res?.elements?.map((company) => {
                                    companies.push({ id: company.targetUrn.split(':')[3], label: company.text.text })
                                })

                                this.setState({
                                    companiesTypeAhead: companies
                                });
                            })

                        this.setState({
                            company
                        });
                    },
                    runSearch: (start) => {
                        if (start == 0)

                            console.log(this.state.searchJobs)
                        chrome.storage.local.set({ 'searchJobs': [...this.state.searchJobs, this.state.selectedCompany] }, () => {
                            console.log('Company Search Saved')
                        })

                        this.runSearchWithDelay(start)

                    }
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppProvider