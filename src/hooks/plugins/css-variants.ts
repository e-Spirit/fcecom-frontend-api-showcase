import { EcomApi, EcomHooks, LogLevel } from 'fcecom-frontend-api-client';

const ecomApi = new EcomApi('https://example.com', LogLevel.INFO);

ecomApi.addHook(EcomHooks.PREVIEW_INITIALIZED, async ({ TPP_BROKER }) => {
  const DISABLED_CLASS_NAME = `tpp - disabled - node`;
  const __originalPosition = Symbol();
  const _variant = Symbol();

  document.head.appendChild(
    document.createElement(`div`)
  ).innerHTML = `<style>.tpp-icon-variant::after { -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6.996 12.713V5.584a.87.87 0 01.87-.871h9.13v6M5.996 12.737v3h4.372v3.018a1 1 0 001 1h1a1 1 0 001-1v-3.018h4.628v-3zM9.514 8.923v-4M12.003 7.923v-3M14.491 6.923v-2"/></svg>') center center / cover no-repeat;}</style>`;

  const wait = (millis = 0) => new Promise<void>((resolve) => setTimeout(() => resolve(), millis));

  const callCssVariantsScript = async (action, $node, status) => {
    const { id: dataProviderId, language, componentPath = [] } = status;
    const [listEditorName, listEditorIndex] = componentPath;
    const node = $node.matches(`[data-variant-editor-name]`) ? $node : $node.querySelector(`[data-variant-editor-name]`);
    const { variant: variantEditorValue, variantEditorName } = node.dataset;

    const payload = {
      action,
      dataProviderId: `${dataProviderId}`,
      language,
      ...(listEditorName && listEditorIndex ? { listEditorName, listEditorIndex } : {}),
      variantEditorName,
      variantEditorValue,
    };

    return await TPP_BROKER.execute(`script:css_variants`, payload);
  };

  const saveChanges = async ({ $node, status }) => {
    disable($node);
    await callCssVariantsScript(`save`, $node, status);
    const previewId = $node.closest(`[data-preview-id]:not([data-preview-id^="#"])`).dataset.previewId;
    TPP_BROKER.triggerChange(previewId);
    enable($node);
  };

  const disable = (element = document.body, spinner = element !== document.body) => {
    if (spinner) {
      element[__originalPosition] = element.style.position;
      element.style.position = `relative`;
      element.insertAdjacentHTML(
        `beforeend`,
        `<div class="fs-section-blur">
            <div class="fs-section-spinner-wrapper">
                <span class="fs-section-spinner"></span>
            </div>
        </div>`
      );
    } else {
      element.classList.toggle(DISABLED_CLASS_NAME, true);
    }
  };

  const enable = (element: HTMLElement = document.body) => {
    if (__originalPosition in element) {
      element.style.position = element[__originalPosition];
      delete element[__originalPosition];
      const spinner = element.querySelector(`.fs-section-blur`);
      spinner && spinner.parentElement.removeChild(spinner);
    } else {
      element.classList.remove(DISABLED_CLASS_NAME);
    }
  };

  TPP_BROKER.registerButton(
    {
      css: `tpp-icon-variant`,
      label: 'Style Variants',
      supportsComponentPath: true,
      isVisible: async (scope) =>
        (scope.$node.matches(`[data-variant-editor-name]`) || scope.$node.querySelector(`[data-variant-editor-name]`)) && scope.status?.permissions?.change,
      getItems: async ({ $node, status, $button }) => {
        $node[_variant] = $node.dataset.variant || '';
        const variantValues = await callCssVariantsScript(`labels`, $node, status);
        if (variantValues.success === false) {
          console.warn('Unable to retrieve variant names', { variantValues, $node, status });
          return [];
        }
        const values = variantValues.map(({ value }) => value);

        wait(1).then(() => {
          Array.from($button.querySelectorAll(`li`)).forEach((element: HTMLElement, i) => {
            element.addEventListener(`mouseenter`, () => ($node.dataset.variant = values[i]));
            element.addEventListener(`mouseleave`, () => ($node.dataset.variant = $node[_variant]));
          });
        });

        return variantValues.map(({ value, label }) => ({
          value,
          label: label + (value == $node[_variant] ? ` ✓` : ``),
        }));
      },

      execute: async (scope, item) => {
        const node = scope.$node.matches(`[data-variant-editor-name]`) ? scope.$node : scope.$node.querySelector(`[data-variant-editor-name]`);
        if (item && node[_variant] != item.value) {
          node.dataset.variant = node[_variant] = item.value;
          await saveChanges(scope);
        }
      },
    },
    0 // Button index
  );
});
