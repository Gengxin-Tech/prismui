(function () {
  'use strict';

  const customerData = {
    customers: [
      {
        id: 1,
        company: '华辰科技',
        owner: '陈卓',
        status: '已签约',
        updatedAt: '今天 14:32'
      },
      {
        id: 2,
        company: '远山供应链',
        owner: '徐文',
        status: '跟进中',
        updatedAt: '今天 11:08'
      },
      {
        id: 3,
        company: '澄海制造',
        owner: '林悦',
        status: '待确认',
        updatedAt: '昨天 17:46'
      },
      {
        id: 4,
        company: '北辰物流',
        owner: '周清',
        status: '已签约',
        updatedAt: '昨天 10:20'
      }
    ]
  };

  const supplierData = {
    suppliers: [
      {
        id: 1,
        company: '启明精工',
        industry: '智能制造',
        owner: '李桐',
        risk: '低风险',
        score: 92
      },
      {
        id: 2,
        company: '云帆数据',
        industry: '企业服务',
        owner: '何川',
        risk: '复核中',
        score: 76
      },
      {
        id: 3,
        company: '天衡物流',
        industry: '供应链',
        owner: '许言',
        risk: '中风险',
        score: 68
      },
      {
        id: 4,
        company: '知行软件',
        industry: '软件服务',
        owner: '周宁',
        risk: '低风险',
        score: 95
      }
    ]
  };

  const createToastAction = (message, msgType = 'success') => ({
    actionType: 'toast',
    args: {
      msg: message,
      msgType,
      position: 'top-right'
    }
  });

  const customerSchema = {
    type: 'page',
    title: '客户管理',
    toolbar: [
      {
        type: 'button',
        label: '新建客户',
        level: 'primary',
        actionType: 'drawer',
        drawer: {
          title: '新建客户',
          size: 'md',
          body: {
            type: 'form',
            mode: 'horizontal',
            actions: [],
            body: [
              {
                type: 'input-text',
                name: 'company',
                label: '客户名称',
                required: true
              },
              {
                type: 'input-text',
                name: 'owner',
                label: '负责人'
              },
              {
                type: 'select',
                name: 'status',
                label: '阶段',
                options: ['待确认', '跟进中', '已签约']
              },
              {
                type: 'textarea',
                name: 'remark',
                label: '跟进记录'
              }
            ]
          }
        }
      }
    ],
    body: [
      {
        type: 'form',
        mode: 'inline',
        wrapWithPanel: false,
        className: 'm-b-md',
        body: [
          {
            type: 'input-text',
            name: 'keyword',
            placeholder: '搜索客户名称',
            clearable: true
          },
          {
            type: 'select',
            name: 'status',
            placeholder: '全部状态',
            clearable: true,
            options: ['待确认', '跟进中', '已签约']
          },
          {
            type: 'button',
            label: '查询',
            level: 'primary',
            onEvent: {
              click: {
                actions: [createToastAction('筛选条件已应用')]
              }
            }
          }
        ]
      },
      {
        type: 'table',
        source: '${customers}',
        columns: [
          {name: 'company', label: '客户名称'},
          {name: 'owner', label: '负责人'},
          {
            name: 'status',
            label: '阶段',
            type: 'mapping',
            map: {
              已签约: '<span class="label label-success">已签约</span>',
              跟进中: '<span class="label label-warning">跟进中</span>',
              待确认: '<span class="label label-default">待确认</span>'
            }
          },
          {name: 'updatedAt', label: '更新时间'},
          {
            type: 'operation',
            label: '操作',
            buttons: [
              {
                type: 'button',
                label: '查看',
                level: 'link',
                actionType: 'drawer',
                drawer: {
                  title: '${company}',
                  size: 'sm',
                  body: {
                    type: 'property',
                    column: 1,
                    items: [
                      {label: '负责人', content: '${owner}'},
                      {label: '当前阶段', content: '${status}'},
                      {label: '最近更新', content: '${updatedAt}'}
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  };

  const formSchema = {
    type: 'page',
    title: '供应商基础资料',
    body: {
      type: 'form',
      mode: 'horizontal',
      horizontal: {
        left: 3,
        right: 9
      },
      body: [
        {
          type: 'input-text',
          name: 'company',
          label: '企业名称',
          required: true,
          placeholder: '请输入完整企业名称'
        },
        {
          type: 'select',
          name: 'industry',
          label: '所属行业',
          searchable: true,
          options: ['智能制造', '企业服务', '供应链', '软件服务']
        },
        {
          type: 'input-text',
          name: 'creditCode',
          label: '统一社会信用代码',
          validations: {
            minLength: 18,
            maxLength: 18
          }
        },
        {
          type: 'radios',
          name: 'cooperationType',
          label: '合作类型',
          value: 'strategic',
          options: [
            {label: '战略供应商', value: 'strategic'},
            {label: '常规供应商', value: 'normal'}
          ]
        },
        {
          type: 'textarea',
          name: 'description',
          label: '业务说明',
          minRows: 3,
          placeholder: '补充服务范围、合作区域与交付能力'
        }
      ],
      actions: [
        {
          type: 'button',
          label: '保存草稿',
          onEvent: {
            click: {
              actions: [createToastAction('草稿已保存', 'info')]
            }
          }
        },
        {
          type: 'button',
          label: '提交审核',
          level: 'primary',
          onEvent: {
            click: {
              actions: [createToastAction('供应商资料已提交审核')]
            }
          }
        }
      ]
    }
  };

  const tableSchema = {
    type: 'page',
    title: '供应商名录',
    body: {
      type: 'table',
      source: '${suppliers}',
      columns: [
        {name: 'company', label: '企业'},
        {name: 'industry', label: '行业'},
        {name: 'owner', label: '负责人'},
        {
          name: 'risk',
          label: '风险等级',
          type: 'mapping',
          map: {
            低风险: '<span class="label label-success">低风险</span>',
            复核中: '<span class="label label-info">复核中</span>',
            中风险: '<span class="label label-warning">中风险</span>'
          }
        },
        {
          name: 'score',
          label: '准入评分',
          type: 'progress',
          stripe: true,
          map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success']
        },
        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              type: 'button',
              label: '详情',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '${company}',
                body: {
                  type: 'property',
                  items: [
                    {label: '行业', content: '${industry}'},
                    {label: '负责人', content: '${owner}'},
                    {label: '风险等级', content: '${risk}'},
                    {label: '准入评分', content: '${score}'}
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  };

  const feedbackSchema = {
    type: 'page',
    title: '弹窗与反馈',
    body: [
      {
        type: 'alert',
        level: 'info',
        body: '以下按钮均由 UI Schema 动作系统触发，弹窗与提示使用当前版本的正式组件。',
        showCloseButton: false
      },
      {
        type: 'button-toolbar',
        className: 'm-t-lg',
        buttons: [
          {
            type: 'button',
            label: '打开 Dialog',
            level: 'primary',
            actionType: 'dialog',
            dialog: {
              title: '审核结果确认',
              body: {
                type: 'form',
                actions: [],
                body: [
                  {
                    type: 'radios',
                    name: 'result',
                    label: '审核结论',
                    value: 'pass',
                    options: [
                      {label: '通过', value: 'pass'},
                      {label: '退回修改', value: 'reject'}
                    ]
                  },
                  {
                    type: 'textarea',
                    name: 'remark',
                    label: '审核意见'
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '打开 Drawer',
            actionType: 'drawer',
            drawer: {
              title: '供应商详情',
              size: 'md',
              body: {
                type: 'property',
                column: 1,
                items: [
                  {label: '企业名称', content: '启明精工'},
                  {label: '所属行业', content: '智能制造'},
                  {label: '准入状态', content: '风险复核中'},
                  {label: '负责人', content: '李桐'}
                ]
              }
            }
          },
          {
            type: 'button',
            label: '发送 Toast',
            onEvent: {
              click: {
                actions: [createToastAction('审核记录已保存')]
              }
            }
          }
        ]
      }
    ]
  };

  const actionSchema = {
    type: 'page',
    title: '供应商准入流程',
    body: [
      {
        type: 'steps',
        value: 2,
        steps: [
          {title: '资料提交', description: '基础信息与资质文件'},
          {title: '风险复核', description: '当前处理节点'},
          {title: '协议签署'},
          {title: '完成准入'}
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'property',
        column: 2,
        items: [
          {label: '当前负责人', content: '风控组 / 李桐'},
          {label: '要求完成时间', content: '今天 18:00'},
          {label: '风险结论', content: '待补充财务材料'},
          {label: '流程状态', content: '处理中'}
        ]
      },
      {
        type: 'button-toolbar',
        className: 'm-t-lg',
        buttons: [
          {
            type: 'button',
            label: '补充材料',
            actionType: 'drawer',
            drawer: {
              title: '补充风险材料',
              body: {
                type: 'form',
                actions: [],
                body: [
                  {
                    type: 'input-file',
                    name: 'files',
                    label: '材料附件',
                    autoUpload: false
                  },
                  {
                    type: 'textarea',
                    name: 'remark',
                    label: '补充说明'
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '通过复核',
            level: 'primary',
            actionType: 'dialog',
            dialog: {
              title: '确认通过风险复核',
              body: '通过后流程将进入协议签署节点。'
            }
          }
        ]
      }
    ]
  };

  const demos = {
    customer: {
      title: '客户管理',
      mode: 'Page / Form / Table / Drawer',
      schema: customerSchema,
      data: customerData
    },
    form: {
      title: '表单联动',
      mode: 'Form / 数据录入',
      schema: formSchema,
      data: {}
    },
    table: {
      title: '数据表格',
      mode: 'Table / 数据展示',
      schema: tableSchema,
      data: supplierData
    },
    feedback: {
      title: '弹窗与反馈',
      mode: 'Dialog / Drawer / Toast',
      schema: feedbackSchema,
      data: {}
    },
    action: {
      title: '页面行为',
      mode: 'Steps / 行为按钮',
      schema: actionSchema,
      data: {}
    }
  };

  const escapeHtml = value =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const highlightJson = value => {
    const json = escapeHtml(JSON.stringify(value, null, 2));

    return json.replace(
      /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g,
      (match, key, string, bool, number) => {
        if (key) {
          return `<span class="key">${key}</span>`;
        }
        if (string) {
          return `<span class="str">${string}</span>`;
        }
        if (bool) {
          return `<span class="bool">${bool}</span>`;
        }
        if (number) {
          return `<span class="num">${number}</span>`;
        }
        return match;
      }
    );
  };

  const codeBlock = document.querySelector('#codeBlock');
  const previewTitle = document.querySelector('#previewTitle');
  const surfaceMode = document.querySelector('#surfaceMode');
  const previewShell = document.querySelector('#previewShell');
  let selectedDemo = 'customer';
  let selectedCode = 'schema';
  let primaryRuntime;
  let capabilityRuntime;

  const getRenderProps = demo => ({
    data: demo.data,
    locale: 'zh-CN',
    theme: 'cxd'
  });

  const renderCode = () => {
    const demo = demos[selectedDemo];
    codeBlock.innerHTML = highlightJson(
      selectedCode === 'schema' ? demo.schema : demo.data
    );
  };

  const updatePrimaryDemo = demoName => {
    const demo = demos[demoName];
    if (!demo) {
      return;
    }

    selectedDemo = demoName;
    previewTitle.textContent = `${demo.title} / 真实渲染`;
    renderCode();
    primaryRuntime.updateSchema(demo.schema, getRenderProps(demo));
  };

  const updateCapabilityDemo = demoName => {
    const demo = demos[demoName];
    if (!demo) {
      return;
    }

    surfaceMode.textContent = demo.mode;
    capabilityRuntime.updateSchema(demo.schema, getRenderProps(demo));
  };

  const initSchemaRuntime = () => {
    if (typeof window.amisRequire !== 'function') {
      document.querySelectorAll('.schema-runtime-status').forEach(status => {
        status.textContent = 'UI Schema renderer 加载失败，请刷新页面重试。';
      });
      return;
    }

    const runtime = window.prismuiRequire('prismui/embed');
    const overlayRoot = document.querySelector('#schemaOverlayRoot');
    const env = {
      getModalContainer: () => overlayRoot,
      toastPosition: 'top-right'
    };

    primaryRuntime = runtime.embed(
      '#schemaPreview',
      demos.customer.schema,
      getRenderProps(demos.customer),
      env
    );
    capabilityRuntime = runtime.embed(
      '#capabilityPreview',
      demos.form.schema,
      getRenderProps(demos.form),
      env
    );
    renderCode();

    document.querySelectorAll('[data-schema-demo]').forEach(button => {
      button.addEventListener('click', () => {
        document
          .querySelectorAll('[data-schema-demo]')
          .forEach(item => item.classList.remove('on'));
        button.classList.add('on');
        updatePrimaryDemo(button.dataset.schemaDemo);
      });
    });

    document.querySelectorAll('[data-capability]').forEach(button => {
      button.addEventListener('click', () => {
        document
          .querySelectorAll('[data-capability]')
          .forEach(item => item.classList.remove('on'));
        button.classList.add('on');
        updateCapabilityDemo(button.dataset.capability);
      });
    });
  };

  document.querySelectorAll('[data-code]').forEach(button => {
    button.addEventListener('click', () => {
      document
        .querySelectorAll('[data-code]')
        .forEach(item => item.classList.remove('on'));
      button.classList.add('on');
      selectedCode = button.dataset.code;
      renderCode();
    });
  });

  document.querySelectorAll('[data-device]').forEach(button => {
    button.addEventListener('click', () => {
      document
        .querySelectorAll('[data-device]')
        .forEach(item => item.classList.remove('on'));
      button.classList.add('on');
      previewShell.classList.toggle(
        'is-mobile',
        button.dataset.device === 'mobile'
      );
    });
  });

  document.querySelectorAll('[data-install]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.install;

      document.querySelectorAll('[data-install]').forEach(item => {
        const isActive = item === button;
        item.classList.toggle('on', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      document.querySelectorAll('[data-install-panel]').forEach(panel => {
        const isActive = panel.dataset.installPanel === target;
        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);
      });
    });
  });

  const sections = [...document.querySelectorAll('.chapter')];
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
  const intro = document.querySelector('#intro');
  const siteNav = document.querySelector('.nav');
  let navFrame;

  const updateNavTheme = () => {
    cancelAnimationFrame(navFrame);
    navFrame = requestAnimationFrame(() => {
      const introBoundary =
        intro.offsetTop + intro.offsetHeight - siteNav.offsetHeight;
      document.body.classList.toggle(
        'at-intro',
        window.scrollY < introBoundary
      );
    });
  };

  window.addEventListener('scroll', updateNavTheme, {passive: true});
  window.addEventListener('resize', updateNavTheme);
  updateNavTheme();

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      chapterLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${visible.target.id}`
        );
      });
    },
    {threshold: [0.35, 0.55, 0.75]}
  );
  sections.forEach(section => observer.observe(section));

  window.addEventListener('beforeunload', () => {
    primaryRuntime?.unmount();
    capabilityRuntime?.unmount();
  });

  initSchemaRuntime();
})();
