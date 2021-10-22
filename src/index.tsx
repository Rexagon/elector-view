import * as React from 'react';
import * as ReactDOM from "react-dom";
import classNames from 'classnames'
import ton, {Address, AddressLiteral, DEFAULT_PROVIDER_PROPERTIES} from 'ton-inpage-provider';

import {CURRENT_ELECTION_DATA, CurrentElectionData, ELECTOR_DATA_STRUCTURE, ElectorData} from './electorData'

import Workspace from './components/Workspace'
import Loader from './components/Loader'

import './styles/main.scss';
import {convertError} from "./utils";

const ELECTOR: Address = new AddressLiteral('-1:3333333333333333333333333333333333333333333333333333333333333333');

const App: React.FC = () => {
    const [hasTonProvider, setHasTonProvider] = React.useState(false);
    const [hasPermissions, setHasPermissions] = React.useState(false);
    const [error, setError] = React.useState<string>();
    const [electorData, setElectorData] = React.useState<ElectorData>();
    const [currentElectionData, setCurrentElectionData] = React.useState<CurrentElectionData>();

    React.useEffect(() => {
        ton.ensureInitialized({
            ...DEFAULT_PROVIDER_PROPERTIES,
            requireFullProvider: false,
        }).then(async () => {
            setHasTonProvider(true);
            (await ton.subscribe('permissionsChanged')).on('data', event => {
                setHasPermissions(event.permissions.tonClient === true);
            })

            const currentProviderState = await ton.getProviderState();
            if (currentProviderState.permissions.tonClient === true) {
                setHasPermissions(true);
            } else {
                await ton.requestPermissions({
                    permissions: ['tonClient']
                })
            }
        }).catch(console.error);
    }, []);

    const inProgress = !hasTonProvider || !hasPermissions;

    React.useEffect(() => {
        if (inProgress) {
            return;
        }

        (async () => {
            const {state} = await ton.getFullContractState({
                address: ELECTOR,
            });
            if (state == null) {
                setError('Elector not found');
                return;
            }

            const {data} = await ton.splitTvc(state.boc);
            if (data == null) {
                setError('Elector data not found');
                return;
            }

            const {data: electorData} = await ton.unpackFromCell({
                structure: ELECTOR_DATA_STRUCTURE,
                boc: data,
                allowPartial: false,
            });
            setElectorData(electorData);

            if (electorData.elect != null) {
                const {data: currentElectionData} = await ton.unpackFromCell({
                    structure: CURRENT_ELECTION_DATA,
                    boc: electorData.elect,
                    allowPartial: false
                })
                setCurrentElectionData(currentElectionData)
            }
        })().catch((e: any) => {
            setError(convertError(e))
        });
    }, [inProgress]);

    const hasData = electorData != null;

    if (error != null) {
        return <section
            className={classNames(
                'section',
                'is-fullheight',
                'is-flex',
                'is-flex-direction-column',
                'is-justify-content-center',
                'has-text-centered',
                'has-text-danger-dark'
            )}
        >
            {error}
        </section>
    }

    if (!hasTonProvider || !hasPermissions || !hasData) {
        return <Loader
            hasTonProvider={hasTonProvider}
            hasPermissions={hasPermissions}
            hasData={hasData}
        />
    }

    return <Workspace
        electorData={electorData}
        currentElectionData={currentElectionData}
    />
}

ReactDOM.render(
    <React.StrictMode><App/></React.StrictMode>,
    document.getElementById('root')
)
