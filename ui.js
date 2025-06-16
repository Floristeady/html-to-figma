"use strict";
window.onmessage = (event) => {
    if (event.data.pluginMessage.type === 'hello') {
        alert(event.data.pluginMessage.message);
    }
};
