const durationByPerson = document.getElementById("minutes-by-person");
const memberList = document.getElementById("memberList");
const members = document.getElementById("members");
var interactiveChange = true;

export function setupSync(socket, mobName) {
    socket.on('change length', length => durationByPerson.value = length);
    socket.on('change members', changedMembers => {
        updateMembers(changedMembers);
        updateSettingsMembers(changedMembers);
    });

    durationByPerson.onchange = function () {
        socket.emit("change length", mobName, this.value);
    };

    memberList.onchange = function () {
        if (interactiveChange) {
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

export function updateMembers(changedMembers) {
    members.innerHTML = "";
    const li_ids = ["driver", "navigator", "mobbers"];
    const i_classes = ["fas fa-dharmachakra", "fas fa-drafting-compass", "fas fa-user-secret"];
    for (var index = 0; index < changedMembers.length; index++) {
        const i = document.createElement("i");
        const li = document.createElement("li");
        if (index < li_ids.length) {
            li.id = li_ids[index];
            i.className = i_classes[index];
        } else {
            li.id = li_ids[li_ids.length - 1];
            i.className = i_classes[i_classes.length -1 ];
        }
        li.appendChild(i);
        li.append(changedMembers[index]);
        members.appendChild(li);
    }
}

export function updateSettingsMembers(changedMembers) {
    interactiveChange = false;
    $('#memberList').tagsinput('removeAll');
    changedMembers.forEach(member => {
        $('#memberList').tagsinput('add', member);
    });
    interactiveChange = true;
}

export function membersAsArray() {
    return memberList.value.split(",");
}