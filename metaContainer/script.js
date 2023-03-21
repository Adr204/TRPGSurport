/**
 * @todo focus機構作る
 * @todo 関数を整理する
 */

const minimize = "fa-down-left-and-up-right-to-center";
const maximize = "fa-up-right-and-down-left-from-center"
const appendHTML = `<li>
<textarea name="" id="" cols="30" rows="10" class="area" data-is-focus="true"></textarea>
<button class="copy-btn"><i class="fa-regular fa-clipboard"></i></button>
<button class="modify-btn"><i class="fa-solid fa-plus"></i></button>
<button class="resize-btn"><i class="fa-solid fa-down-left-and-up-right-to-center"></i></button>
</li>`;
// let values = {};
let toggle = false;

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", e => {
        switch(e.target.className) {
            case "copy-btn": copy(e); break;
            case "modify-btn": modify(e); break;
            case "resize-btn": resize(e); break;
            default: break;
        }
    })

    document.addEventListener("keydown", e => {
        if(e.key == "Tab" && e.target.classList.contains("area")) {
            e.preventDefault();
            indent(e);
        } else if(e.key == "Shift") {
            shiftToggle(true);
        }
    })
    document.addEventListener("keyup", e => {
        if(e.key == "Shift") {
            shiftToggle(false);
        }
    });
})

function keepValue() {
    let textareas = [...document.getElementsByTagName("textarea")];
    // console.log("textareas", textareas);
    let values = {};
    textareas.forEach((v, i) => {
        v.id = `tmp_id_${i}`;
        values[v.id] = v.value;
    });
    // console.info("storeValue", values);
    return values;
}
function restoreValue(values) {
    Object.keys(values).forEach(key => {
        // console.info("key", key);
        let target = document.getElementById(key);
        // console.log("target", target);
        target.value = values[key];
        target.id = '';
    })
}

function node2Str() {
    const construction = document.getElementById("construction");
    let str = construction.innerHTML;
    // console.log(str);
    return str;
}

function str2Node(str) {
    const construction = document.getElementById("construction");
    construction.innerHTML = str;
}

function save() {
    let values = keepValue();
    let str = node2Str();
    restoreValue(values);
    
    values = JSON.stringify(values);
    localStorage.setItem("node", str);
    localStorage.setItem("value", values);
}

function load() {
    let str = localStorage.getItem("node");
    let values = localStorage.getItem("value");
    values = JSON.parse(values);
    str2Node(str);
    restoreValue(values);
}

function copy(e) {
    // クリップボードにコピー
    let value = e.target.previousElementSibling.value;
    copy_to_clipboard(value);
}

function modify(e) {
    // セクションの追加/削除
    let target = e.target.parentElement;

    if(!toggle) {
        // 追加処理
        let values = keepValue();
        target.outerHTML = `${target.outerHTML}${appendHTML}`;
        focus();
        restoreValue(values);
    } else {
        // 削除処理
        if(isOnly(target)) {
            if(target.parentElement.id == "construction") return;
            target.parentElement.remove();
        } else {
            target.remove();
        }
    }
} 

function resize(e) {
    // サイズの変更
    let target = e.target.parentElement.firstElementChild;
    target.classList.toggle("mini");
    if(target.classList.contains("mini")) {
        target.style = "width: 228px; height: 18px;";
        e.target.firstElementChild.classList.remove(minimize);
        e.target.firstElementChild.classList.add(maximize);
    } else {
        target.style = "width: 228px; height: 180px;";
        e.target.firstElementChild.classList.remove(maximize);
        e.target.firstElementChild.classList.add(minimize);
    }
}

function indent(e) {
    let values = keepValue();

    let target = e.target.parentElement;
    addFocusTag(target.firstElementChild);
    if(e.shiftKey) {
        if(target.parentElement.id != "construction") { 
            let outer = target.outerHTML;
            let prevList = target.parentElement.parentElement;
            (isOnly(target) ? target.parentElement : target).remove();
            prevList.outerHTML = `${prevList.outerHTML}${outer}`;
        }
    } else {
        if(!isFirst(target))  {
            let prevElement = target.previousElementSibling;
            if(prevElement.lastElementChild.tagName == "UL") {
                prevElement.lastElementChild.innerHTML = `${prevElement.lastElementChild.innerHTML}${target.outerHTML}`;
            } else {
                prevElement.innerHTML = `${prevElement.innerHTML}<ul>${target.outerHTML}</ul>`;
            }
            target.remove();
        }
    }
    focus();
    restoreValue(values);
}

function focus() {
    let element = document.querySelector("[data-is-focus=true]");
    console.info(element);
    element.focus();
    removeFocusTag(element);
}

function addFocusTag(e) {
    if(e.tagName != "TEXTAREA") return false;
    e.dataset.isFocus = true;
}

function removeFocusTag(e) {
    e.dataset.isFocus = false;
}

function removeAllFocusTag() {
    let elements = document.querySelectorAll("[data-is-focus=true]");
    elements.forEach(i => {
        console.log(i);
        removeFocusTag(i);
    })
}

function shiftToggle(bool) {
    const plusBtns = [...document.getElementsByClassName("fa-plus")];
    const minusBtns = [...document.getElementsByClassName("fa-minus")];
    if(bool) {
        plusBtns.forEach(v => {
            v.className = "fa-solid fa-minus";
        })
    } else {
        minusBtns.forEach(v => {
            v.className = "fa-solid fa-plus";
        })
    }
    toggle = bool;
}

function isFirst(element) {
    return element.parentElement.firstElementChild == element;
}
function isLast(element) {
    return element.parentElement.lastElementChild == element;
}
function isOnly(element) {
    return isFirst(element) && isLast(element);
}

function copy_to_clipboard(value) {
    if(navigator.clipboard) {
        var copyText = value;
        navigator.clipboard.writeText(copyText).then(function() {
            console.log('コピーしました。');
        });
    } else {
        console.log('対応していません。');
    }
}