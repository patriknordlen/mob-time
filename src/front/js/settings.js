const durationByPerson = document.getElementById("minutes-by-person");
const memberList = document.getElementById("memberList");
const members = document.getElementById("members");
const randomize = document.getElementById("randomize");
var syncChanges = false;

export function setupSync(socket, mobName) {
    socket.on('change length', length => durationByPerson.value = length);

    durationByPerson.onchange = function () {
        socket.emit("change length", mobName, this.value);
    };

    memberList.onchange = function () {
        if (syncChanges) {
            const memberArray = this.value.split(",");
            socket.emit("change members", mobName, memberArray);
            updateMembers(memberArray);
        }
    };
}

export function minutesByPerson() {
    if (mods.includes("fast")) return parseInt(durationByPerson.value) / 60;
    if (mods.includes("faster")) return parseInt(durationByPerson.value) / 600;
    return parseInt(durationByPerson.value);
}


export function updateMembers(changedMembers, forceUpdate=false) {
    members.innerHTML = "";
    const td_ids = ["driver", "navigator", "mobbers"];
    const i_classes = ["fas fa-dharmachakra", "fas fa-drafting-compass", "fas fa-user-secret"];
    for (var index = 0; index < changedMembers.length; index++) {
        const tr = document.createElement("tr");
        const td_icon = document.createElement("td");
        const td_name = document.createElement("td");
        const td_buttons = document.createElement("td");

        const a_up = document.createElement("a");
        a_up.id = "moveup-" + index;
        a_up.className = "fas fa-angle-up";
        a_up.onclick = function () {
            let memberArr = membersAsArray();
            let memberId = parseInt(this.id.split("-")[1]);
            let swapId = memberId > 0 ? memberId-1 : memberArr.length-1;
            [memberArr[swapId], memberArr[memberId]] = [memberArr[memberId], memberArr[swapId]];
            updateSettingsMembers(memberArr);
            memberList.onchange();
        }

        const a_down = document.createElement("a");
        a_down.id = "moveup-" + index;
        a_down.className = "fas fa-angle-down";
        a_down.onclick = function () {
            let memberArr = membersAsArray();
            let memberId = parseInt(this.id.split("-")[1]);
            let swapId = memberId < memberArr.length-1 ? memberId+1 : 0;
            [memberArr[swapId], memberArr[memberId]] = [memberArr[memberId], memberArr[swapId]];
            updateSettingsMembers(memberArr);
            memberList.onchange();
        }

        td_buttons.appendChild(a_up);
        td_buttons.appendChild(a_down);
        const i = document.createElement("i");
        if (index < td_ids.length) {
            td_name.id = td_ids[index];
            i.className = i_classes[index];
        } else {
            td_name.id = td_ids[td_ids.length - 1];
            i.className = i_classes[i_classes.length - 1];
        }
        td_icon.appendChild(i);
        td_name.appendChild(document.createTextNode(changedMembers[index]));
        tr.appendChild(td_icon);
        tr.appendChild(td_name);
        tr.appendChild(td_buttons);
        members.appendChild(tr);
    }
}

export function updateSettingsMembers(changedMembers) {
    if (JSON.stringify(changedMembers) != JSON.stringify(membersAsArray())) {
        syncChanges = false;
        $('#memberList').tagsinput('removeAll');
        changedMembers.forEach(member => {
            $('#memberList').tagsinput('add', member);
        });
        updateMembers(changedMembers);
        syncChanges = true;
    }
}

export function membersAsArray() {
    return memberList.value.split(",");
}

randomize.onclick = function() {
    var mArr = [...$('#memberList').tagsinput('items')];
    for (let i = mArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mArr[i], mArr[j]] = [mArr[j], mArr[i]];
    }

    updateSettingsMembers(mArr);
    memberList.onchange();
}

window.addEventListener(
    "DOMContentLoaded",
    () => {
        updateMembers(membersAsArray(), true);
        syncChanges = true;
    }
);
  