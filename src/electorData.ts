import {MergeOutputObjectsArray} from 'ton-inpage-provider'

export const ELECTOR_DATA_STRUCTURE = [
    {
        type: 'optional(cell)',
        name: 'elect',
    },
    {
        type: 'map(uint256,gram)',
        name: 'credits'
    },
    {
        type: 'map(uint32,tuple)',
        name: 'past_elections',
        components: [
            {
                type: 'uint32',
                name: 'unfreeze_at'
            },
            {
                type: 'uint32',
                name: 'stake_held',
            },
            {
                type: 'uint256',
                name: 'vset_hash',
            },
            {
                type: 'map(uint256,tuple)',
                name: 'frozen_dict',
                components: [
                    {
                        type: 'uint256',
                        name: 'addr',
                    },
                    {
                        type: 'uint64',
                        name: 'weight',
                    },
                    {
                        type: 'gram',
                        name: 'validator_stake'
                    }
                ] as const,
            },
            {
                type: 'gram',
                name: 'total_stake',
            },
            {
                type: 'gram',
                name: 'bonuses'
            },
            {
                type: 'map(uint256,tuple)',
                name: 'complaints',
                components: [
                    {
                        type: 'uint8',
                        name: '_header',
                    },
                    {
                        type: 'cell',
                        name: 'complaint',
                    },
                    {
                        type: 'map(uint16,bool)',
                        name: 'voters'
                    },
                    {
                        type: 'uint256',
                        name: 'vset_id',
                    },
                    {
                        type: 'int64',
                        name: 'weight_remaining'
                    }
                ] as const,
            }
        ] as const,
    },
    {type: 'gram', name: 'grams'},
    {type: 'uint32', name: 'active_id'},
    {type: 'uint256', name: 'active_hash'},
] as const;

export const CURRENT_ELECTION_DATA = [
    {
        type: 'uint32',
        name: 'elect_at',
    },
    {
        type: 'uint32',
        name: 'elect_close',
    },
    {
        type: 'gram',
        name: 'min_stake',
    },
    {
        type: 'gram',
        name: 'total_stake',
    },
    {
        type: 'map(uint256,tuple)',
        name: 'members',
        components: [
            {
                type: 'gram',
                name: 'msg_value'
            },
            {
                type: 'uint32',
                name: 'created_at',
            },
            {
                type: 'uint32',
                name: 'max_factor',
            },
            {
                type: 'uint256',
                name: 'src_addr'
            },
            {
                type: 'uint256',
                name: 'adnl_addr'
            }
        ] as const
    },
    {
        type: 'bool',
        name: 'failed',
    },
    {
        type: 'bool',
        name: 'finished'
    }
] as const;

export type ElectorData = MergeOutputObjectsArray<typeof ELECTOR_DATA_STRUCTURE>
export type CurrentElectionData = MergeOutputObjectsArray<typeof CURRENT_ELECTION_DATA>;
