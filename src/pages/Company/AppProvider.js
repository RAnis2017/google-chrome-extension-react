import AppContext from './AppContext';
import React, { Component } from "react";
import { companiesUrl, searchResultsOnCompany, getFullProfileByID, getAllSkills, getAllExperiences, getAllEducations, getCompanyDetails } from '../../../utils/constants';

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

            let csrf;

            try {
                csrf = JSON.parse(item.JSESSIONID)
            } catch (error) {
                csrf = item.JSESSIONID
            }

            this.setState({ csrfToken: csrf })
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
            chrome.storage.local.get(['companies'], (company) => {
                this.setState({ companies: company.companies })
                console.log('COMPANIES', company.companies)
            })
            chrome.storage.local.get(['searchJobs'], (item) => {
                console.log('Company Searches', item)
                let index = item.searchJobs[0].findIndex((job) => parseInt(job.id) === parseInt(params.selectedJob))
                if (index) {
                    let selectedCompany = { id: item.searchJobs[0][index].id, label: item.searchJobs[0][index].label }

                    this.setState({ searchJobs: item, selectedCompany })
                }
            })
        }


    }

    runSearchWithDelay(start) {
        console.log('Calling for start starting from:', start)
        console.log('Calling for selected company:', this.state.selectedCompany)

        fetch(searchResultsOnCompany.replace('<COMPANY_CODE>', this.state.selectedCompany[0].id).replace('<START>', start), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
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
                        this.setState({ isSearching: false })
                        console.log('STOPPED: Calling callback again for searching...')
                    }
                } else {
                    this.setState({ isSearching: false })
                    console.warn('STOPPED: Calling callback again for searching...')
                }
            })
    }

    runFullProfileSearchWithDelay(profileID, index) {
        console.log('Calling for profile info starting from:', profileID)

        setTimeout(async () => {
            let skillsRes = await fetch(getAllSkills.replace('<PROFILE_ID>', profileID.replace('in/', '').replace('?', '')), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())

            fetch(getFullProfileByID.replace('<PROFILE_ID>', profileID.replace('in/', '').replace('?', '')), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
                .then(async (res) => {
                    if (res?.elements[0]) {

                        let experiences = []
                        let currentCompany = {};
                        let skills = []
                        let educations = []

                        skillsRes?.elements.map((skill) => {
                            skill?.endorsedSkills.map((endorsedSkill) => {
                                skills.push(endorsedSkill.skill.name)
                            })
                        })

                        let experiencesRes = await fetch(getAllExperiences.replace('<PROFILE_URN>', res?.elements[0]?.entityUrn.replace(/:/g, '%3A')), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
                        console.log(experiencesRes)

                        let educationsRes = await fetch(getAllEducations.replace('<PROFILE_URN>', res?.elements[0]?.entityUrn.replace(/:/g, '%3A')), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken /*this.state.csrfToken*/, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
                        console.log(educationsRes)

                        educationsRes?.elements.map((education) => {
                            educations.push({
                                degreeName: education?.degreeName,
                                fieldOfStudy: education?.fieldOfStudy,
                                schoolName: education?.schoolName,
                                start: education?.dateRange?.start?.month + '-' + education?.dateRange?.start?.year,
                                end: education?.dateRange?.end?.month + '-' + education?.dateRange?.end?.year
                            })
                        })

                        var promises = res?.elements[0]?.profilePositionGroups?.elements.map((position) => {
                            return fetch(getCompanyDetails.replace('<COMPANY_NAME>', position?.company?.universalName), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken, 'x-restli-protocol-version': '2.0.0' } })
                                .then((res) => res.json())
                        })
                        Promise.all(promises).then((results) => {
                            console.log(results)
                            res?.elements[0]?.profilePositionGroups?.elements.map((position, index) => {
                                if (index == 0) {
                                    currentCompany.current_company_website = results[index]?.elements[0]?.companyPageUrl
                                    currentCompany.company_linkedin_url = position?.company?.url
                                    currentCompany.current_company_specialties = results[index]?.elements[0]?.specialities
                                    currentCompany.current_company_size = position?.company?.employeeCountRange?.end
                                    currentCompany.current_company_name = position?.companyName
                                    currentCompany.current_company_industry = results[index]?.elements[0]?.companyIndustries.map((industry) => industry?.localizedName)
                                    currentCompany.title = position?.profilePositionInPositionGroup.elements[0]?.title
                                }
                                experiences.push({
                                    'company_name': position?.companyName,
                                    'urn': position?.companyUrn,
                                    'universalName': position?.company?.universalName,
                                    'logo': `${position?.company?.logo?.vectorImage?.rootUrl}${position?.company?.logo?.vectorImage?.artifacts[2].fileIdentifyingUrlPathSegment}`,
                                    'description': position?.profilePositionInPositionGroup.elements[0]?.description,
                                    'start': `${position?.dateRange?.start?.month}-${position?.dateRange?.start?.year}`,
                                    'end': `${position?.dateRange?.end?.month}-${position?.dateRange?.end?.year}`,
                                    'location': position?.locationName,
                                    'title': position?.profilePositionInPositionGroup.elements[0]?.title,
                                    'companySize': position?.company?.employeeCountRange?.end,
                                    'companyPageUrl': position?.company?.url,
                                    'companyWebsite': results[index]?.elements[0]?.companyPageUrl,
                                    'companySpecialities': results[index]?.elements[0]?.specialities,
                                    'companyType': results[index]?.elements[0]?.companyType?.localizedName,
                                    'companyIndustries': results[index]?.elements[0]?.companyIndustries.map((industry) => industry?.localizedName)
                                })
                            })

                            this.state.profiles[this.state.selectedCompany.id].fullProfiles.push({
                                firstName: res?.elements[0]?.firstName,
                                lastName: res?.elements[0]?.lastName,
                                full_name: res?.elements[0]?.firstName + ' ' + res?.elements[0]?.lastName,
                                birthDateMonth: res?.elements[0]?.birthDateOn?.month,
                                birthDateDay: res?.elements[0]?.birthDateOn?.day,
                                headline: res?.elements[0]?.headline,
                                scrapeType: 'DEEP',
                                trackingId: res?.elements[0]?.trackingId,
                                summary: res?.elements[0]?.summary,
                                versionTag: res?.elements[0]?.versionTag,
                                locationName: res?.elements[0]?.geoLocation?.geo?.country?.defaultLocalizedName,
                                geoName: res?.elements[0]?.geoLocation?.geo?.defaultLocalizedName,
                                industry: res?.elements[0]?.industry?.name,
                                isInfluencer: res?.elements[0]?.influencer,
                                countryCode: res?.elements[0]?.location?.countryCode,
                                experience: experiences,
                                picture: res?.elements[0]?.profilePicture?.displayImageReference?.vectorImage?.rootUrl + '' + res?.elements[0]?.profilePicture?.displayImageReference?.vectorImage?.artifacts[3]?.fileIdentifyingUrlPathSegment,
                                schoolName: res?.elements[0]?.profileEducations?.elements[0]?.schoolName,
                                fieldOfStudy: res?.elements[0]?.profileEducations?.elements[0]?.degreeName,
                                entityUrn: res?.elements[0]?.profileEducations?.elements[0]?.entityUrn,
                                ...currentCompany,
                                profileCertifications: res?.elements[0]?.profileCertifications?.elements,
                                profileCourses: res?.elements[0]?.profileCourses?.elements,
                                profileEducations: educations,
                                profileSkills: skills,
                                completeExperiences: experiencesRes
                            })
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
        }, 5000 + Math.floor(Math.random() * 25000))

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

                        fetch(companiesUrl.replace('<KEYWORD>', company), { method: 'GET', headers: { 'csrf-token': this.state.csrfToken, 'x-restli-protocol-version': '2.0.0' } }).then((res) => res.json())
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
                            this.setState({ isSearching: true })

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