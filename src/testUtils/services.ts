import { Pathway } from 'pathways-model';
import { Service } from 'pathways-objects';

export const loadingService: Service<Array<Pathway>> = {
  status: 'loading'
};

export const loadedService: Service<Array<Pathway>> = {
  status: 'loaded',
  payload: [
    {
      id: '1',
      name: 'test1',
      description: 'test1',
      library: 'test.cql',
      preconditions: [
        {
          id: '1',
          elementName: 'condition',
          expected: 'breast cancer',
          cql: 'some fancy CQL statement'
        }
      ],
      nodes: {
        Start: {
          key: 'Start',
          label: 'Start',
          transitions: [],
          type: 'start'
        }
      }
    },
    {
      id: '2',
      name: 'test2',
      description: 'test2',
      library: 'test.cql',
      preconditions: [
        {
          id: '1',
          elementName: 'condition',
          expected: 'gist cancer',
          cql: 'some fancy CQL statement'
        }
      ],
      nodes: {
        Start: {
          key: 'Start',
          label: 'Start',
          transitions: [],
          type: 'start'
        }
      }
    },
    {
      id: '3',
      name: 'test3',
      description: 'test3',
      library: 'test.cql',
      preconditions: [
        {
          id: '1',
          elementName: 'condition',
          expected: 'lung cancer',
          cql: 'some fancy CQL statement'
        }
      ],
      nodes: {
        Start: {
          key: 'Start',
          label: 'Start',
          transitions: [],
          type: 'start'
        }
      }
    }
  ]
};

export const errorService: Service<Array<Pathway>> = {
  status: 'error',
  error: new TypeError('error')
};
