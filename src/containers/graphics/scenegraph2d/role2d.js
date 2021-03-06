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
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import Node2D from './node2d';
import kT from '../views/layoutconstants.js';

/**
 * basic rectangular node
 */
export default class SBOL2D extends Node2D {

  constructor(props) {
    super(Object.assign({}, props, {
      glyph: 'role',
      textAlign: 'left',
      textIndent: kT.textPad,
      color: '#1D222D',
      showChildren: true,
    }));
    this.dots = new Node2D({
      sg: this.sg,
      glyph: 'dots',
    });
    this.appendChild(this.dots);
  }
  /**
   * mostly for debugging
   * @return {String}
   */
  toString() {
    return `SBOL = glyph:${this.glyph || 'NONE'} text:${this.text || ''}`;
  }

  /**
   * get the preferred width / height of this block as condensed or fully expanded
   *
   */
  getPreferredSize(str) {
    // measure actual text plus some padding
    const roleWidth = this.roleName ? kT.roleIcon + kT.textPad : 0;
    const size = this.measureText(str).add(new Vector2D(kT.textPad * 2 + roleWidth + kT.contextDotsW, 0));
    return size;
  }

  update() {
    // base class
    const el = Node2D.prototype.update.call(this);
    // context dots, shown only in hover state
    this.dots.set({
      bounds: new Box2D(
        this.width - kT.contextDotsW,
        (this.height - kT.contextDotsH) / 2,
        kT.contextDotsW,
        kT.contextDotsH),
      visible: this.hover,
    });
    // return as per base class
    return el;
  }
}
