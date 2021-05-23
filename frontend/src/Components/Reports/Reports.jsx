import React from 'react';
import { Link } from 'react-router-dom';
import ReportsSummary from '../ReportsSummary/ReportsSummary';
import ReportsBills from '../ReportsBills/ReportsBills';
import ReportsSettle from '../ReportsSettle/ReportsSettle';

const Reports = (props) => {
  const { id: paramId } = props.match.params;
  return (
    <div>
      <div>
        <h1> Summary </h1>
        <div>
          <ReportsSettle groupId={paramId} />
        </div>

        <hr />

        <h1> Individual Report </h1>
        <div>
          <ReportsSummary groupId={paramId} />
        </div>

        <hr />

        <h1> All acounts </h1>
        <div>
          <ReportsBills groupId={paramId} />
        </div>
      </div>
      <p>
        <Link
          className=""
          data-toggle="collapse"
          to="/"
          role="button"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Create your own group!
        </Link>
      </p>
    </div>
  );
};

export default Reports;
