import {destroy} from 'mobx-state-tree';
import {EditorManager} from '../src/manager';
import {MainStore} from '../src/store/editor';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  if (!global.ResizeObserver) {
    global.ResizeObserver = ResizeObserverMock as any;
  }
});

test('disposed editor manager ignores late renderer initialization', async () => {
  const store = MainStore.create(
    {
      theme: 'cxd'
    },
    {}
  );
  const manager = new EditorManager({theme: 'cxd'} as any, store);

  manager.dispose();
  destroy(store);

  await expect(manager.hackRenderers([])).resolves.toBeUndefined();
});
