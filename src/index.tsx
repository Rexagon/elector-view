import * as React from 'react';
import * as ReactDOM from "react-dom";
import ton, {Address, AddressLiteral, DEFAULT_PROVIDER_PROPERTIES} from 'ton-inpage-provider';

import {ELECTOR_DATA_STRUCTURE} from './electorData'

const ELECTOR: Address = new AddressLiteral('-1:3333333333333333333333333333333333333333333333333333333333333333');

const App: React.FC = () => {
    const [hasTonProvider, setHasTonProvider] = React.useState(false);
    const [hasPermissions, setHasPermissions] = React.useState(false);

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
                console.warn('Elector not found');
                return;
            }

            const {data} = await ton.splitTvc(state.boc);
            if (data == null) {
                console.warn('Elector data not found');
                return;
            }

            const unpacked = await ton.unpackFromCell({
                structure: ELECTOR_DATA_STRUCTURE,
                boc: data,
                allowPartial: false,
            });

            console.log(unpacked)
        })().catch(console.error);
    }, [inProgress]);

    return <>Has provider: {hasTonProvider ? 'true' : 'false'}, has permissions: {hasPermissions ? 'true' : 'false'}</>
}

ReactDOM.render(
    <React.StrictMode><App/></React.StrictMode>,
    document.getElementById('root')
)
