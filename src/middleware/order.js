/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { orderApiPath } from './paths';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import Order from '../models/Order';

// likely want a registry like for inventory and hit their respective functions for each foundry

// todo - handle errors, make consistent
//hack - passing combinations for now because easy to generate on client, but should just generate on the server
export const submitOrder = (order, foundry = 'egf', positionalCombinations) => {
  invariant(foundry === 'egf', 'must submit a foundry (right now, only egf works');
  invariant(Order.validateSetup(order), 'order be valid partial order (prior to ID + foundry data)');
  invariant(positionalCombinations, 'must pass positional combinations - object with key constructId, value is array returned from block selector blockGetPositionalCombinations. This is a bit hacky, but the way it is for now...');

  const url = orderApiPath(`${order.projectId}`);
  const stringified = JSON.stringify({
    foundry,
    order,
    positionalCombinations,
  });

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json());
};

const getQuote = (foundry, order) => {
  invariant(false, 'not implemented');
};

export const getOrder = (projectId, orderId, avoidCache = false) => {
  const url = orderApiPath(`${projectId}/${orderId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

export const getOrders = (projectId, avoidCache = false) => {
  const url = orderApiPath(`${projectId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};
