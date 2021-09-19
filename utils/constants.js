module.exports = {
    companiesUrl: 'https://www.linkedin.com/voyager/api/typeahead/hitsV2?keywords=<KEYWORD>&origin=OTHER&q=type&type=COMPANY',
    searchResultsOnCompany: 'https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-120&origin=FACETED_SEARCH&q=all&query=(flagshipSearchIntent:SEARCH_SRP,queryParameters:(currentCompany:List(<COMPANY_CODE>),resultType:List(PEOPLE)),includeFiltersInResponse:false)&start=<START>',
    getFullProfileByID: 'https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=<PROFILE_ID>&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-47',
    getAllSkills: 'https://www.linkedin.com/voyager/api/identity/profiles/<PROFILE_ID>/skillCategory?includeHiddenEndorsers=true',
    getAllExperiences: 'https://www.linkedin.com/voyager/api/identity/dash/profilePositions?q=viewee&profileUrn=<PROFILE_URN>&COUNT=50', // use urn but instead of : replace it with %3A
    getAllEducations: 'https://www.linkedin.com/voyager/api/identity/dash/profileEducations?q=viewee&profileUrn=<PROFILE_URN>&COUNT=50', // use urn but instead of : replace it with %3A
    getCompanyDetails: 'https://www.linkedin.com/voyager/api/organization/companies?decorationId=com.linkedin.voyager.deco.organization.web.WebFullCompanyMain-37&q=universalName&universalName=<COMPANY_NAME>',
}


// API FOR BROWSING MEMBERS WITH DISTANCE FOR AN API https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/browsemapWithDistance

// Check API For Relationships https://www.linkedin.com/voyager/api/relationships/discovery?count=10&q=cohort&reasons=List((reasonContext:PYMK_ENTITY,sourceType:PYMK_ENTITY,reasonObjects:List(urn%3Ali%3Afsd_profile%3AACoAABYbQeYBDvhP9B1CoF87arJ2g1ssZLNaPcs)))&start=0

// JOB Seeker preference https://www.linkedin.com/voyager/api/jobs/jobSeekerPreferences?decorationId=com.linkedin.voyager.deco.jobs.web.WebCareerInterests-24


// SAVED SEARCHES https://www.linkedin.com/voyager/api/search/savedSearches


// PROFILE PICTURES https://www.linkedin.com/voyager/api/voyagerPremiumDashUpsellSlotContent?decorationId=com.linkedin.voyager.dash.deco.premium.PremiumUpsellSlotContent-22&q=viewee&slotUrn=urn%3Ali%3Afsd_premiumUpsellSlot%3APROFILE_MESSAGE_ACTION&vieweeProfileUrn=urn%3Ali%3Afsd_profile%3AACoAAA-3MKsBxVV2VkbtoKZOtAAoa8nRxfJ3Nno

// PROFILE DETAILS https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=raza-anis-genesishex&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfile-65


// highlight of user https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/highlights


// RECENT ACTIVITIES https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/recentActivities



// ALL SKILLS https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/skillCategory?includeHiddenEndorsers=true


// RECOMMENDATIONS https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/recommendations?q=received&recommendationStatuses=List(VISIBLE)

// RECOMMENDATIONS GIVEN https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/recommendations?q=given

// FOLLOWING UNIMPORTANT https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/following?count=7&q=followedEntities

// MIGHT BE IMPORTANT

// https://www.linkedin.com/voyager/api/voyagerLearningGraphQL?includeWebMetadata=true&variables=(vieweeId:nadia-parello-6b2260a4)&&queryId=voyagerLearningDashLearningRecommendations.9f56243c8a55b513e21823f880cbde85e326d1d9


// https://www.linkedin.com/voyager/api/identity/profiles/nadia-parello-6b2260a4/promoVisibility?contextType=NON_SELF_PROFILE_VIEW&promoTypes=List(SUGGESTED_ENDORSEMENTS,IM_FOLLOWS_DRAWER,APP_DOWNLOAD,PROFILE_PREMIUM_TIP_PRIVATE_BROWSING,PROFILE_PREMIUM_TIP_OPEN_PROFILE,PROFILE_PREMIUM_TIP_INMAIL)&q=findActivePromos&vieweeMemberId=nadia-parello-6b2260a4

// https://www.linkedin.com/voyager/api/voyagerIdentityDashProfiles?decorationId=com.linkedin.voyager.dash.deco.identity.profile.ProfileWithTopCardLiveVideo-10&memberIdentity=nadia-parello-6b2260a4&q=memberIdentity


/////?????????? ???////// FULL COMPLETE PROFILE
// https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=raza-anis-genesishex&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-47
// https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=nadia-parello-6b2260a4&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-47



// https://www.linkedin.com/voyager/api/organization/companies?decorationId=com.linkedin.voyager.deco.organization.web.WebFullCompanyMain-37&q=universalName&universalName=qavi-technologies

// https://www.linkedin.com/voyager/api/identity/profiles/raza-anis-genesishex/profileContactInfo

// https://www.linkedin.com/voyager/api/organization/companies?decorationId=com.linkedin.voyager.deco.organization.web.WebFullCompanyMain-37&q=companyUrn&companyUrn=urn%3Ali%3Afsd_company%3A1441



// MY URN urn%3Ali%3Afsd_profile%3AACoAABpLf8gBNoz6LqzchXoPE_ZfzQfUZCM9abw