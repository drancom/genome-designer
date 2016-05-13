import Instance from './Instance';
import invariant from 'invariant';
import cloneDeep from 'lodash.clonedeep';
import BlockDefinition from '../schemas/Block';
import { getSequence, writeSequence } from '../middleware/sequence';
import AnnotationDefinition from '../schemas/Annotation';
import md5 from 'md5';
import color from '../utils/generators/color';
import { dnaStrict, dnaLoose } from '../utils/dna/dna';
import * as validators from '../schemas/fields/validators';
import safeValidate from '../schemas/fields/safeValidate';

const idValidator = (id) => safeValidate(validators.id(), true, id);

export default class Block extends Instance {
  constructor(input) {
    super(input, BlockDefinition.scaffold(), { metadata: { color: color() } });
  }

  //return an unfrozen JSON, no instance methods
  static classless(input) {
    return Object.assign({}, cloneDeep(new Block(input)));
  }

  static validate(input, throwOnError = false) {
    return BlockDefinition.validate(input, throwOnError);
  }

  clone(parentInfo) {
    const [ firstParent ] = this.parents;
    const parentObject = Object.assign({
      id: this.id,
      projectId: this.projectId,
      version: (firstParent && firstParent.projectId === this.projectId) ? firstParent.version : null,
    }, parentInfo);
    return super.clone(parentObject);
  }

  /* project related */

  getProjectId() {
    return this.projectId;
  }

  setProjectId(projectId) {
    invariant(idValidator(projectId) || projectId === null, 'project is required, or null to mark unassociated');
    return this.mutate('projectId', projectId);
  }

  /* checks */

  isFiller() {
    return !this.metadata.name && this.hasSequence() && !this.metadata.color;
  }

  /* metadata things */

  getName() {
    // called many K per second, no es6 fluffy stuff in here.
    if (this.metadata.name) return this.metadata.name;
    if (this.rules.role) return this.rules.role;
    if (this.components.length) return 'New Construct';
    if (this.metadata.initialBases) return this.metadata.initialBases;
    return 'New Block';
  }

  setRole(role) {
    return this.mutate('rules.role', role);
  }

  setName(newName) {
    const filler = this.isFiller();
    const renamed = this.mutate('metadata.name', newName);

    if (filler) {
      return this.setColor();
    }
    return renamed;
  }

  setColor(newColor = color()) {
    return this.mutate('metadata.color', newColor);
  }

  /* components */

  addComponent(componentId, index) {
    const spliceIndex = Number.isInteger(index) ? index : this.components.length;
    const newComponents = this.components.slice();
    newComponents.splice(spliceIndex, 0, componentId);
    return this.mutate('components', newComponents);
  }

  removeComponent(componentId) {
    const spliceIndex = this.components.findIndex(compId => compId === componentId);

    if (spliceIndex < 0) {
      console.warn('component not found'); // eslint-disable-line
      return this;
    }

    const newComponents = this.components.slice();
    newComponents.splice(spliceIndex, 1);
    return this.mutate('components', newComponents);
  }

  //pass index to be at after spliced out
  moveComponent(componentId, newIndex) {
    const spliceFromIndex = this.components.findIndex(compId => compId === componentId);

    if (spliceFromIndex < 0) {
      console.warn('component not found'); // eslint-disable-line
      return this;
    }

    const newComponents = this.components.slice();
    newComponents.splice(spliceFromIndex, 1);
    const spliceIntoIndex = (Number.isInteger(newIndex) && newIndex <= newComponents.length) ?
      newIndex :
      newComponents.length;
    newComponents.splice(spliceIntoIndex, 0, componentId);
    return this.mutate('components', newComponents);
  }

  /* sequence */

  hasSequence() {
    return !!this.sequence.md5;
  }

  /**
   * @description Retrieve the sequence of the block. Retrieves the sequence from the server, since it is stored in a file, returning a promise.
   * @param format {String} accepts 'raw', 'fasta', 'genbank'
   * @returns {Promise} Promise which resolves with the sequence value, or (resolves) with null if no sequence is associated.
   */
  getSequence(format = 'raw') {
    const sequenceMd5 = this.sequence.md5;
    if (!sequenceMd5) {
      return Promise.resolve(null);
    }
    return getSequence(sequenceMd5, format);
  }

  /**
   * @description Writes the sequence for a block
   * @param sequence {String}
   * @param useStrict {Boolean}
   * @returns {Promise} Promise which resolves with the udpated block
   */
  setSequence(sequence, useStrict = false) {
    const sequenceLength = sequence.length;
    const sequenceMd5 = md5(sequence);

    const validatorStrict = new RegExp(`^[${dnaStrict}]*$`, 'gi');
    const validatorLoose = new RegExp(`^[${dnaLoose}]*$`, 'gi');

    const validator = !!useStrict ? validatorStrict : validatorLoose;

    if (!validator.test(sequence)) {
      return Promise.reject('sequence has invalid characters');
    }

    return writeSequence(sequenceMd5, sequence, this.id)
      .then(() => {
        const updatedSequence = {
          md5: sequenceMd5,
          length: sequenceLength,
          initialBases: sequence.substr(0, 5),
        };
        return this.merge({ sequence: updatedSequence });
      });
  }

  /* annotations */

  annotate(annotation) {
    invariant(AnnotationDefinition.validate(annotation), `'annotation is not valid: ${annotation}`);
    return this.mutate('sequence.annotations', this.sequence.annotations.concat(annotation));
  }

  removeAnnotation(annotation) {
    const annotationName = typeof annotation === 'object' ? annotation.name : annotation;
    invariant(typeof annotationName === 'string', `Must pass object with Name or annotation Name directly, got ${annotation}`);

    const annotations = this.sequence.annotations.slice();
    const toSplice = annotations.findIndex((ann) => ann.name === annotationName);

    if (toSplice < 0) {
      console.warn('annotation not found'); // eslint-disable-line
      return this;
    }

    annotations.splice(toSplice, 1);
    return this.mutate('sequence.annotations', annotations);
  }
}
