import React, { useContext, useEffect, useState } from 'react';
import 'regenerator-runtime'
import './Company.css';
import AppContext from './AppContext';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OrganizationChart from "@dabeng/react-orgchart";
import OrgNode from "./custom-org-node.js";
interface Props {
  title: string;
}


const Company: React.FC<Props> = ({ title }: Props) => {

  const { profiles, selectedCompany } = useContext(AppContext);
  const [orgData, setOrgData] = useState({});

  useEffect(() => {
    console.log(orgData)
  }, [orgData]);

  setTimeout(() => {
    let orgDataObj = {}
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    profiles[params?.selectedJob]?.fullProfiles.map((profile, id) => {
      if (id == 0) {
        orgDataObj['id'] = `n${id + 1}`
        orgDataObj['name'] = `${profile?.firstName} ${profile?.lastName}`
        orgDataObj['title'] = `${profile?.headline}`
        orgDataObj['children'] = []
      } else if ([1, 20, 4, 8, 19, 2, 6].includes(id)) {
        orgDataObj['children'].push({
          id: `n${id + 1}`,
          name: `${profile?.firstName} ${profile?.lastName}`,
          title: `${profile?.headline}`
        })
      } else if ([3, 15, 5, 7, 11].includes(id)) {
        if (orgDataObj['children'] && orgDataObj['children']?.length > 4) {
          if (orgDataObj['children'][4]['children']) {
            orgDataObj['children'][4]['children'].push({
              id: `n${id + 1}`,
              name: `${profile?.firstName} ${profile?.lastName}`,
              title: `${profile?.headline}`
            })
          } else {
            orgDataObj['children'][4]['children'] = [{
              id: `n${id + 1}`,
              name: `${profile?.firstName} ${profile?.lastName}`,
              title: `${profile?.headline}`
            }]
          }

        }
      }

    })

    setOrgData(orgDataObj)

  }, 5000)

  const ds = {
    id: "n1",
    name: "Lao Lao",
    title: "general manager",
    children: [
      { id: "n2", name: "Bo Miao", title: "department manager" },
      {
        id: "n3",
        name: "Su Miao",
        title: "department manager",
        children: [
          { id: "n4", name: "Tie Hua", title: "senior engineer" },
          {
            id: "n5",
            name: "Hei Hei",
            title: "senior engineer",
            children: [
              { id: "n6", name: "Dan Dan", title: "engineer" },
              { id: "n7", name: "Xiang Xiang", title: "engineer" }
            ]
          },
          { id: "n8", name: "Pang Pang", title: "senior engineer" }
        ]
      },
      { id: "n9", name: "Hong Miao", title: "department manager" },
      {
        id: "n10",
        name: "Chun Miao",
        title: "department manager",
        children: [{ id: "n11", name: "Yue Yue", title: "senior engineer" }]
      }
    ]
  };

  return <AppContext.Consumer>
    {
      (context: any) => (
        <div className="CompanyContainer">
          <h3>What company are you hiring for?</h3>
          <p>Company: {context.company}</p>
          <div className="mb-3">
            <Typeahead
              id="company-typeahead"
              onInputChange={(text) => context.textChange(text)}
              onChange={(selected) => {
                context.changeSelectedCompany(selected)
              }}
              options={context.companiesTypeAhead}
            />
          </div>

          <div className="mb-3">
            <button className="btn btn-primary btn-sm" onClick={() => context.runSearch(0)}>Search</button>
          </div>

          {
            (orgData) ?
              <OrganizationChart
                datasource={orgData}
                chartClass="myChart"
                NodeTemplate={OrgNode}
              />
              : null
          }

        </div>)
    }

  </AppContext.Consumer>;
};

export default Company;
