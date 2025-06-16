"use strict";
/// <reference types="@figma/plugin-typings" />
figma.showUI(__html__);
figma.ui.postMessage({ type: 'hello', message: 'Hello from main.ts!' });
