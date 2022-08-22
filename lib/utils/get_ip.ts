/*
 * @Author: maple
 * @Date: 2020-09-22 02:39:31
 * @LastEditors: maple
 * @LastEditTime: 2021-03-18 18:17:45
 */

import request from 'request-promise';

async function ipme (): Promise<string> {
    const result = await request('http://icanhazip.com/');
    return result;
}

export default ipme;
