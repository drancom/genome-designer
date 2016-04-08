import Glyph2D from '../glyph2d';

import kT from '../../../views/layoutconstants';
import symbols from '../../../../../inventory/sbol';
import { setAttribute } from '../../../utils';

export default class SBOLGlyph2D extends Glyph2D {

  /**
   * represents a block with, possibly an SBOL symbol and a context menu
   * that is shown only on hover.
   */
  constructor(node) {
    super(node);
    // basic div block
    this.el = document.createElement('div');
    this.el.className = 'sbol-glyph';
    // possible sbol symbol, the div is a container for a SVG which we will clone
    // and style from an in document template
    this.svgContainer = document.createElement('div');
    this.svgContainer.className = 'sbol-icon';
    this.el.appendChild(this.svgContainer);
    // possible child indicator
    this.triangle = document.createElement('div');
    this.triangle.className = 'nw-triangle';
    this.el.appendChild(this.triangle);
    // add our outer container to the node element
    this.node.el.appendChild(this.el);
  }

  /**
   * render latest changes
   */
  update() {
    // basic rectangle
    const sw = this.node.strokeWidth;
    this.el.style.left = -(sw / 2) + 'px';
    this.el.style.top = -(sw / 2) + 'px';
    this.el.style.width = (this.node.width + sw) + 'px';
    this.el.style.height = (this.node.height + sw) + 'px';
    this.el.style.backgroundColor = this.node.fill;
    this.el.style.border = sw ? `${sw}px solid ${this.node.stroke}` : 'none';
    if (this.node.sbolName) {

      if (this.sbolName !== this.node.sbolName) {

        this.sbolName = this.node.sbolName;

        // remove existing svg
        while (this.svgContainer.firstChild) {
          this.svgContainer.removeChild(this.svgContainer.firstChild);
        }

        // style / size the container
        this.svgContainer.style.left = (this.node.width - kT.sbolIcon - 2 - kT.contextDotsW) + 'px';
        this.svgContainer.style.top = (this.node.height / 2 - kT.sbolIcon / 2) + 'px';
        this.svgContainer.style.width = kT.sbolIcon + 'px';

        // clone the appropriate template
        const templateId = `sbol-svg-${this.sbolName}`;
        const svg = document.getElementById(templateId).cloneNode(true);
        // ensure svg is stroked in black
        setAttribute(svg, 'stroke', 'black', true);
        // remove the ID attribute from the clone to avoid duplicates
        svg.removeAttribute('id');
        // add to the container
        this.svgContainer.appendChild(svg);

        // display the svg
        this.svgContainer.style.display = 'block';
      }

    } else {
      this.svgContainer.style.display = 'none';
    }
    this.triangle.style.display = this.node.hasChildren ? 'block' : 'none';
  }
}
