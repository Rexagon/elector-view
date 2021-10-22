import Decimal from 'decimal.js';
import moment from 'moment';

export const convertTons = (amount?: string) => new Decimal(amount || '0').div('1000000000').toFixed();

export const convertError = (error: any) => {
    if (typeof error.message === 'string') {
        return error.message;
    } else {
        return error.toString();
    }
};

export const convertDate = (timestamp: number) => {
    return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
};
