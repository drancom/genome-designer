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
import React, { PropTypes } from 'react';

import '../../styles/ListOption.css';

export default function ListOption({ option, selected, onClick }) {
  return (
    <div className={'ListOption' +
                    (selected ? ' selected' : '')}
         onClick={() => onClick(option)}>
      <span className="ListOption-check">
        &#x2714;
      </span>
      <span className="ListOption-name">
        {option.metadata.name}
      </span>
    </div>
  );
}

ListOption.propTypes = {
  option: PropTypes.shape({
    id: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
  }).isRequired,
  defaultName: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};
