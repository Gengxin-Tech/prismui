/**
 * @file 虚拟的渲染器，也就是说其实并不存在渲染器，而是弄个假的用来编辑。
 */
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {getReactElementRef, mergeRefs} from 'prismui-core';
import {RendererInfo} from '../plugin';
import {
  EditorNodeContext,
  EditorNodeType,
  getEditorNodeFacade,
  resolveEditorNodeFacade
} from '../store/node';

export interface VRendererProps extends RendererInfo {
  path: string;
  data?: any;
  widthMutable?: boolean;
  children?: React.ReactNode;
}

export class VRenderer extends React.Component<VRendererProps> {
  static contextType = EditorNodeContext;
  editorNode: EditorNodeType;
  parentNode: EditorNodeType;
  rootDom: HTMLElement | null = null;
  unmountCleanupTimer?: ReturnType<typeof setTimeout>;

  setRootRef = (ref: HTMLElement | null) => {
    this.rootDom = ref;
  };

  UNSAFE_componentWillMount() {
    const {data, path, widthMutable, ...info} = this.props;
    this.parentNode = resolveEditorNodeFacade(this.context as any)!;
    this.editorNode = this.parentNode.addChild({
      id: info.id,
      type: info.type,
      label: info.name,
      path: this.props.path,
      schemaPath: info.schemaPath,
      info: info,
      getData: () => this.props.data,
      widthMutable,
      memberIndex: info.memberIndex
    });
  }

  componentDidMount() {
    this.cancelUnmountCleanup();

    if (this.editorNode && isAlive(this.editorNode)) {
      this.markDom(this.editorNode.id);
    }
  }

  componentDidUpdate() {
    if (this.editorNode && isAlive(this.editorNode)) {
      this.markDom(this.editorNode.id);
    }
  }

  componentWillUnmount() {
    this.scheduleUnmountCleanup();
  }

  cancelUnmountCleanup() {
    if (this.unmountCleanupTimer) {
      clearTimeout(this.unmountCleanupTimer);
      this.unmountCleanupTimer = undefined;
    }
  }

  scheduleUnmountCleanup() {
    this.cancelUnmountCleanup();

    this.unmountCleanupTimer = setTimeout(() => {
      this.unmountCleanupTimer = undefined;

      if (
        this.editorNode &&
        isAlive(this.editorNode) &&
        this.parentNode &&
        isAlive(this.parentNode)
      ) {
        this.parentNode.removeChild(this.editorNode);
      }
    }, 0);
  }

  /**
   * 弄点标记
   */
  markDom(id: string) {
    const root = this.rootDom;

    if (!root) {
      return;
    }

    if (!this.editorNode || !isAlive(this.editorNode)) {
      return;
    }

    const info = this.editorNode.info!;
    let dom = info.wrapperResolve
      ? info.wrapperResolve(root, this.props as any)
      : root;
    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom =>
      dom.setAttribute('data-editor-id', id)
    );
  }

  renderChildren() {
    let attached = false;

    return React.Children.map(this.props.children, child => {
      if (attached || !React.isValidElement(child)) {
        return child;
      }

      attached = true;

      if (typeof child.type === 'string') {
        return React.cloneElement(child, {
          ref: mergeRefs(getReactElementRef(child), this.setRootRef)
        } as any);
      }

      return React.cloneElement(child, {
        forwardedRef: mergeRefs(
          (child.props as any).forwardedRef,
          this.setRootRef
        )
      } as any);
    });
  }

  render() {
    return (
      <EditorNodeContext.Provider value={getEditorNodeFacade(this.editorNode)}>
        {this.renderChildren()}
      </EditorNodeContext.Provider>
    );
  }
}
