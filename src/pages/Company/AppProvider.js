import AppContext from './AppContext';
import React, { Component } from "react";
import { companiesUrl, searchResultsOnCompany, getFullProfileByID } from '../../../utils/constants';

class AppProvider extends Component {
    state = {
        csrfToken: '',
        company: 'Facebook',
        companiesTypeAhead: [],
        selectedCompany: '',
        isSearching: false,
        searchJobs: [],
        companies: {},
        profiles: {}
    };

    constructor() {
        super()

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        chrome.storage.local.get(['JSESSIONID'], (item) => {
            console.log('Session ID', item.JSESSIONID);
            this.setState({ csrfToken: item.JSESSIONID })
        })

        if (params.runJob) {
            chrome.storage.local.get(['companies'], (company) => {
                console.log(company.companies[params.selectedJob].shallowResults[0])
                chrome.storage.local.get(['searchJobs'], (item) => {
                    console.log('Company Searches', item)

                    if (item?.searchJobs?.length > 0) {
                        let index = item.searchJobs[0].findIndex((job) => parseInt(job.id) === parseInt(params.selectedJob))
                        this.state.selectedCompany = { id: item.searchJobs[0][index].id, label: item.searchJobs[0][index].label }
                        this.state.profiles[this.state.selectedCompany.id] = { name: this.state.selectedCompany.label, fullProfiles: [] }
                        this.runFullProfileSearchWithDelay(company.companies[params.selectedJob].shallowResults[0].profileUrlID, 0)
                    }
                })

            })
        } else {
            chrome.storage.local.get(['searchJobs'], (item) => {
                console.log('Company Searches', item)

                if (item?.length > 0)
                    this.setState({ searchJobs: item })
            })
        }


    }

    runSearchWithDelay(start) {
        console.log('Calling for start starting from:', start)
        console.log('Calling for selected company:', this.state.selectedCompany)
        fetch(searchResultsOnCompany.replace('<COMPANY_CODE>', this.state.selectedCompany[0].id).replace('<START>', start), { method: 'GET', headers: { 'csrf-token': JSON.parse(this.state.csrfToken) /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
            .then((res) => {
                let index = (start === 0) ? 1 : 0

                if (res?.elements[index]?.results?.length > 0) {
                    let companyID = this.state.selectedCompany[0].id;

                    let data = []
                    res?.elements[index]?.results?.map((person) => {
                        data.push({
                            title: person?.title?.text,
                            primarySubtitle: person?.primarySubtitle?.text,
                            secondarySubtitle: person?.secondarySubtitle?.text,
                            trackingId: person?.trackingId,
                            trackingUrn: person?.trackingUrn,
                            navigationUrl: person?.navigationUrl,
                            profileUrlID: /in\/.*?\?/.exec(person?.navigationUrl)[0],
                            image: person?.image?.attributes[0]?.detailData?.profilePicture?.profilePicture?.displayImageReference?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment,
                            imageRootUrl: person?.image?.attributes[0]?.detailData?.profilePicture?.profilePicture?.displayImageReference?.vectorImage?.rootUrl,
                        })
                    })

                    if (Object.keys(this.state.companies).length > 0) {
                        Object.keys(this.state.companies).map((key) => {
                            if (key === companyID) {
                                if (this.state.companies[key].shallowResults && this.state.companies[key].shallowResults.length > 0) {

                                    console.log('Cond 1', this.state.companies)

                                    this.state.companies[key].shallowResults.push(...data)
                                } else {

                                    console.log('Cond 2', this.state.companies)

                                    this.state.companies = {
                                        [companyID]: {
                                            shallowResults: [...data]
                                        }
                                    }
                                }
                            } else {
                                this.state.companies = {
                                    [companyID]: {
                                        shallowResults: [...data]
                                    }
                                }
                            }
                        })
                    } else {
                        this.state.companies = {
                            [companyID]: {
                                shallowResults: [...data]
                            }
                        }
                    }

                    chrome.storage.local.set({ companies: this.state.companies }, () => {
                        chrome.storage.local.get(['companies'], (item) => {
                            console.log(item)
                        })
                    })

                    if (res?.elements[index]?.results?.length == 10) {
                        setTimeout(() => {
                            console.log('Calling callback again for searching...')
                            this.runSearchWithDelay(start + 10)
                        }, Math.floor(Math.random() * 15000))
                    } else {
                        console.log('STOPPED: Calling callback again for searching...')
                    }
                } else {
                    console.warn('STOPPED: Calling callback again for searching...')
                }
            })
    }

    runFullProfileSearchWithDelay(profileID, index) {
        console.log('Calling for profile info starting from:', profileID)
        fetch(getFullProfileByID.replace('<PROFILE_ID>', profileID.replace('in/', '').replace('?', '')), { method: 'GET', headers: { 'csrf-token': JSON.parse(this.state.csrfToken) /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
            .then((res) => {
                if (res?.elements[0]) {

                    this.state.profiles[this.state.selectedCompany.id].fullProfiles.push({
                        firstName: res?.elements[0]?.firstName,
                        lastName: res?.elements[0]?.lastName,
                        birthDateMonth: res?.elements[0]?.birthDateOn?.month,
                        birthDateDay: res?.elements[0]?.birthDateOn?.day,
                        headline: res?.elements[0]?.headline,
                        industryName: res?.elements[0]?.industry?.name,
                        isInfluencer: res?.elements[0]?.influencer,
                        countryCode: res?.elements[0]?.location?.countryCode,
                        primaryLocaleCountry: res?.elements[0]?.primaryLocale?.country,
                        primaryLocaleLanguage: res?.elements[0]?.primaryLocale?.language,
                        profileCertifications: res?.elements[0]?.profileCertifications?.elements,
                        profileCourses: res?.elements[0]?.profileCourses?.elements,
                        profileEducations: res?.elements[0]?.profileEducations?.elements,
                        profileHonors: res?.elements[0]?.profileHonors?.elements,
                        profileLanguages: res?.elements[0]?.profileLanguages?.elements,
                        profileOrganizations: res?.elements[0]?.profileOrganizations?.elements,
                        profilePatents: res?.elements[0]?.profilePatents?.elements,
                        profilePicture: res?.elements[0]?.profilePicture?.displayImageReference?.vectorImage?.artifacts[3]?.fileIdentifyingUrlPathSegment,
                        profilePictureRootUrl: res?.elements[0]?.profilePicture?.displayImageReference?.vectorImage?.rootUrl,
                        profilePositionGroups: res?.elements[0]?.profilePositionGroups?.elements,
                        profileProjects: res?.elements[0]?.profileProjects?.elements,
                        profilePublications: res?.elements[0]?.profilePublications?.elements,
                        profileSkills: res?.elements[0]?.profileSkills?.elements,
                        profileTestScores: res?.elements[0]?.profileTestScores?.elements,
                        profileTreasuryMediaProfile: res?.elements[0]?.profileTreasuryMediaProfile?.elements,
                        profileVolunteerExperiences: res?.elements[0]?.profileVolunteerExperiences?.elements,
                        volunteerCauses: res?.elements[0]?.volunteerCauses,
                        supportedLocales: res?.elements[0]?.supportedLocales
                    })

                    chrome.storage.local.set({ organizations: this.state.profiles }, () => {
                        chrome.storage.local.get(['organizations'], (item) => {
                            console.log('Saved Profiles For Organization', item)
                        })
                    })

                    setTimeout(() => {
                        console.log('Calling callback again for searching...')
                        chrome.storage.local.get(['companies'], (company) => {
                            index += 1
                            this.runFullProfileSearchWithDelay(company.companies[this.state.selectedCompany.id].shallowResults[index].profileUrlID, index)
                        })
                    }, Math.floor(Math.random() * 25000))
                }
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
                    companies: this.state.companies,
                    profiles: this.state.profiles,
                    changeSelectedCompany: company => {
                        console.log(company)
                        this.setState({
                            selectedCompany: company
                        });
                    },
                    textChange: text => {
                        const company = text;

                        fetch(companiesUrl.replace('<KEYWORD>', company), { method: 'GET', headers: { 'csrf-token': JSON.parse(this.state.csrfToken), 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
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
                            this.state.isSearching = true;

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