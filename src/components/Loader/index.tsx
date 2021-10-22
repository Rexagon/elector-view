import * as React from 'react';

import {CurrentElectionData, ElectorData} from "../../electorData";

export type LoaderProps = {
    hasTonProvider: boolean,
    hasPermissions: boolean,
    hasData: boolean,
}

const Loader: React.FC<LoaderProps> = ({hasTonProvider, hasPermissions, hasData}) => {
    return <section className="section is-fullheight is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
        <div className="loader loader--huge"/>
        {!hasTonProvider && <small>Loading provider...</small>}
        {hasTonProvider && !hasPermissions && <small>Requesting permissions...</small>}
        {hasTonProvider && hasPermissions && !hasData && <small>Parsing elector state...</small>}
    </section>
}

export default Loader;
