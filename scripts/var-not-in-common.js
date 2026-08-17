/**
 * 用于查找某个变量在 prismui-variables 里但不在 properties.scss 里的情况
 */

const fs = require('fs');
const path = require('path');

const prismuiVariables = fs.readFileSync(
  path.join(__dirname, '..', 'scss', 'themes', '_prismui-variables.scss'),
  {encoding: 'utf8'}
);

const commonVariables = fs.readFileSync(
  path.join(__dirname, '..', 'scss', '_properties.scss'),
  {encoding: 'utf8'}
);

const prismuiVariableSet = new Set();

prismuiVariables.match(/\-\-[\-a-zA-Z0-9]+/g).forEach(function (variable) {
  prismuiVariableSet.add(variable);
});

const commonVariableSet = new Set();

commonVariables.match(/\-\-[\-a-zA-Z0-9]+/g).forEach(function (variable) {
  commonVariableSet.add(variable);
});

for (const variable of prismuiVariableSet) {
  if (!commonVariableSet.has(variable)) {
    console.log(variable);
  }
}
