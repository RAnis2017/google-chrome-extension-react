import React from 'react';
import './Company.css';
import AppContext from './AppContext';

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
            <input type="text" className="form-control" value={context.company} onChange={(e) => context.textChange(e.target.value)} />
          </div>
        </div>)
    }

  </AppContext.Consumer>;
};

export default Company;
