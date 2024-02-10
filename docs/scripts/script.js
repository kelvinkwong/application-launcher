function httpGet(data, cb) {
    var url = data;
    var xmlHttp = new XMLHttpRequest();

    if (typeof data == 'object') {
        url = data.url;
    }

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            cb(xmlHttp.response);
    }

    xmlHttp.open("GET", url, true); // true for asynchronous

    if (typeof data == 'object' && data.apiHeaders) {
        var key = null, value = null;
        for (key in data.apiHeaders) {
            value = data.apiHeaders[key];
            xmlHttp.setRequestHeader(key, value);
        }
    }

    xmlHttp.send();
}

function publish_app_history(){
    let history = JSON.parse(localStorage.getItem('history'));
    history = history ? history : [];

    history.unshift({'name': 'exit'})
    for ([index, app] of history.entries())
        app.name = index + '. ' + app.name
    publish_container(history, 'history');
}

function load_apps() {
    let url = util.get_query_parameter('apps');
    url = url ? url : './resources/apps.json';
    
    httpGet(url, function (response) {
        let json = JSON.parse(response);
        publish_container(json.apps, 'apps');
        set_application_focus(0);
        auto_select_application();
    });
}

function publish_container(apps, target) { 
    let parent = document.getElementById(target);
    let ul = document.createElement('ul');
    parent.appendChild(ul)
    for ([idx, app] of apps.entries()) {
        let li = document.createElement('li');
        li.textContent = app.name
        li.setAttribute('class', 'app-line');
        li.setAttribute('uri', app.uri);
        ul.appendChild(li);
    }
}

function get_selected_app_element(){
    return document.getElementsByClassName('app-line-selected')[0];
}

function set_application_focus(direction){
    let apps_div = document.getElementById('apps');
    let current_app = get_selected_app_element();
    if (current_app)
        current_app.setAttribute('class', 'app-line');
    let next_app = null;

    if (direction == 'next'){
        next_app = current_app.nextElementSibling;
        if (next_app === null){
            let apps = current_app.parentElement.childNodes;
            next_app = apps[0]
        }
    }
    else if (direction == 'previous'){
        next_app = current_app.previousElementSibling;
        if (next_app === null){
            let apps = current_app.parentElement.childNodes;
            next_app = apps[apps.length - 1];
        }
    }
    else if (Number.isInteger(direction)){
        next_app = apps_div.childNodes[0].childNodes[direction];
    }

    next_app.setAttribute('class', 'app-line-selected');
    apps_div.scrollTop = next_app.offsetTop - 90;
}

function display_useragent(){
    document.getElementById('useragent').innerHTML = navigator.userAgent;
}

function display_host(){
    document.getElementById('host').innerHTML = window.location.href;
}

function bodyonload(){
    console.log("body loaded");
    display_host();
    display_useragent();
    publish_app_history();
    load_apps();

    document.onkeydown = onKey;
}


/* ------ Controls --------------------*/
function onKey(event) {
    // if (util.get_query_parameter('keylogger'))
    //     console.log(event.keyCode);
    switch (event.keyCode || event) {
        case KEY_0:
            window.close();
            break;

        case KEY_1:
        case KEY_2:
        case KEY_3:
        case KEY_4:
        case KEY_5:
        case KEY_6:
        case KEY_7:
        case KEY_8:
        case KEY_9:
            launch_app_from_history(event.keyCode - KEY_0);
            break;

        case KEY_R:
        case KEY_RED:
            console.log("Reload");
            location.reload()
            break;

        case KEY_OK:
            onOkPressed();
            break;

        case KEY_UP:
            set_application_focus('previous');
            break;

        case KEY_DOWN:
            set_application_focus('next');
            break;

        case KEY_BACK:
            window.history.back();
            break;

        default:
            break;
    }
}

function launch_app_from_history(index){
    app = document.getElementById('history').childNodes[0].childNodes[index];
    launch(app.innerText, app.getAttribute('uri'));
}

function auto_select_application(){
    setApplicationIndex = util.get_query_parameter('setApplicationIndex', 'integer');
    autoLaunchApplication = util.get_query_parameter('autoLaunchApplication', 'boolean');
    if (setApplicationIndex)
        set_application_focus(setApplicationIndex);
    if (autoLaunchApplication)
        onOkPressed();
}

function onOkPressed() {
    app = get_selected_app_element();
    save_launch_history(app.innerText, app.getAttribute('uri'));
    launch(app.innerText, app.getAttribute('uri'));
}

function launch(app_name, app_url) {
    console.log('Launching: "' + app_name + '" via: ' + app_url);
    location.href = app_url;
}

function save_launch_history(app_name, app_url){
    let history = localStorage.getItem('history');
    history = history ? JSON.parse(history) : [];

    if (history[0] && app_name == history[0].name)
        return;

    let newHistory = {'name': app_name, 'uri': app_url};
    history.unshift(newHistory);
    history = history.slice(0,9);
    localStorage.setItem('history', JSON.stringify(history));
}