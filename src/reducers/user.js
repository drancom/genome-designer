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
import invariant from 'invariant';
import * as ActionTypes from '../constants/ActionTypes';

const flashedUser = global.flashedUser || {};
const initialState = {
  userid: flashedUser.userid || null,
  email: flashedUser.email || null,
  firstName: flashedUser.firstName || null,
  lastName: flashedUser.lastName || null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.USER_SET_USER:
    invariant(typeof action.user === 'object', 'user must be object (can be empty)');
    const {
      userid = null,
      email = null,
      firstName = null,
      lastName = null,
    } = action.user;

    return Object.assign({}, state, {
      userid,
      email,
      firstName,
      lastName,
    });

  default :
    return state;
  }
}
