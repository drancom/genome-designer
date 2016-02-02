import { expect } from 'chai';
import * as persistence from '../../../server/data/persistence';

describe('Data', () => {
  describe('persistence', () => {
    it('projectExists() check if project exists');
    it('blockExists() check if block exists');
    it('projectGet() returns null if doesnt exist');
    it('projectGet() returns project if does exist');
    it('blockGet() returns null if doesnt exist');
    it('blockGet() returns block if does exist');
    it('projectCreate() creates a git repo for the project');
    it('projectCreate() creates a git commit with the initial version');
    it('projectCreate() rejects if exists');
    it('blockCreate() creates a block folder');
    it('blockCreate() rejects if exists');
    it('projectWrite() writes to an existing project');
    it('projectWrite() creates repo if necessary');
    it('projectWrite() allows arbitrary data');
    it('blockWrite() makes the project commit');
    it('blockWrite() allows arbitrary data');
    it('projectDelete() deletes the folder');
    it('blockDelete() deletes block');
    it('blockDelete() creates a commit');
    it('sequenceExists() checks if sequence file exists');
    it('sequenceGet() returns the sequence as a string');
    it('sequenceWrite() sets the sequence string');
  });
});
