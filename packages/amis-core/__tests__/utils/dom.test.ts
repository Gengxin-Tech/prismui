import {resolveDOMElement} from '../../src/utils/dom';

describe('resolveDOMElement', () => {
  it('returns DOM elements directly', () => {
    const node = document.createElement('div');

    expect(resolveDOMElement(node)).toBe(node);
  });

  it('unwraps wrapped component refs to reach the DOM node', () => {
    const node = document.createElement('div');
    const wrapped = {
      getWrappedInstance() {
        return {
          rootRef: {
            current: node
          }
        };
      }
    };

    expect(resolveDOMElement(wrapped)).toBe(node);
  });

  it('unwraps nested current refs to reach the DOM node', () => {
    const node = document.createElement('div');
    const ref = {
      current: {
        current: node
      }
    };

    expect(resolveDOMElement(ref)).toBe(node);
  });

  // ResultBox 类组件实例的真实形态：实例上直接持有 rootRef 字段
  it('unwraps a class instance holding a rootRef to reach the DOM node', () => {
    const node = document.createElement('div');
    const instance = {
      rootRef: {
        current: node
      }
    };

    expect(resolveDOMElement(instance)).toBe(node);
  });

  it('returns null for objects that cannot be resolved', () => {
    expect(resolveDOMElement({foo: 'bar'})).toBeNull();
    expect(resolveDOMElement(42)).toBeNull();
  });
});
