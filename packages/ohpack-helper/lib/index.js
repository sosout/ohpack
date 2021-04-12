'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('assert');
const utils = require('node-tool-utils');
const merge = require('webpack-merge');

exports.getCompileTempDir = (project, filename = '') => {
  return path.join(os.tmpdir(), 'ohpack', project, filename);
};

exports.getOhpackInfoFilepath = project => {
  return exports.getCompileTempDir(project, 'ohpack.json');
};

exports.getOhpackInfo = project => {
  if (!project) {
    const pkgfile = path.join(process.cwd(), 'package.json');
    const pkg = require(pkgfile);
    project = pkg.package || pkg.name;
  }
  const filepath = exports.getOhpackInfoFilepath(project);
  if (fs.existsSync(filepath)) {
    return utils.readFile(filepath);
  }
  return {};
};

exports.setOhpackInfo = (json, clear = false) => {
  const pkgfile = path.join(process.cwd(), 'package.json');
  const pkg = require(pkgfile);
  const project = pkg.package || pkg.name;
  assert(project, 'package.json file missing name config');
  const filepath = exports.getOhpackInfoFilepath(project);
  if (clear) {
    utils.writeFile(filepath, json);
  } else {
    const ohpackInfo = exports.getOhpackInfo(project);
    const info = merge(ohpackInfo, json);
    utils.writeFile(filepath, info);
  }
};
