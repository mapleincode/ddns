/*
 * @Author: maple
 * @Date: 2020-09-22 02:39:31
 * @LastEditors: maple
 * @LastEditTime: 2021-03-18 18:17:45
 */

import request from 'request-promise';
import { FetchLocalIPFunction } from '../type/ddns.type';

const fetchLocalIP: FetchLocalIPFunction = async function ipme (): Promise<string> {
    return await request('https://icanhazip.com/');
};
export default fetchLocalIP;
