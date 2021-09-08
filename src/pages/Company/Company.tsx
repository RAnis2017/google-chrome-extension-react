import React from 'react';
import './Company.css';
import AppContext from './AppContext';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

interface Props {
  title: string;
}


const Company: React.FC<Props> = ({ title }: Props) => {

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
        </div>)
    }

  </AppContext.Consumer>;
};

export default Company;
